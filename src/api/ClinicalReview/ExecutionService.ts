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

import { Execution, ExecutionPage } from "@/models/ClinicalReview/Execution";
import { ExecutionStat } from "@/models/ClinicalReview/ExecutionStat";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const executionsErrorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the executions",
};

const http = createAxiosInstance(executionsErrorMessages);

export async function getAllExecutionsPage(
    from: string,
    to: string,
    approved: string,
): Promise<ExecutionPage> {
    const response = await http.get(`/executions?from=${from}&to=${to}&approved=${approved}`);
    return response.data;
}

export async function getAllModelExecutions(
    model_id: string,
    from: string,
    to: string,
): Promise<ExecutionPage> {
    const response = await http.get(`/executions?model_id=${model_id}&from=${from}&to=${to}`);
    return response.data;
}

export async function getExecutionPipelines(correlation_id: string): Promise<Array<Execution>> {
    const response = await http.get(`/pipeline/${correlation_id}`);
    return response.data;
}

export async function getExecutionStats(days: string): Promise<ExecutionStat> {
    const response = await http.get(`/execution_stats?days=${days}`);
    return response.data;
}

export async function getModelExecutionStats(
    days: string,
    model_id: string,
): Promise<ExecutionStat> {
    const response = await http.get(`/execution_stats?days=${days}&model_id=${model_id}`);
    return response.data;
}

export async function getFile(file_path: string): Promise<any> {
    const response = await http.post("/file", { file_path: file_path }, { responseType: "blob" });
    if (response.headers["content-type"] === "application/zip") {
        file_path = file_path + ".zip";
    }
    const file_name = file_path.split("/");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file_name[file_name.length - 1]); //or any other extension
    document.body.appendChild(link);
    link.click();
    return response.data;
}
