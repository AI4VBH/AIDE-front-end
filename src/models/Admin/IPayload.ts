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

export interface IPayload {
    payload_id: string;
    patient_name: string;
    patient_id: string;
    payload_received: string;
}

export interface IPagedResponse<T> {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: string;
    previousPage: string;
    data: T[];
}

export interface WorkflowInstance {
    id: string;
    ae_title: string;
    workflow_id: string;
    workflow_name: string;
    start_time: string;
    payload_id: string;
    status: string;
    tasks: TaskExecution[];
}

export interface TaskExecution {
    execution_id: string;
    payload_id: string;
    workflow_instance_id: string;
    task_start_time: string;
    task_id: string;
    status: string;
    next_task: TaskExecution[];
}
