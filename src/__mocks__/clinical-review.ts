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
import ctSlice1 from "!url-loader!./fixtures/CT000000.dcm";
import ctSlice2 from "!url-loader!./fixtures/CT000010.dcm";
import docSlice from "!url-loader!./fixtures/DO000000.dcm";
import segSlice from "!url-loader!./fixtures/SE000000.dcm";
import srSlice from "!url-loader!./fixtures/SR000000.dcm";
import rtDoseSlice from "!url-loader!./fixtures/RTDOSE001.dcm";
import rtStructSlice from "!url-loader!./fixtures/RTSTRUCT001.dcm";
import enhancedSlice from "!url-loader!./fixtures/IM_0003.dcm";
import studyZip from "!url-loader!./fixtures/STUDY-ZIP.zip";
import { PagedClinicalReviewList } from "@/models/ClinicalReview/ClinicalReviewTask";

const tasks = [
    {
        execution_id: "111",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "111",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w1_1",
            patient_metadata: {
                patient_name: "Jonathan Doe",
                patient_id: "1299-123-232-1111",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-01T11:11:00",
    },
    {
        execution_id: "222",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "222",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w2_2",
            patient_metadata: {
                patient_name: "Jane Doe",
                patient_id: "1299-123-232-2222",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-02T11:11:00",
    },
    {
        execution_id: "333",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "333",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w3_3",
            patient_metadata: {
                patient_name: "Wednesday Addams",
                patient_id: "1299-123-232-3333",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-03T11:11:00",
    },
    {
        execution_id: "444",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "444",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w4_4",
            patient_metadata: {
                patient_name: "Pugsley Addams",
                patient_id: "1299-123-232-4444",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-04T11:11:00",
    },
    {
        execution_id: "555",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "555",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w5_5",
            patient_metadata: {
                patient_name: "Morticia Addams",
                patient_id: "1299-123-232-5555",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-05T11:11:00",
    },
    {
        execution_id: "666",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "666",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w6_6",
            patient_metadata: {
                patient_name: "Hand",
                patient_id: "1299-123-232-6666",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-06T11:11:00",
    },
    {
        execution_id: "777",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "777",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w7_7",
            patient_metadata: {
                patient_name: "Lurch",
                patient_id: "1299-123-232-7777",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-07T11:11:00",
    },
    {
        execution_id: "888",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "888",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w8_8",
            patient_metadata: {
                patient_name: "Gomez Addams",
                patient_id: "1299-123-232-8888",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-08T11:11:00",
    },
    {
        execution_id: "999",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "999",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w9_9",
            patient_metadata: {
                patient_name: "Uncle Fester Addams",
                patient_id: "1299-123-232-9999",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-09T11:11:00",
    },
    {
        execution_id: "000",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "000",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "w0_0",
            patient_metadata: {
                patient_name: "Cousin Itt Addams",
                patient_id: "1299-123-232-0000",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-10T11:11:00",
    },
    {
        execution_id: "678",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "677",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "bobwf",
            patient_metadata: {
                patient_name: "Joe Batt",
                patient_id: "1299-123-232-3422",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "stroke model",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-12T11:11:00",
    },
    {
        execution_id: "678",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "678",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "bobwf",
            patient_metadata: {
                patient_name: "Alexis Bazin",
                patient_id: "1299-123-232-3424",
                patient_sex: "M",
                patient_dob: "2000-10-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "Application 1",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-12T11:11:00",
    },
    {
        execution_id: "679",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "679",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "bobwf",
            patient_metadata: {
                patient_name: "Will E Rror",
                patient_id: "1299-123-232-3555",
                patient_sex: "M",
                patient_dob: "2000-01-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "Application 1",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-12T11:11:00",
    },
    {
        execution_id: "680",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "680",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "bobwf",
            patient_metadata: {
                patient_name: "Bobby Be Hanced",
                patient_id: "1299-123-232-3555",
                patient_sex: "M",
                patient_dob: "2000-01-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "Application 1",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-12T11:11:00",
    },
    {
        execution_id: "681",
        clinical_review_message: {
            task_id: "",
            reviewed_task_id: "cde",
            execution_id: "681",
            reviewed_execution_id: "abc",
            correlation_id: "123",
            workflow_name: "bobwf",
            patient_metadata: {
                patient_name: "Seg Be True",
                patient_id: "1299-123-232-3555",
                patient_sex: "M",
                patient_dob: "2000-01-10T00:00:00",
            },
            files: [],
            reviewer_roles: ["admin", "clinician"],
            application_metadata: {
                application_name: "Application 1",
                application_version: "1.1",
                mode: "CU",
            },
        },
        ready: true,
        received: "2022-11-12T11:11:00",
    },
];

const clinicalReviewTasks: PagedClinicalReviewList = {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 2,
    totalRecords: tasks.length,
    data: tasks,
    firstPage: "",
    lastPage: "",
    nextPage: "",
    previousPage: "",
};

export const clinicalReviewHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/dicom`, async (req, res, ctx) => {
        const key: string | null = req.url.searchParams.get("key");

        if (!key) {
            return res(ctx.status(400));
        }

        let responseBuffer: ArrayBuffer | undefined = undefined;

        if (key.startsWith("DO000000")) {
            responseBuffer = await fetch(docSlice).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("CT000000")) {
            responseBuffer = await fetch(ctSlice1).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("CT000010")) {
            responseBuffer = await fetch(ctSlice2).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("EHCT0010")) {
            responseBuffer = await fetch(enhancedSlice).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("SEG00010")) {
            responseBuffer = await fetch(segSlice).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("SR000000")) {
            responseBuffer = await fetch(srSlice).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("RTDOSE001")) {
            responseBuffer = await fetch(rtDoseSlice).then((resp) => resp.arrayBuffer());
        } else if (key.startsWith("RTSTRUCT001")) {
            responseBuffer = await fetch(rtStructSlice).then((resp) => resp.arrayBuffer());
        }

        if (!responseBuffer) {
            return res(ctx.status(404));
        }

        return res(
            ctx.set("Content-Type", "application/dicom"),
            ctx.set("Content-Length", responseBuffer.byteLength.toString()),
            ctx.body(responseBuffer),
        );
    }),
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/:taskExecutionId`, (req, res, ctx) => {
        const executionId = req.params.taskExecutionId as string;

        if (executionId === "679") {
            return res(ctx.status(400));
        }

        const study = {
            study_date: "2021-11-11T10:00:00",
            study_description: "Description",
            study: [
                {
                    series_uid: `8244bd56-3f1f-4d3f-b9be-5d6d4c37b4b1-${executionId}`,
                    modality: "CT",
                    files:
                        executionId === "678"
                            ? [`CT000000-${executionId}.dcm`, `CT000010-${executionId}.dcm`]
                            : [`CT000010-${executionId}.dcm`, `CT000000-${executionId}.dcm`],
                },
                {
                    series_uid: `8621ca92-d3b7-4ee6-8cb0-c662675f5b18-${executionId}`,
                    modality: "DOC",
                    files: [`DO000000-${executionId}.dcm`],
                },
            ],
        };

        if (executionId === "678") {
            study.study.push({
                series_uid: `8244bd56-3f1f-4d3f-b9be-5d6d4c37b123-${executionId}`,
                modality: "CT",
                files: [`CT000000-2-${executionId}.dcm`, `CT000010-2-${executionId}.dcm`],
            });
        }

        if (executionId === "680") {
            study.study.push({
                series_uid: `f348527c-328b-4de8-ba51-33296b2e81f4-${executionId}`,
                modality: "CT",
                files: [`EHCT0010-${executionId}.dcm`],
            });
        }

        if (executionId === "681") {
            study.study.push({
                series_uid: `43456e7c-fa37-4075-ad6c-2a3fac06fd1c-${executionId}`,
                modality: "SEG",
                files: [`SEG00010-${executionId}.dcm`],
            });
            study.study.push({
                series_uid: `ceb2b144-ce0a-473f-8484-ad192ba62833-${executionId}`,
                modality: "SR",
                files: [`SR000000-${executionId}.dcm`],
            });
            study.study.push({
                series_uid: `c0565da5-4d56-4c9f-b6bb-af813c693280-${executionId}`,
                modality: "RTDOSE",
                files: [`RTDOSE001-${executionId}.dcm`],
            });
            study.study.push({
                series_uid: `879b670c-d205-472c-8923-a7a4cea3a56f-${executionId}`,
                modality: "RTSTRUCT",
                files: [`RTSTRUCT001-${executionId}.dcm`],
            });
        }

        return res(ctx.json(study));
    }),
    rest.get(
        `${window.FRONTEND_API_HOST}/clinical-review/:taskExecutionId/study`,
        async (req, res, ctx) => {
            const responseBuffer = await fetch(studyZip).then((resp) => resp.arrayBuffer());

            return res(
                ctx.set("Content-Type", "application/zip"),
                ctx.set("Content-Length", responseBuffer.byteLength.toString()),
                ctx.body(responseBuffer),
            );
        },
    ),
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review`, (_req, res, ctx) => {
        const patientId = _req.url.searchParams.get("patientId");
        const patientName = _req.url.searchParams.get("patientName");
        const applicationName = _req.url.searchParams.get("applicationName");
        const pageNumber = _req.url.searchParams.get("pageNumber");

        let crTasksData = tasks;

        if (patientId !== "" && patientId !== null) {
            crTasksData = crTasksData.filter((item) => {
                if (
                    item.clinical_review_message.patient_metadata.patient_id
                        .toLowerCase()
                        .includes(patientId.toLowerCase())
                )
                    return item;
            });
            clinicalReviewTasks.data = crTasksData;
        }

        if (patientName !== "" && patientName !== null) {
            crTasksData = crTasksData.filter((item) => {
                if (
                    item.clinical_review_message.patient_metadata.patient_name
                        .toLowerCase()
                        .includes(patientName.toLowerCase())
                )
                    return item;
            });
            clinicalReviewTasks.data = crTasksData;
        }

        if (applicationName !== "" && applicationName !== null) {
            crTasksData = crTasksData.filter((item) => {
                if (
                    item.clinical_review_message.application_metadata.application_name
                        .toLowerCase()
                        .includes(applicationName.toLowerCase())
                )
                    return item;
            });
            clinicalReviewTasks.data = crTasksData;
        }

        if (pageNumber !== null) {
            clinicalReviewTasks.data = crTasksData.slice(
                (parseInt(pageNumber) - 1) * 10,
                clinicalReviewTasks.totalRecords < parseInt(pageNumber) * 10
                    ? undefined
                    : parseInt(pageNumber) * 10,
            );
            clinicalReviewTasks.pageNumber = parseInt(pageNumber);
            clinicalReviewTasks.totalRecords = crTasksData.length;
            clinicalReviewTasks.totalPages = crTasksData.length > 10 ? 2 : 1;
        }

        return res(ctx.json(clinicalReviewTasks));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/clinical-review/:clinicalReviewId`, (_req, res, ctx) => {
        return res(ctx.status(201));
    }),
];
