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

import { IOverview } from "@/models/Admin/IOverview";
import { IIndexedIssue, IIssue } from "@/models/Admin/IIssue";
import { IModelSummary, IModelDetails } from "@/models/Admin/IModel";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
    put: "Something unexpected went wrong with your dismissal request!",
};

const http = createAxiosInstance(errorMessages);

// Overview Section
export async function getOverview(filterPeriod: string): Promise<IOverview> {
    const response = await http.get(`/overview?period=${filterPeriod}`);

    return response.data;
}

// Issues Section
export async function getIssues(): Promise<IIssue[]> {
    const response = await http.get("/issues/failed");

    return isResultOk(response) ? response.data : [];
}

export async function dismissIssue(dismissedItem: IIndexedIssue): Promise<boolean> {
    const response = await http.put(
        `/workflowinstances/${dismissedItem.issue.workflow_instance_id}/executions/${dismissedItem.issue.execution_id}/acknowledge`,
    );
    return isResultOk(response);
}

// Models Section
export async function getModels(): Promise<IModelSummary[]> {
    const response = await http.get(`/models`);

    return response.data;
}

export async function getModelStatsForGraphs(
    model_id: number,
    start_date: string,
    end_date: string,
): Promise<IModelDetails> {
    const response = await http.get(
        `/graph/${model_id}?start_date=${start_date}&end_date=${end_date}`,
    );

    return response.data;
}
