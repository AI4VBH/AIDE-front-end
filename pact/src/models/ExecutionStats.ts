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

import AbstractClient from "./AbstractClient";
import { ExecutionStat } from "../../../src/models/ClinicalReview/ExecutionStat";

export class ExecutionsStat {
    private executionStat: ExecutionStat;

    constructor(executionStat: ExecutionStat) {
        this.executionStat = executionStat;
    }

    public getExecutionPage(): ExecutionStat {
        return this.executionStat;
    }
}

export default class ExecutionStatClient extends AbstractClient {
    public fetchOverview(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`;
        if (model_id !== undefined) {
            url = `${url}&model_id=${model_id}`;
        }

        return this.axios.get(url, { headers: { Authorization: "token" } }).then((res) => {
            return res.data.map((o: ExecutionStat) => {
                return new ExecutionsStat({
                    average_execution_time: o.average_execution_time,
                    average_turnaround_time: o.average_turnaround_time,
                    errors: o.errors,
                    executions: o.executions,
                    failures: o.failures,
                });
            });
        });
    }

    public fetchStatsDontSerialise(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`;
        if (model_id !== undefined) {
            url = `${url}&model_id=${model_id}`;
        }
        return this.axios.get(url, { headers: { Authorization: "token" } });
    }

    public fetchStatsNoAuth(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`;
        if (model_id !== undefined) {
            url = `${url}&model_id=${model_id}`;
        }
        return this.axios.get(url);
    }
}
