/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import { expect, test as it } from "@jest/globals";
import { dicomModalitySupported } from "@/utils/dicom-modality";

describe("dicomModalitySupported", () => {
    it.each(["", undefined, null, " "])(
        "returns false if value is '%s'",
        (value: string | undefined | null) => {
            const result = dicomModalitySupported(value as string);

            expect(result).toBe(false);
        },
    );

    it.each(["CT", "MRI", "DOC"])("returns true if the value is '%s", (value: string) => {
        const result = dicomModalitySupported(value);

        expect(result).toBe(true);
    });

    it.each(["SEG", "SR", "RTDOSE", "RTSTRUCT", "RTIMAGE", "RTPLAN", "RTRECORD"])(
        "returns false if value is '%s'",
        (value: string) => {
            const result = dicomModalitySupported(value);

            expect(result).toBe(false);
        },
    );
});
