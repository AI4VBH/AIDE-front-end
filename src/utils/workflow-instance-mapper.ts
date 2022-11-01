import { TaskExecution, WorkflowInstance } from "@/models/Admin/IPayload";

export interface ExecutionTreeFirstNode {
    id: "workflow-instance";
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
        children: instances.map((i) => mapToExecutionTreeFirstNode(i)),
    };
}
