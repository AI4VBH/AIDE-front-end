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

import { IOverview } from "../../../src/models/Admin/IOverview";
import ApiMocks from "../../fixtures/mockIndex";

export class ExecStatistics implements IOverview {
    deployed_models: number;
    model_executions: number;
    model_failures: number;

    constructor(executionStatistics: IOverview) {
        this.deployed_models = executionStatistics.deployed_models;
        this.model_executions = executionStatistics.model_executions;
        this.model_failures = executionStatistics.model_failures;
    }

    public static NO_FAILED_MODELS_DATA: ExecStatistics = new ExecStatistics(
        <IOverview>ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS,
    );

    public static FAILED_MODELS_DATA: ExecStatistics = new ExecStatistics(
        <IOverview>ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS,
    );
}
