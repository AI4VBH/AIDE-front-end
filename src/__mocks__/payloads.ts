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

import { IPayload, WorkflowInstance } from "@/models/Admin/IPayload";
import { IPagedResponse } from "@/models/common/IPagedResponse";
import { rest } from "msw";

const payloadsData = [
    {
        payload_id: "111293d0-ab97-4ea1-b967-42ec62f26111",
        patient_name: "Alex Bazin",
        patient_id: "123 123 1234",
        payload_received: "2022-12-15T13:59:57.809Z",
    },
    {
        payload_id: "222293d0-ab97-4ea1-b967-42ec62f26222",
        patient_name: "Louiza Van-Der-Varintaford",
        patient_id: "223 223 3234",
        payload_received: "2022-12-15T13:59:57.809Z",
    },
    {
        payload_id: "333293d0-ab97-4ea1-b967-42ec62f26333",
        patient_name: "Joe Batt",
        patient_id: "423 323 2235",
        payload_received: "2022-12-15T13:59:57.809Z",
    },
    {
        payload_id: "444293d0-ab97-4ea1-b967-42ec62f26444",
        patient_name: "Richard McRichardson",
        patient_id: "623 723 8234",
        payload_received: "2022-12-15T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26555",
        patient_name: "Migle Van-Migleson",
        patient_id: "023 723 6234",
        payload_received: "2022-12-15T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26666",
        patient_name: "John Motson",
        patient_id: "023 723 6666",
        payload_received: "2022-12-16T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f27777",
        patient_name: "Wednesday Addams",
        patient_id: "023 723 7777",
        payload_received: "2022-12-17T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f28888",
        patient_name: "Lurch Addams",
        patient_id: "023 723 8888",
        payload_received: "2022-12-18T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f29999",
        patient_name: "Hand Addams",
        patient_id: "023 723 9999",
        payload_received: "2022-12-19T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f20000",
        patient_name: "Pugsley Addams",
        patient_id: "023 723 0000",
        payload_received: "2022-12-20T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f20011",
        patient_name: "Morticia Addams",
        patient_id: "023 723 0011",
        payload_received: "2022-12-21T13:59:57.809Z",
    },
    {
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f20012",
        patient_name: "Fester Addams",
        patient_id: "023 723 0012",
        payload_received: "2022-12-22T13:59:57.809Z",
    },
];

const payloads: IPagedResponse<IPayload> = {
    pageNumber: 1,
    pageSize: 10,
    firstPage: "1",
    lastPage: "2",
    totalPages: 2,
    totalRecords: payloadsData.length,
    nextPage: "2",
    previousPage: "0",
    data: payloadsData,
};

const payloadExecutions: WorkflowInstance[] = [
    {
        ae_title: "MonaiSCU",
        workflow_name: "Monai workflow",
        id: "e26bec36-9a22-4be2-8402-379cb96c22e5",
        payload_id: "5f624ab5-88f2-4f47-b239-f05851a94c31",
        start_time: "2022-09-16T09:37:59.634Z",
        status: "Succeeded",
        tasks: [
            {
                execution_id: "1f3d4b42-8a8f-41b1-9cc7-bfb19d9716de",
                next_task: [],
                payload_id: "5f624ab5-88f2-4f47-b239-f05851a94c31",
                status: "Failed",
                task_id: "export-task-connectathon",
                task_start_time: "2022-09-16T09:37:59.634Z",
                workflow_instance_id: "e26bec36-9a22-4be2-8402-379cb96c22e5",
            },
        ],
        workflow_id: "ba85e76a-f03e-4b54-b2ea-c7736afa8c13",
    },
    {
        ae_title: "MonaiSCU",
        workflow_name: "Monai workflow 2",
        id: "a54a30a9-516b-4906-9315-e7dc23af4539",
        payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
        start_time: "2022-09-16T09:38:560.634Z",
        status: "Succeeded",
        tasks: [
            {
                execution_id: "8a070831-53a3-4dfe-b568-a3edbf62282f",
                next_task: [],
                payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
                status: "Dispatched",
                task_id: "export-task-connectathon",
                task_start_time: "2022-09-16T09:37:59.634Z",
                workflow_instance_id: "a54a30a9-516b-4906-9315-e7dc23af4539",
            },
        ],
        workflow_id: "739e4f70-a6c0-4e98-8e47-469f7b8b9606",
    },
];

const payloadExecutionMetadata = {
    ae_title: "MonaiSCU",
    id: "a54a30a9-516b-4906-9315-e7dc23af4539",
    payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
    start_time: "2022-09-16T09:38:560.634Z",
    status: "Succeeded",
    tasks: [
        {
            execution_id: "8a070831-53a3-4dfe-b568-a3edbf62282f",
            next_task: [],
            payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
            status: "Dispatched",
            task_id: "export-task-connectathon",
            task_start_time: "2022-09-16T09:37:59.634Z",
            workflow_instance_id: "a54a30a9-516b-4906-9315-e7dc23af4539",
        },
    ],
    workflow_id: "739e4f70-a6c0-4e98-8e47-469f7b8b9606",
    task: {
        ae_title: "MonaiSCU",
        id: "a54a30a9-516b-4906-9315-e7dc23af4539",
        payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
        start_time: "2022-09-16T09:38:560.634Z",
        status: "Succeeded",
        tasks: [
            {
                execution_id: "8a070831-53a3-4dfe-b568-a3edbf62282f",
                next_task: [],
                payload_id: "e3a91e70-ade6-40b8-96f4-a9f8151919ac",
                status: "Dispatched",
                task_id: "export-task-connectathon",
                task_start_time: "2022-09-16T09:37:59.634Z",
                workflow_instance_id: "a54a30a9-516b-4906-9315-e7dc23af4539",
            },
        ],
        workflow_id: "739e4f70-a6c0-4e98-8e47-469f7b8b9606",
    },
};
export const payloadsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/payloads`, (req, res, ctx) => {
        const patientId = req.url.searchParams.get("patientId");
        const patientName = req.url.searchParams.get("patientName");
        const pageNumber = req.url.searchParams.get("pageNumber");
        const pageSize = req.url.searchParams.get("pageSize");

        let allPayloadsData = payloadsData;

        if (patientId !== "" && patientId !== null) {
            allPayloadsData = allPayloadsData.filter((item) => {
                if (item.patient_id.toLowerCase().includes(patientId.toLowerCase())) return item;
            });
            payloads.data = allPayloadsData;
        }

        if (patientName !== "" && patientName !== null) {
            allPayloadsData = allPayloadsData.filter((item) => {
                if (item.patient_name.toLowerCase().includes(patientName.toLowerCase()))
                    return item;
            });
            payloads.data = allPayloadsData;
        }

        if (pageNumber !== null && pageSize !== null) {
            const pageSizeParsed = parseInt(pageSize);
            payloads.data = allPayloadsData.slice(
                (parseInt(pageNumber) - 1) * pageSizeParsed,
                payloads.totalRecords < parseInt(pageNumber) * pageSizeParsed
                    ? undefined
                    : parseInt(pageNumber) * pageSizeParsed,
            );

            payloads.pageNumber = parseInt(pageNumber);
            payloads.totalRecords = allPayloadsData.length;
            payloads.totalPages = allPayloadsData.length / pageSizeParsed;
        }

        return res(ctx.json(payloads));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/payloads/:payloadId/executions`, (req, res, ctx) => {
        const payloadId = req.params.payloadId;
        const workflowNotTriggeredPayloadId = "111293d0-ab97-4ea1-b967-42ec62f26111";
        if (payloadId == workflowNotTriggeredPayloadId) {
            return res(ctx.json([]));
        } else {
            return res(ctx.json(payloadExecutions));
        }
    }),
    rest.get(`${window.FRONTEND_API_HOST}/executions/:executionId/metadata`, (req, res, ctx) => {
        return res(ctx.json(payloadExecutionMetadata));
    }),
    rest.post(`${window.FRONTEND_API_HOST}/payloads`, (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/payloads/:payloadId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/payloads/:payloadId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
