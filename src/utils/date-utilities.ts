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

import moment from "moment";

// example:
// 27 Oct 2022 1.05pm
export const NhsDateTimeFormat = "DD-MMM-YYYY h:mma";

export const formatDateAndTimeOfArray = (
    items: any,
    itemProperty: string,
    inludeFromNow = true,
): void => {
    items.map((item: any) => {
        item[itemProperty] = formatDateAndTimeOfString(item[itemProperty], inludeFromNow);
    });
};

export function formatDateAndTimeOfTypedArray<T>(
    items: T[],
    itemProperty: keyof T,
    includeFromNow = true,
): T[] {
    return items.map((item: T) => {
        const date = item[itemProperty] as string;
        const obj = { ...item } as any;
        obj[itemProperty] = formatDateAndTimeOfString(date, includeFromNow);

        return obj;
    });
}

/// Returns date time for examples...
/// 27 Oct 2022 1.05pm (44 minutes ago)
/// 27 Oct 2022 1.05pm (20 years ago)
/// You can remove from now bit of sting by passning in false too inludeFromNow param.
export function formatDateAndTimeOfString(dateStr: string, inludeFromNow = true) {
    const dateMoment = moment(dateStr);
    if (!dateMoment.isValid()) {
        return "";
    }
    return inludeFromNow
        ? `${dateMoment.format(NhsDateTimeFormat)} (${dateMoment.fromNow()})`
        : `${dateMoment.format(NhsDateTimeFormat)}`;
}

export function formatDate(dateString: string, format = "DD-MMM-YYYY"): string {
    const date = moment(dateString);

    if (!date.isValid()) {
        return "";
    }

    return date.format(format);
}

export function formatDateTime(dateString: string, format = "DD-MMM-YYYY h:mma"): string {
    const date = moment(dateString);

    if (!date.isValid()) {
        return "";
    }

    return date.format(format);
}
