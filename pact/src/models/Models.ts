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

import { Model } from "../../../src/models/ClinicalReview/Model";
import AbstractClient from "./AbstractClient";

export default class Models {
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public getModel(): Model {
        return this.model;
    }
}

export class ModelClient extends AbstractClient {
    private url = "/models";

    public fetchModels() {
        return this.axios.get(this.url, { headers: { Authorization: "token" } }).then(
            (res) => {
                const data: Array<Model> = res.data;
                return data.map((model: Model) => {
                    return new Models({
                        model_name: model.model_name,
                        model_version: model.model_version,
                        active: model.active,
                        mode: model.mode,
                        predicate: model.predicate,
                        stats: model.stats,
                    }).getModel();
                });
            },
            (err) => {
                throw new Error(`Error response ${err.body}`);
            },
        );
    }

    public fetchModelsNoneExist() {
        return this.axios.get(this.url, { headers: { Authorization: "token" } });
    }

    public fetchModelsNoAuth() {
        return this.axios.get(this.url);
    }
}
