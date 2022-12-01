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
import LogClient from "../src/models/Logs";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get logs for execution api", () => {
    let logClient: LogClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend logs",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const logs: Array<any> = [
        {
            json: {
                execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
                file: "/aide/data/11788765461998/stuff.dcm",
                level: "INFO",
                line_no: 28,
                logger: "aide - audit - logger",
                model_name: "test - model - operator",
                model_version: "1.0.0",
                module: "dicom_image",
                msg: "Model has loaded DICOM image dataset from storage",
                thread: "Thread - 289",
                type: "log",
                written_at: "2022 - 01 - 06T20: 50: 54.726Z",
                written_ts: 1641502254726809,
            },
        },
        {
            json: {
                execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
                file: "/aide/data/11788765461998/1.2.276.0.50.192168001099.8687553.14547392.4/0afd8048-9c37-4127-8d68-04eb4c430e29/origin/1.2.826.0.1.3680043.8.498.11734710184436592219446864127652443400/1.2.826.0.1.3680043.8.498.49074199611187809166050805317026886315.dcm",
                level: "INFO",
                line_no: 28,
                logger: "aide-audit-logger",
                model_name: "test-model-operator",
                model_version: "1.0.0",
                module: "dicom_image",
                msg: "Model has loaded DICOM image dataset from storage",
                thread: "Thread-289",
                type: "log",
                written_at: "2022-01-06T20:50:54.726Z",
                written_ts: 1641502254726809,
            },
        },
    ];

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        logClient = new LogClient(providerPort);
    });

    after(() => {
        provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get logs", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Logs exist for execution exist in elasticsearch")
                    .uponReceiving("A request to retrieve logs for the execution")
                    .withRequest({
                        path: "/logs/4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 200,
                        body: logs,
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of all models", async () => {
            const response = await logClient.fetchLogs("4e67b9e0-07b7-41e8-93c7-6f1561686ebc");
            return expect(response.data).to.include.deep.members(logs);
        });
    });

    describe("Get logs, none exist for execution", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Execution with logs does not exist")
                    .uponReceiving("A request to retrieve logs for the execution")
                    .withRequest({
                        path: "/logs/1234-5678-9",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 404,
                        body: {
                            message: "This resource doesn't exist",
                            status: 404,
                        },
                    }),
            );
        });

        it("Will return a 404", () => {
            const response = logClient.fetchLogs("1234-5678-9");
            return expect(response).rejectedWith("Request failed with status code 404");
        });
    });

    describe("Get logs, no authorisation", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Models exist in elasticsearch")
                    .uponReceiving("A request to retrieve all models without authorisation")
                    .withRequest({
                        path: "/logs/4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
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

        it("Will return a 401", () => {
            const response = logClient.fetchLogsNoToken("4e67b9e0-07b7-41e8-93c7-6f1561686ebc");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
