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
import dicomFile from "!url-loader!./fixtures/report-dicom.dcm";
import reportFile from "!url-loader!./fixtures/report-pdf.pdf";

export const executionsHandlers = [
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:workflowInstanceId/tasks/:executionId/artifacts`,
        (_req, res, ctx) => {
            return res(ctx.json({ "report-dicom": "report-dicom", "report-pdf": "report-pdf" }));
        },
    ),
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:workflowInstanceId/tasks/:executionId/metadata`,
        (_req, res, ctx) => {
            return res(ctx.json({ key: "value" }));
        },
    ),
    rest.get(`${window.FRONTEND_API_HOST}/executions/artifact-download`, async (req, res, ctx) => {
        const key = req.url.searchParams.get("key");

        const dicomBuffer = await fetch(dicomFile).then((resp) => resp.arrayBuffer());
        const pdfBuffer = await fetch(reportFile).then((resp) => resp.arrayBuffer());

        if (!key) {
            return res(ctx.status(400));
        }

        switch (key) {
            case "report-pdf":
                return res(
                    ctx.set("Content-Type", "application/pdf"),
                    ctx.set("Content-Length", pdfBuffer.byteLength.toString()),
                    ctx.body(pdfBuffer),
                );
            case "report-dicom":
                return res(
                    ctx.set("Content-Type", "application/dicom"),
                    ctx.set("Content-Length", dicomBuffer.byteLength.toString()),
                    ctx.body(dicomBuffer),
                );
            default:
                return res(ctx.status(404));
        }
    }),
];
