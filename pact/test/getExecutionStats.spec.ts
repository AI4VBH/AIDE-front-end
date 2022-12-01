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
import path from "path";
import * as sinonChai from "sinon-chai";
import { Pact, Interaction, Matchers } from "@pact-foundation/pact";

const expect = chai.expect;
import ExecutionStatClient, { ExecutionsStat } from "../src/models/ExecutionStats";
import { ExecutionStat } from "../../src/models/ClinicalReview/ExecutionStat";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get executions stats api", () => {
    let executionStatClient: ExecutionStatClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend execution stats",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const executionStats: ExecutionStat = {
        average_execution_time: 50,
        average_turnaround_time: 90,
        errors: 6,
        executions: 2,
        failures: 10,
    };

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        executionStatClient = new ExecutionStatClient(providerPort);
    });

    after(() => {
        provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get execution stats", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions exist in elasticsearch")
                    .uponReceiving("A request for the execution stats")
                    .withRequest({
                        path: "/execution_stats",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "days=5",
                    })
                    .willRespondWith({
                        status: 200,
                        body: eachLike(executionStats),
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return execution stats for all models over a 5 day period", async () => {
            const response = await executionStatClient.fetchOverview("5");
            return expect(response).to.have.deep.members([new ExecutionsStat(executionStats)]);
        });
    });

    describe("Get execution stats by model name", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions exist for a model")
                    .uponReceiving("A request for the model's execution stats")
                    .withRequest({
                        path: "/execution_stats",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "days=5&model_id=model1",
                    })
                    .willRespondWith({
                        status: 200,
                        body: eachLike(executionStats),
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of executions for the model", async () => {
            const response = await executionStatClient.fetchOverview("5", "model1");
            return expect(response).to.have.deep.members([new ExecutionsStat(executionStats)]);
        });
    });

    describe("Get execution stats by model, model does not exist", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("There are models with executions in AIDE")
                    .uponReceiving(
                        "A request to get executions for a model which does not exist in AIDE",
                    )
                    .withRequest({
                        path: "/execution_stats",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "days=5&model_id=invalid",
                    })
                    .willRespondWith({
                        status: 400,
                    }),
            );
        });

        it("Will return 400 when a non existent model name is provided", async () => {
            const response = executionStatClient.fetchStatsDontSerialise("5", "invalid");
            return expect(response).rejectedWith("Request failed with status code 400");
        });
    });

    describe("Get All executions without auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions are recorded in AIDE")
                    .uponReceiving("A request for all executions stats without auth")
                    .withRequest({
                        path: "/execution_stats",
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "days=5",
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return 401", () => {
            const response = executionStatClient.fetchStatsNoAuth("5");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });

    describe("Get model executions without auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions are recorded in AIDE")
                    .uponReceiving("A request for model executions without auth")
                    .withRequest({
                        path: "/execution_stats",
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "days=5&model_id=model1",
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return 401", () => {
            const response = executionStatClient.fetchStatsNoAuth("5", "model1");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
