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
