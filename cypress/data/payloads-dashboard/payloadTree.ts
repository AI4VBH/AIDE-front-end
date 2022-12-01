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

import { WorkflowInstance, TaskExecution } from "../../../src/models/Admin/IPayload";
import ApiMocks from "../../fixtures/mockIndex";

export class PayloadTreeData implements WorkflowInstance {
    id: string;
    ae_title: string;
    workflow_id: string;
    workflow_name: string;
    start_time: string;
    payload_id: string;
    status: string;
    tasks: TaskExecution[];

    constructor(instances: WorkflowInstance) {
        this.id = instances.id;
        this.ae_title = instances.ae_title;
        this.workflow_id = instances.workflow_id;
        this.workflow_name = instances.workflow_name;
        this.start_time = instances.start_time;
        this.payload_id = instances.payload_id;
        this.status = instances.status;
        this.tasks = instances.tasks;
    }

    public static TREE_DATA_1: PayloadTreeData = new PayloadTreeData(
        <WorkflowInstance>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
    public static TREE_DATA_2: PayloadTreeData = new PayloadTreeData(
        <WorkflowInstance>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[1],
    );
}
