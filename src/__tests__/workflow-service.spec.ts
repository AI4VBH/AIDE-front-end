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

import { rest } from "msw";
import { setupServer } from "msw/node";
import { createMock } from "@golevelup/ts-jest";
import { expect, test as it } from "@jest/globals";
import Vue from "vue";
import { ToastApi } from "vue-toast-notification";

import { getAllWorkflows } from "@/api/workflows/WorkflowService";
import { AxiosError } from "axios";

jest.mock("vue");

const server = setupServer();
const mockToaster = createMock<ToastApi>();
Vue.$toast = mockToaster;

describe("WorkflowService", () => {
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

    describe("getAllWorkflows", () => {
        it.each([[1, 10, "?pageNumber=1&pageSize=10"]])(
            "passes params correctly",
            async (page, itemsPerPage, query) => {
                server.use(
                    rest.get("*/workflows", (req, res, ctx) => {
                        const search = req.url.search;

                        expect(search).toBe(query);

                        return res(ctx.json({ totalPages: 0, totalRecords: 0, data: [] }));
                    }),
                );

                const result = await getAllWorkflows({ page, itemsPerPage });

                expect(result).toMatchSnapshot();
            },
        );
    });
});
