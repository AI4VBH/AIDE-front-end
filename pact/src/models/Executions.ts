import AbstractClient from "./AbstractClient";
import { ExecutionPage } from "../../../src/models/ClinicalReview/Execution"

export class ExecutionsPage {
    private executionPage: ExecutionPage;

    constructor(executionPage: ExecutionPage) {
        this.executionPage = executionPage;
    }

    public getExecutionPage(): ExecutionPage {
        return this.executionPage;
    }
}

export default class ExecutionClient extends AbstractClient {
    public fetchExecutionsPage(from: string, to: string, approved: string) {
        return this.axios.get(`/executions?from=${from}&to=${to}&approved=${approved}`, { headers: { Authorization: "token" } }).then(
            res => {
                return res.data.map((o: ExecutionPage) => {
                    return new ExecutionsPage({
                        page: o.page,
                        results: o.results,
                        size: o.size,
                        total: o.total
                    })
                })
            },
            err => {
                throw new Error(`Error response ${err.body}`)
            }
        )
    }

    public fetchExecutionsByModel(from: string, to: string, model_id: string) {
        return this.axios.get(`/executions?model_id=${model_id}&from=${from}&to=${to}`, { headers: { Authorization: "token" } }).then(
            res => {
                return res.data.map((o: ExecutionPage) => {
                    return new ExecutionsPage({
                        page: o.page,
                        results: o.results,
                        size: o.size,
                        total: o.total
                    })
                })
            },
            err => {
                throw new Error(`Error response ${err.body}`)
            }
        )
    }

    public fetchExecutionsByModelDontSerialise(from: string, to: string, model_id: string) {
        return this.axios.get(`/executions?model_id=${model_id}&from=${from}&to=${to}`, { headers: { Authorization: "token" } })
    }

    public fetchAllExecutionsNoToken(from: string, to: string, approved: string) {
        return this.axios.get(`/executions?from=${from}&to=${to}&approved=${approved}`)
    }

    public fetchModelExecutionsNoToken(from: string, to: string, model_id: string) {
        return this.axios.get(`/executions?model_id=${model_id}&from=${from}&to=${to}`)
    }

    public postModelApproval(execution_id: string, acceptance: string) {
        return this.axios.post(`/executions/${execution_id}/approvals?acceptance=${acceptance}`, undefined, { headers: { Authorization: "token" } })
    }

    public postModelApprovalNoAuth(execution_id: string, acceptance: string) {
        return this.axios.post(`/executions/${execution_id}/approvals?acceptance=${acceptance}`)
    }

    public postFile(file_path: string) {
        return this.axios.post(`/file`, { file_path: file_path },
            { headers: { Authorization: "token" }, responseType: "blob" })
    }

    public postFileNoAuth(file_path: string) {
        return this.axios.post(`/file`, { file_path: file_path }, { responseType: "blob" })
    }
}
