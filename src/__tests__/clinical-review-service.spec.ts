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

import { rest } from "msw";
import { setupServer } from "msw/node";
import { createMock } from "@golevelup/ts-jest";
import { expect, test as it } from "@jest/globals";
import Vue from "vue";
import { ToastApi } from "vue-toast-notification";

import { getStudy } from "../api/ClinicalReview/ClinicalReviewService";

jest.mock("vue");

const server = setupServer();
const mockToaster = createMock<ToastApi>();
Vue.$toast = mockToaster;

describe("getStudy", () => {
    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(() => {
        server.resetHandlers();
        jest.resetAllMocks();
    });

    it.each([400, 404, 500])(
        "calls toast with the right message when request fails",
        async (status) => {
            server.use(
                rest.get(
                    "*/clinical-review/bde085c7-e82b-4cf0-9b08-00a23fbb66a0",
                    (_req, res, ctx) => {
                        return res(ctx.status(status));
                    },
                ),
            );

            try {
                await getStudy("bde085c7-e82b-4cf0-9b08-00a23fbb66a0");
            } catch {
                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong retrieving clinical review tasks",
                );
            }
        },
    );
});
