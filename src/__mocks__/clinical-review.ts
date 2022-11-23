import { rest } from "msw";
import ctSlice1 from "!url-loader!./fixtures/CT000000.dcm";
import ctSlice2 from "!url-loader!./fixtures/CT000010.dcm";
import docSlice from "!url-loader!./fixtures/DO000000.dcm";
import { PagedClinicalReviewList } from "@/models/ClinicalReview/ClinicalReviewTask";

const clinicalReviewTasks: PagedClinicalReviewList = {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 10,
    totalRecords: 1,
    data: [
        {
            _id: "678",
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
                    patient_age: "23",
                },
                files: [],
                reviewer_roles: ["admin", "clinician"],
                application_metadata: {
                    application_name: "stroke model",
                    application_version: "1.1",
                    application_mode: "CU",
                },
            },
            reviewed: false,
            received: new Date(),
        },
        {
            _id: "678",
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
                    patient_age: "23",
                },
                files: [],
                reviewer_roles: ["admin", "clinician"],
                application_metadata: {
                    application_name: "Application 1",
                    application_version: "1.1",
                    application_mode: "CU",
                },
            },
            reviewed: false,
            received: new Date(),
        },
    ],
    succeeded: true,
    errors: null,
    message: null,
};

export const clinicalReviewHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/dicom`, async (req, res, ctx) => {
        const key: string | null = req.url.searchParams.get("key");

        if (!key) {
            return res(ctx.status(400));
        }

        const ct1Buffer = await fetch(ctSlice1).then((resp) => resp.arrayBuffer());
        const ct2Buffer = await fetch(ctSlice2).then((resp) => resp.arrayBuffer());
        const docBuffer = await fetch(docSlice).then((resp) => resp.arrayBuffer());

        let responseBuffer: ArrayBuffer | undefined = undefined;

        if (key.startsWith("DO000000")) {
            responseBuffer = docBuffer;
        } else if (key.startsWith("CT000000")) {
            responseBuffer = ct1Buffer;
        } else if (key.startsWith("CT000010")) {
            responseBuffer = ct2Buffer;
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

        const study = {
            study_date: "2021-11-11T10:00:00",
            study_description: "Description",
            study: [
                {
                    series_uid: `8244bd56-3f1f-4d3f-b9be-5d6d4c37b4b1-${executionId}`,
                    modality: "CT",
                    files: [`CT000000-${executionId}.dcm`, `CT000010-${executionId}.dcm`],
                },
                {
                    series_uid: `8621ca92-d3b7-4ee6-8cb0-c662675f5b18-${executionId}`,
                    modality: "DOC",
                    files: [`DO000000-${executionId}.dcm`],
                },
            ],
        };

        return res(ctx.json(study));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review`, (_req, res, ctx) => {
        return res(ctx.json(clinicalReviewTasks));
    }),
];
