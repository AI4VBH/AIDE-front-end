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

import { isResultOk, provideDefaultResult } from "../utils/axios-helpers";
import { expect, test as it } from "@jest/globals";
import { AxiosResponse } from "axios";

describe("axios-helpers", () => {
    describe("isResultOk", () => {
        it.each([200, 255, 299])("returns true when status code is %s", (status) => {
            const result = isResultOk({ status } as AxiosResponse);
            expect(result).toBe(true);
        });

        it.each([100, 300, 404, 500])("returns false when status code is %s", (status) => {
            const result = isResultOk({ status } as AxiosResponse);
            expect(result).toBe(false);
        });
    });

    describe("provideDefaultResult", () => {
        it("returns expected result when status is OK", () => {
            const response = { status: 200, data: ["hello", "world"] } as AxiosResponse<string[]>;

            const result = provideDefaultResult(response, [":("]);

            expect(result).toMatchSnapshot();
        });

        it("returns expected result when status is not OK", () => {
            const response = { status: 400, data: ["hello", "world"] } as AxiosResponse<string[]>;

            const result = provideDefaultResult(response, [":("]);

            expect(result).toMatchSnapshot();
        });
    });
});
