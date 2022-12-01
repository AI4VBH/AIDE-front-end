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

import { IIssue } from "../../../src/models/Admin/IIssue";
import ApiMocks from "../../fixtures/mockIndex";

export class TaskData implements IIssue {
    task_id: string;
    payload_id: string;
    status: string;
    model_name: string;
    patient_name: string;
    patient_id: string;
    execution_time: string;
    execution_id: string;
    workflow_instance_id: string;

    constructor(task: IIssue) {
        this.task_id = task.task_id;
        this.payload_id = task.payload_id;
        this.status = task.status;
        this.model_name = task.model_name;
        this.patient_name = task.patient_name;
        this.patient_id = task.patient_id;
        this.execution_time = task.execution_time;
    }

    public static TASK_DATA_1: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[0]);
    public static TASK_DATA_2: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[1]);
    public static TASK_DATA_3: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[2]);
    public static TASK_DATA_4: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[3]);
    public static TASK_DATA_5: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[4]);
}
