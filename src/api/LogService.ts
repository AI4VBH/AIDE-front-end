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

import { ILogs } from "@/models/Admin/ILogs";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving logs",
};

const http = createAxiosInstance(errorMessages);

export async function getLogs(executionId: string): Promise<any> {
    const response = await http.get(`/logs/${executionId}`);

    if (response.status == 404) {
        return "No Data Found";
    }

    return response.data;
}

export async function getTaskLogs(taskId: number): Promise<ILogs[]> {
    const response = await http.get(`/logs/${taskId}`);

    return response.data;
}
