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

const logs = [
    {
        task_id: 1,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26111",
        status: "Error",
        model_name: "test model 1",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T101114",
    },
    {
        task_id: 2,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26222",
        status: "Error",
        model_name: "test model 2",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T051514",
    },
    {
        task_id: 3,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26333",
        status: "Error",
        model_name: "test model 3",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T190014",
    },
    {
        task_id: 4,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26444",
        status: "Error",
        model_name: "test model 4",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T111114",
    },
    {
        task_id: 5,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26555",
        status: "Error",
        model_name: "test model 5",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
    {
        task_id: 6,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26666",
        status: "Error",
        model_name: "test model 6",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
    {
        task_id: 7,
        payload_id: "041293d0-ab97-4ea1-b967-42ec62f26777",
        status: "Error",
        model_name: "test model 7",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
];

const taskLogs = [
    {
        json: {
            execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            level: "INFO",
            line_no: 28,
            logger: "aide - audit - logger",
            model_name: "test - model - operator",
            model_version: "1.0.0",
            module: "dicom_image",
            msg: "Model has loaded DICOM image dataset from storage",
            thread: "Thread - 289",
            type: "log",
            written_at: "2022 - 01 - 06T20: 50: 54.726Z",
            written_ts: 1641502254726809,
        },
    },
    {
        json: {
            execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            level: "INFO",
            line_no: 28,
            logger: "aide-audit-logger",
            model_name: "test-model-operator",
            model_version: "1.0.0",
            module: "dicom_image",
            msg: "Model has loaded DICOM image dataset from storage",
            thread: "Thread-289",
            type: "log",
            written_at: "2022-01-06T20:50:54.726Z",
            written_ts: 1641502254726809,
        },
    },
];

export const logsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/logs/:executionId`, (req, res, ctx) => {
        return res(ctx.json({ logs }));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/logs/:taskd`, (req, res, ctx) => {
        return res(ctx.json({ taskLogs }));
    }),
];
