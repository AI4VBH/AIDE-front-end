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

import { IModelSummary } from "../../../src/models/Admin/IModel";
import ApiMocks from "../../fixtures/mockIndex";

export class ModelSummaryData implements IModelSummary {
    model_id: number;
    model_name: string;

    constructor(ModelSummary: IModelSummary) {
        this.model_id = ModelSummary.model_id;
        this.model_name = ModelSummary.model_name;
    }

    public static MODEL_ASDA: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[0],
    );
    public static MODEL_BANANA: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[1],
    );
    public static MODEL_CRAYON: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[2],
    );
}
