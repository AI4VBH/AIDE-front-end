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

export interface PaginatedWorkflowsResponse {
    totalPages: number;
    totalRecords: number;
    data: WorkflowListItem[];
}

export interface WorkflowListItem {
    workflow_id: string;
    revision: number;
    name: string;
    version: string;
    description: string;
    ae_title: string;
    data_origins: string[];
}

export interface MonaiWorkflow {
    id: string;
    workflow_id: string;
    revision: number;
    workflow: unknown;
}

export interface WorkflowError {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    traceId: string;
}
