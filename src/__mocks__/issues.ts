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

import { IIssue } from "@/models/Admin/IIssue";
import { rest } from "msw";

const issuesData: IIssue[] = [
    {
        task_id: "1",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26111",
        workflow_name: "Test model 1",
        status: "partial_fail",
        model_name: "Test model 1",
        patient_name: "Test patient",
        patient_id: "001",
        execution_time: "20220516T151114",
        workflow_instance_id: "345435",
        execution_id: "45435341",
        failure_reason: "PartialFail",
    },
    {
        task_id: "2",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26222",
        status: "Error",
        workflow_name: "Test model 2",
        model_name: "Test model 2",
        patient_name: "Frederico McSullivan",
        patient_id: "002",
        execution_time: "20210417T151112",
        workflow_instance_id: "345435",
        execution_id: "45435342",
    },
    {
        task_id: "3",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26333",
        status: "Error",
        workflow_name: "Test model 3",
        model_name: "Test model 3",
        patient_name: "Dr Joseph Batts",
        patient_id: "003",
        execution_time: "20200327T071114",
        workflow_instance_id: "345435",
        execution_id: "45435343",
    },
    {
        task_id: "4",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26444",
        status: "PartialFail",
        workflow_name: "Test model 4",
        model_name: "Test model 4",
        patient_name: "Alexis John Bazin-Archer",
        patient_id: "004",
        execution_time: "20150517T191115",
        workflow_instance_id: "345435",
        execution_id: "45435344",
    },
    {
        task_id: "5",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26555",
        status: "Error",
        workflow_name: "Test model 5",
        model_name: "Test model 5",
        patient_name: "Migle O'Donahue",
        patient_id: "005",
        execution_time: "20310517T191115",
        workflow_instance_id: "345435",
        execution_id: "1f3d4b42-8a8f-41b1-9cc7-bfb19d9716de",
    },
    {
        task_id: "6",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26666",
        status: "PartialFail",
        workflow_name: "Test model 6",
        model_name: "Test model 6",
        patient_name: "Dr Khayam Amin",
        patient_id: "006",
        execution_time: "20200606T060615",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "7",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26777",
        status: "PartialFail",
        workflow_name: "Test model 7",
        model_name: "Test model 7",
        patient_name: "Jane Doe",
        patient_id: "007",
        execution_time: "20200707T070715",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "8",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26888",
        status: "Error",
        workflow_name: "Test model 8",
        model_name: "Test model 8",
        patient_name: "John Doe",
        patient_id: "008",
        execution_time: "20220808T080815",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "9",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26999",
        status: "PartialFail",
        workflow_name: "Test model 9",
        model_name: "Test model 9",
        patient_name: "Harry Kane",
        patient_id: "009",
        execution_time: "20220909T090915",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "10",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26010",
        status: "Error",
        workflow_name: "Test model 10",
        model_name: "Test model 10",
        patient_name: "Jude Bellingham",
        patient_id: "010",
        execution_time: "20221010T101015",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "11",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26011",
        status: "Error",
        workflow_name: "Test model 11",
        model_name: "Test model 11",
        patient_name: "Harry Maguire",
        patient_id: "011",
        execution_time: "20221111T111115",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
    {
        task_id: "12",
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26012",
        status: "PartialFail",
        workflow_name: "Test model 12",
        model_name: "Test model 12",
        patient_name: "Jordan Pickford",
        patient_id: "012",
        execution_time: "2022121T121215",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
];

export const issuesHandler = [
    rest.get(`${window.FRONTEND_API_HOST}/issues/failed`, (req, res, ctx) => {
        return res(ctx.json(issuesData));
    }),
    rest.put(
        `${window.FRONTEND_API_HOST}/workflowinstances/:workflowInstanceId/executions/:executionId/acknowledge`,
        (req, res, ctx) => {
            return res(ctx.status(200));
        },
    ),
];
