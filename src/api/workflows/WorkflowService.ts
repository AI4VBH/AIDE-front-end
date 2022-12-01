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

import { MonaiWorkflow, PaginatedWorkflowsResponse } from "@/models/workflows/Workflow";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";

const errorMessagesWorkflows: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving workflows",
    post: "Something unexpected went wrong creating the workflow",
    put: "Something unexpected went wrong updating the workflow",
    delete: "Something unexpected went wrong deleting the workflow",
};

const httpWorkflows = createAxiosInstance(errorMessagesWorkflows);

interface QueryParams {
    itemsPerPage: number;
    page: number;
}

export async function getAllWorkflows(query: QueryParams): Promise<PaginatedWorkflowsResponse> {
    const params = new URLSearchParams({
        pageNumber: `${query.page}`,
        pageSize: `${query.itemsPerPage}`,
    });

    const response = await httpWorkflows.get<PaginatedWorkflowsResponse>(`/workflows?${params}`);

    const defaultData = { totalPages: 0, totalRecords: 0, data: [] };

    return isResultOk(response) ? response.data : defaultData;
}

export async function getWorkflow(workflowId: string): Promise<MonaiWorkflow> {
    const response = await httpWorkflows.get<MonaiWorkflow>(`/workflows/${workflowId}`);
    return response.data;
}

export async function updateWorkflow(
    workflowId: string,
    workflow: unknown,
    original_workflow_name: string,
): Promise<AxiosResponse | AxiosError> {
    return httpWorkflows
        .put(`/workflows/${workflowId}`, { original_workflow_name, workflow })
        .catch((error) => {
            if (error) {
                return error;
            }
        });
}

export async function createWorkflow(workflow: unknown): Promise<AxiosResponse | AxiosError> {
    return httpWorkflows.post("/workflows", workflow).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function deleteWorkflow(workflowId: string): Promise<boolean> {
    try {
        const result = await httpWorkflows.delete(`/workflows/${workflowId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}
