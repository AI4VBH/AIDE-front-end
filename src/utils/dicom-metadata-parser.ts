/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import parser, { DataSet } from "dicom-parser";
import tagLabels from "./dicom-tag-dictionary";

type DicomTag = {
    tag: string;
    vr: string;
    vm: string;
    name: string;
};

export type DicomMetadata = {
    name: string;
    value?: string;
};

function isAscii(text?: string): boolean {
    if (!text) {
        return false;
    }

    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(text);
}

function isStringVr(vr: string): boolean {
    const nonString = ["AT", "FL", "FD", "OB", "OF", "OW", "SI", "SQ", "SS", "UL", "US"];

    return !nonString.includes(vr);
}

function parseNumericalValues(
    metadataItem: DicomMetadata,
    propertyName: string,
    elementCount: number,
    elementDivider: number,
    extractor: (tag: string, index?: number) => number | undefined,
): DicomMetadata {
    metadataItem.value = `${extractor(propertyName)}`;

    for (let i = 1; i < elementCount / elementDivider; i++) {
        metadataItem.value += `\\${extractor(propertyName, i)}`;
    }

    return metadataItem;
}

function getDicomTag(tag: string): DicomTag {
    const tagIndex = `(${tag.substring(1, 5)},${tag.substring(5, 9)})`.toUpperCase();
    return tagLabels[tagIndex];
}

function dumpDataset(dataset: DataSet): DicomMetadata[] {
    const propertyNames = Object.keys(dataset.elements).sort();

    const metadata: DicomMetadata[] = [];

    propertyNames.forEach((propertyName) => {
        const element = dataset.elements[propertyName];

        if (element.tag <= "x0002ffff" || element.length <= 0 || parser.isPrivateTag(element.tag)) {
            return;
        }

        const tag = getDicomTag(element.tag);

        const metadataItem: DicomMetadata = {
            name: tag?.name ?? element.tag,
            value: undefined,
        };

        if (element.items) {
            const value: { [key: string]: string | undefined }[] = [];

            element.items.forEach((item) => {
                if (!item.dataSet) {
                    return;
                }

                const items = dumpDataset(item.dataSet);

                const vals = items.map(({ name, value }) => {
                    const obj: { [key: string]: string | undefined } = {};
                    obj[name] = value;

                    return obj;
                });

                value.push(...vals);
            });

            metadataItem.value = JSON.stringify(value, null, 2);
            metadata.push(metadataItem);

            return;
        } else if (element.fragments) {
            return;
        }

        if (!element.vr && !tag) {
            const data = dataset.string(propertyName);

            if (isAscii(data)) {
                metadataItem.value = data;
                metadata.push(metadataItem);

                return;
            }

            if (element.length !== 2 && element.length !== 4) {
                metadataItem.value = "binary data";
                metadata.push(metadataItem);

                return;
            }
        }

        const vr = element.vr ?? tag.vr;

        if (isStringVr(vr)) {
            const data = dataset.string(propertyName);

            if (isAscii(data)) {
                metadataItem.value = data;
                metadata.push(metadataItem);

                return;
            }

            if (element.length !== 2 && element.length !== 4) {
                metadataItem.value = "binary data";
                metadata.push(metadataItem);
            }
        } else if (vr === "US") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 2, (tag, index) =>
                    dataset.uint16(tag, index),
                ),
            );
        } else if (vr === "SS") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 2, (tag, index) =>
                    dataset.int16(tag, index),
                ),
            );
        } else if (vr === "UL") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 4, (tag, index) =>
                    dataset.uint32(tag, index),
                ),
            );
        } else if (vr === "SL") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 4, (tag, index) =>
                    dataset.int32(tag, index),
                ),
            );
        } else if (vr === "FD") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 8, (tag, index) =>
                    dataset.double(tag, index),
                ),
            );
        } else if (vr === "FL") {
            metadata.push(
                parseNumericalValues(metadataItem, propertyName, element.length, 4, (tag, index) =>
                    dataset.float(tag, index),
                ),
            );
        }
    });

    return metadata;
}

export function parseMetadata(byteArray: Uint8Array): DicomMetadata[] {
    const dataset = parser.parseDicom(byteArray, {
        vrCallback(tag) {
            const formatted = `(${tag.substring(1, 5)},${tag.substring(5, 9)})`.toUpperCase();
            return tagLabels[formatted] ? tagLabels[formatted].vr : undefined;
        },
    });

    return dumpDataset(dataset);
}

export function parseEncapsulatedPdf(byteArray: Uint8Array): Uint8Array | undefined {
    const dataset = parser.parseDicom(byteArray, {
        vrCallback(tag) {
            const formatted = `(${tag.substring(1, 5)},${tag.substring(5, 9)})`.toUpperCase();
            return tagLabels[formatted] ? tagLabels[formatted].vr : undefined;
        },
    });

    const documentData = dataset.elements["x00420011"];

    if (!documentData) {
        return;
    }

    return dataset.byteArray.slice(
        documentData.dataOffset,
        documentData.dataOffset + documentData.length,
    );
}
