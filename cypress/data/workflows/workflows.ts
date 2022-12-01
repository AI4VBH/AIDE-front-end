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

import {
    PaginatedWorkflowsResponse,
    WorkflowListItem,
} from "../../../src/models/workflows/Workflow";
import ApiMocks from "../../fixtures/mockIndex";

export class WorkflowData implements PaginatedWorkflowsResponse {
    totalPages: number;
    totalRecords: number;
    data: WorkflowListItem[];

    constructor(role: PaginatedWorkflowsResponse) {
        this.totalPages = role.totalPages;
        this.totalRecords = role.totalRecords;
        this.data = role.data;
    }

    public static WORKFLOWS_INIT: WorkflowData = new WorkflowData(
        <PaginatedWorkflowsResponse>ApiMocks.WORKFLOWS,
    );
    public static WORKFLOWS_TEN: WorkflowData = new WorkflowData(
        <PaginatedWorkflowsResponse>ApiMocks.WORKFLOWS_TEN,
    );
}
