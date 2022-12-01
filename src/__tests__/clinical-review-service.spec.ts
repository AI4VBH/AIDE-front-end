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

import {
    getClinicalReviewTasks,
    getDicomFile,
    getStudy,
    updateClinicalReview,
} from "@/api/ClinicalReview/ClinicalReviewService";
import { getDefaultPagedResponse } from "@/models/common/IPagedResponse";
import { ClinicalReviewRecord } from "@/models/ClinicalReview/ClinicalReviewTask";

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

    describe("getStudy", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.get(
                    "*/clinical-review/fd04d767-ae5c-441a-87dc-89a91abaa3ec",
                    (_, res, ctx) => {
                        return res(
                            ctx.json({
                                study_date: "2022-11-11T11:11:11",
                                study: [
                                    {
                                        series_uid: "e4350707-2981-4ec2-94a0-caf2a7ce63b9",
                                        modality: "CT",
                                        files: ["FILE0001.dcm"],
                                    },
                                ],
                            }),
                        );
                    },
                ),
            );

            const result = await getStudy("fd04d767-ae5c-441a-87dc-89a91abaa3ec");

            expect(result).toMatchSnapshot();
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

    describe("getDicomFile", () => {
        it.each([400, 404, 500])(
            "calls toast with the right message when request fails",
            async (status) => {
                server.use(
                    rest.get("*/clinical-review/dicom", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await getDicomFile("FILE00001.dcm");
                } catch {
                    expect(mockToaster.error).toHaveBeenCalledWith(
                        "Something unexpected went wrong retrieving clinical review tasks",
                    );
                }
            },
        );
    });

    describe("getClinicalReviewTasks", () => {
        it.each([
            [
                1,
                10,
                "patient-id",
                undefined,
                undefined,
                "?pageNumber=1&pageSize=10&patientId=patient-id&patientName=&applicationName=",
            ],
            [
                2,
                5,
                undefined,
                "patient name",
                undefined,
                "?pageNumber=2&pageSize=5&patientId=&patientName=patient+name&applicationName=",
            ],
            [
                2,
                6,
                undefined,
                undefined,
                "app name",
                "?pageNumber=2&pageSize=6&patientId=&patientName=&applicationName=app+name",
            ],
        ])(
            "passes the query params",
            async (pageNumber, pageSize, patientId, patientName, applicationName, query) => {
                server.use(
                    rest.get("*/clinical-review", (req, res, ctx) => {
                        const search = req.url.search;

                        expect(search).toBe(query);

                        const defaultResponse = getDefaultPagedResponse<ClinicalReviewRecord>();

                        return res(ctx.json(defaultResponse));
                    }),
                );

                await getClinicalReviewTasks({
                    pageNumber,
                    pageSize,
                    patientId,
                    patientName,
                    applicationName,
                });
            },
        );

        it.each([400, 404, 500])(
            "calls toast with the right message when request fails",
            async (status) => {
                server.use(
                    rest.get("*/clinical-review", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await getClinicalReviewTasks({ pageNumber: 1, pageSize: 10 });
                } catch {
                    expect(mockToaster.error).toHaveBeenCalledWith(
                        "Something unexpected went wrong retrieving clinical review tasks",
                    );
                }
            },
        );
    });

    describe("updateClinicalReview", () => {
        it.each([
            [true, "All ok", undefined],
            [false, "Other", "Invalid"],
        ])("returns expected OK result", async (acceptance, description, reason) => {
            server.use(
                rest.put(
                    "*/clinical-review/f1558699-4e19-435d-9789-b86ff6ddd288",
                    async (req, res, ctx) => {
                        const body = await req.json();

                        expect(body).toMatchSnapshot();
                        return res(ctx.status(200));
                    },
                ),
            );

            await updateClinicalReview(
                "f1558699-4e19-435d-9789-b86ff6ddd288",
                acceptance,
                description,
                reason,
            );
        });

        it.each([400, 404, 500])(
            "calls toast with the right message when request fails",
            async (status) => {
                server.use(
                    rest.put(
                        "*/clinical-review/f1558699-4e19-435d-9789-b86ff6ddd288",
                        (_req, res, ctx) => {
                            return res(ctx.status(status));
                        },
                    ),
                );

                try {
                    await updateClinicalReview(
                        "f1558699-4e19-435d-9789-b86ff6ddd288",
                        true,
                        "",
                        "description",
                    );
                } catch {
                    expect(mockToaster.error).toHaveBeenCalledWith(
                        "Something unexpected went wrong saving your review",
                    );
                }
            },
        );
    });
});
