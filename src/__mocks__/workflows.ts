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

import { MonaiWorkflow, WorkflowListItem } from "@/models/workflows/Workflow";
import { rest } from "msw";

const workflows: WorkflowListItem[] = [
    {
        workflow_id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 1",
        version: "1",
        revision: 1,
        description: "This is a workflow description",
        ae_title: "ae title hello",
        data_origins: ["data_origins 1", "data_origins 2"],
    },
    {
        workflow_id: "92657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 2",
        version: "2",
        revision: 1,
        description: "",
        ae_title: "MONAI",
        data_origins: ["data_origins dae", "data_origins lillie"],
    },
    {
        workflow_id: "26657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 3",
        version: "2.2",
        revision: 1,
        description: "This is a workflow description",
        ae_title: "ae title world",
        data_origins: ["data_origins donkey", "data_origins unicorn"],
    },
];

const mockWorkflow: MonaiWorkflow = {
    id: "b941e7bc-9cd6-4664-8ade-03f18fdbfb51",
    workflow_id: "7e49e408-fbb9-4184-877c-dce0442b2d27",
    revision: 1,
    workflow: {
        name: "router_1",
        version: "1.0.0",
        description: "Workflow with a router task that creates a diverging branch",
        informatics_gateway: {
            ae_title: "MONAI",
            data_origins: ["data_origins 1", "data_origins 2"],
            export_destinations: ["ORTHANC"],
        },
        tasks: [
            {
                id: "router-task",
                description: "router task to route MR and US studies",
                type: "router",
                args: {},
                ref: "",
                task_destinations: [
                    {
                        name: "argo-task-mr",
                        conditions: "{{ context.input.dicom.series.any('0008','0060') }} == 'MR'",
                    },
                    {
                        name: "argo-task-us",
                        conditions: "{{ context.input.dicom.series.any('0008','0060') }} == 'US'",
                    },
                ],
                export_destinations: [],
                artifacts: {
                    input: [],
                    output: [],
                },
                input_parameters: null,
            },
            {
                id: "argo-task-mr",
                description: "mean-pixel-calc for MR studies",
                type: "argo",
                args: {
                    namespace: "argo",
                    workflow_template_name: "argo-workflow-1",
                    server_url: "https://argo-server.argo:2746",
                    allow_insecure: "true",
                },
                ref: "",
                task_destinations: [
                    {
                        name: "export-task-mr",
                        conditions: "",
                    },
                ],
                export_destinations: [],
                artifacts: {
                    input: [
                        {
                            name: "input-dicom",
                            value: "{{ context.input.dicom }}",
                            mandatory: true,
                        },
                    ],
                    output: [
                        {
                            name: "report-dicom",
                            value: "",
                            mandatory: true,
                        },
                    ],
                },
                input_parameters: null,
            },
            {
                id: "export-task-mr",
                description: "example export task",
                type: "export",
                args: {},
                ref: "",
                task_destinations: [],
                export_destinations: [
                    {
                        name: "ORTHANC",
                    },
                ],
                artifacts: {
                    input: [
                        {
                            name: "report-dicom",
                            value: "{{ context.executions.mean-pixel-calc.artifacts.report-dicom }}",
                            mandatory: true,
                        },
                    ],
                    output: [],
                },
                input_parameters: null,
            },
            {
                id: "argo-task-us",
                description: "mean-pixel-calc for US studies",
                type: "argo",
                args: {
                    namespace: "argo",
                    workflow_template_name: "argo-workflow-1",
                    server_url: "https://argo-server.argo:2746",
                    allow_insecure: "true",
                },
                ref: "",
                task_destinations: [
                    {
                        name: "export-task-us",
                        conditions: "",
                    },
                ],
                export_destinations: [],
                artifacts: {
                    input: [
                        {
                            name: "input-dicom",
                            value: "{{ context.input.dicom }}",
                            mandatory: true,
                        },
                    ],
                    output: [
                        {
                            name: "report-dicom",
                            value: "",
                            mandatory: true,
                        },
                    ],
                },
                input_parameters: null,
            },
            {
                id: "export-task-us",
                description: "example export task",
                type: "export",
                args: {},
                ref: "",
                task_destinations: [],
                export_destinations: [
                    {
                        name: "ORTHANC",
                    },
                ],
                artifacts: {
                    input: [
                        {
                            name: "report-dicom",
                            value: "{{ context.executions.mean-pixel-calc.artifacts.report-dicom }}",
                            mandatory: true,
                        },
                    ],
                    output: [],
                },
                input_parameters: null,
            },
        ],
    },
};

export const workflowsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/workflows`, (req, res, ctx) => {
        const pageNumber = req.url.searchParams.get("pageNumber") || "0";

        return res(
            ctx.json({
                totalPages: pageNumber,
                totalRecords: workflows.length,
                data: workflows,
            }),
        );
    }),
    rest.get(`${window.FRONTEND_API_HOST}/workflows/:workflowId`, (req, res, ctx) => {
        return res(ctx.json(mockWorkflow));
    }),
    rest.post(`${window.FRONTEND_API_HOST}/workflows`, (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/workflows/:workflowId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/workflows/:workflowId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
