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

import { Execution } from "../../../src/models/ClinicalReview/Execution";
import AbstractClient from "./AbstractClient";

export class Executions {
    private execution: Execution;

    constructor(execution: Execution) {
        this.execution = execution;
    }

    public getPipeline(): Execution {
        return this.execution;
    }
}

export default class PipelineClient extends AbstractClient {
    public fetchPipeline(correlation_id: string) {
        return this.axios
            .get(`/pipeline/${correlation_id}`, { headers: { Authorization: "token" } })
            .then((res) => {
                const data: Array<Execution> = res.data;
                return data.map((ex: Execution) => {
                    return new Executions({
                        correlation_id: ex.correlation_id,
                        event: ex.event,
                        model: ex.model,
                        result: ex.result,
                        timestamp: ex.timestamp,
                    }).getPipeline();
                });
            });
    }

    public fetchPipelineNoAuth(correlation_id: string) {
        return this.axios.get(`/pipeline/${correlation_id}`);
    }
}
