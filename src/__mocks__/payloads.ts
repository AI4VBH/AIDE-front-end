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

import { IPagedResponse, IPayload, WorkflowInstance } from "@/models/Admin/IPayload";
import { rest } from "msw";

const payloads: IPagedResponse<IPayload> = {
    pageNumber: 1,
    pageSize: 10,
    firstPage: "1",
    lastPage: "2",
    totalPages: 2,
    totalRecords: 15,
    nextPage: "2",
    previousPage: "0",
    data: [
        {
            payload_id: 1,
            patient_name: "Alex Bazin",
            patient_id: "123 123 1234",
            payload_received: "20220516T141114",
        },
        {
            payload_id: 2,
            patient_name: "Louiza Van-Der-Varintaford",
            patient_id: "223 223 3234",
            payload_received: "20220526T050215",
        },
        {
            payload_id: 3,
            patient_name: "Joe Batt",
            patient_id: "423 323 2235",
            payload_received: "20220526T060316",
        },
        {
            payload_id: 4,
            patient_name: "Richard McRichardson",
            patient_id: "623 723 8234",
            payload_received: "20220526T070417",
        },
        {
            payload_id: 5,
            patient_name: "Migle Van-Migleson",
            patient_id: "023 723 6234",
            payload_received: "20220526T080518",
        },
    ],
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
        return res(ctx.json(payloads));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/payloads/:payloadId/executions`, (req, res, ctx) => {
        return res(ctx.json(payloadExecutions));
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
