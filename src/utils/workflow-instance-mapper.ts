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

import { TaskExecution, WorkflowInstance } from "@/models/Admin/IPayload";

export interface ExecutionTreeFirstNode {
    id: string;
    name: string;
    workflow_name: string;
    workflow_instance_id: string;
    status: string;
    start_date: string;
    children: ExecutionTreeNode[];
}

export interface ExecutionTreeNode {
    id: string;
    execution_id: string;
    workflow_instance_id: string;
    name: string;
    status: string;
    start_date: string;
    children: ExecutionTreeNode[];
}

export interface ExecutionTreeRoot {
    id: "root-node";
    name: "Payload Received";
    status: string;
    children: ExecutionTreeFirstNode[];
}

export function mapToExecutionTreeFirstNode(instance: WorkflowInstance): ExecutionTreeFirstNode {
    return {
        id: "workflow-instance",
        name: instance.ae_title,
        workflow_name: instance.workflow_name,
        workflow_instance_id: instance.id,
        status: instance.status,
        start_date: instance.start_time,
        children: (instance.tasks ?? []).map((t) => mapToExecutionTreeNode(t)),
    };
}

export function mapToExecutionTreeNode(task: TaskExecution): ExecutionTreeNode {
    return {
        id: task.execution_id,
        execution_id: task.execution_id,
        workflow_instance_id: task.workflow_instance_id,
        name: task.task_id,
        status: task.status,
        start_date: task.task_start_time,
        children: (task.next_task ?? []).map((t) => mapToExecutionTreeNode(t)),
    };
}

export function mapToExecutionTree(instances: WorkflowInstance[]): ExecutionTreeRoot {
    return {
        id: "root-node",
        name: "Payload Received",
        status: "Succeeded",
        children:
            instances.length > 0
                ? instances.map((i) => mapToExecutionTreeFirstNode(i))
                : [mapToEmptyWorkflow()],
    };
}

export function mapToEmptyWorkflow(): ExecutionTreeFirstNode {
    return {
        id: "no-workflow-instance",
        name: "No Workflow Triggered",
        status: "Succeeded",
        workflow_name: "",
        workflow_instance_id: "",
        start_date: "",
        children: [],
    };
}
