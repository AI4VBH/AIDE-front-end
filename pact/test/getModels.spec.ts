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

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import path = require("path");
import * as sinonChai from "sinon-chai";
import { Pact, Interaction, Matchers } from "@pact-foundation/pact";

const expect = chai.expect;
import { Model } from "../../src/models/Model";
import { ModelClient } from "../src/models/Models";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get all models api", () => {
    let modelClient: ModelClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend models",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const models: Array<Model> = [
        {
            active: true,
            mode: "CU",
            model_name: "Test_model_1",
            model_version: "1.0.0",
            predicate: "things > stuff",
            stats: {
                average_execution_time: 90,
                average_turnaround_time: 180,
                errors: 5,
                executions: 50,
                failures: 4,
            },
        },
        {
            active: false,
            mode: "QA",
            model_name: "Test_model_2",
            model_version: "1.0.0",
            predicate: "things < stuff",
            stats: {
                average_execution_time: 900,
                average_turnaround_time: 1500,
                errors: 0,
                executions: 50,
                failures: 0,
            },
        },
    ];

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        modelClient = new ModelClient(providerPort);
    });

    after(() => {
        provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get models", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Models exist in elasticsearch")
                    .uponReceiving("A request to retrieve all models")
                    .withRequest({
                        path: "/models",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 200,
                        body: models,
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of all models", async () => {
            const response = await modelClient.fetchModels();
            return expect(response).to.have.deep.members(models);
        });
    });

    describe("Get models, none exist", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Models do not exist in elasticsearch")
                    .uponReceiving("A request to retrieve all models")
                    .withRequest({
                        path: "/models",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 200,
                        body: [],
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of no models", async () => {
            const response = await modelClient.fetchModelsNoneExist();
            return expect(response.data).to.have.length(0);
        });
    });

    describe("Get models, no authorisation", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Models exist in elasticsearch")
                    .uponReceiving("A request to retrieve all models without authorisation")
                    .withRequest({
                        path: "/models",
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return a 404", () => {
            const response = modelClient.fetchModelsNoAuth();
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
