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

import { MonaiWorkflow } from "../../../src/models/workflows/Workflow";
import ApiMocks from "../../fixtures/mockIndex";

export class WorkflowExampleData implements MonaiWorkflow {
    id: string;
    workflow_id: string;
    revision: number;
    workflow: unknown;

    constructor(workflow: MonaiWorkflow) {
        this.id = workflow.id;
        this.workflow_id = workflow.workflow_id;
        this.revision = workflow.revision;
    }

    public static WORKFLOW_EXAMPLE: WorkflowExampleData = new WorkflowExampleData(
        <MonaiWorkflow>ApiMocks.WORKFLOW_EXAMPLE,
    );
    public static WORKFLOW_EMPTY: WorkflowExampleData = new WorkflowExampleData(
        <MonaiWorkflow>ApiMocks.WORKFLOW_EMPTY,
    );
}
