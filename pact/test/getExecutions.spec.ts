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

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import path = require("path");
import * as sinonChai from "sinon-chai";
import { Pact, Interaction, Matchers } from "@pact-foundation/pact";

const expect = chai.expect;
import ExecutionClient, { ExecutionsPage } from "../src/models/Executions";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get executions api", () => {
    let executionClient: ExecutionClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend executions",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const executionPage = {
        page: 1,
        size: 1,
        total: 1,
        results: [
            {
                correlation_id: "1234",
                event: {
                    executions: [
                        {
                            execution_uid: "29134745-90be-4473-86f2-c2e3631218b6",
                            model_uid: "dicom_converter/0.2",
                            status: "success",
                            clinical_review_received: true,
                        },
                        {
                            execution_uid: "4f1d45ee-608f-44df-a5a0-334662cc2b82",
                            model_uid: "reporting/0.3",
                            clinical_review_received: true,
                            status: "success",
                        },
                    ],
                    origin: {
                        file_path:
                            "933_314_4897/1.2.276.0.7230010.3.1.2.296485376.1.1521713792.1903390/c6a19699-8303-4484-90d4-fa8137747556/origin",
                        patientID: "933 314 4897",
                        series: [],
                        namespace: "dicom-ingestor/1.0.0",
                        type: "dicom/origin",
                        studyUID:
                            "1.3.6.1.4.1.14519.5.2.1.7009.2403.459769504433903221904322299373",
                        received_timestamp: "2021-08-24T12:00:39.193567",
                    },
                    resources: [
                        {
                            file_path:
                                "933_314_4897/1.2.276.0.7230010.3.1.2.296485376.1.1521713792.1903390/c6a19699-8303-4484-90d4-fa8137747556/reporting/0.3/4f1d45ee-608f-44df-a5a0-334662cc2b82/report/1.2.276.0.7230010.3.1.2.296485376.1.1521713792.1903390",
                            namespace: "reporting/0.3",
                            type: "dicom/result",
                        },
                    ],
                    correlation_id: "c6a19699-8303-4484-90d4-fa8137747556",
                },
                model: {
                    mode: "CU",
                    model_version: "0.3",
                    execution_uid: "4bff8376-a955-4976-a418-bf4249c504c1",
                    model_name: "reporting",
                    model_uid: "reporting/0.3",
                },
                result: {
                    message: "things",
                    clinical_review: {
                        completed: false,
                    },
                    status: "success",
                },
                timestamp: {
                    inference_started: "2021-08-24T16:54:07.092243",
                    received_at: "2021-08-24T12:00:39.193567",
                    clinical_review_received: "2021-08-24T16:54:09.374960",
                    inference_finished: "2021-08-24T16:54:09.282085",
                },
            },
        ],
    };

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        executionClient = new ExecutionClient(providerPort);
    });

    after(() => {
        provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get execution", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions exist in elasticsearch")
                    .uponReceiving("A request for the executions")
                    .withRequest({
                        path: "/executions",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "from=0&to=1&approved=true",
                    })
                    .willRespondWith({
                        status: 200,
                        body: eachLike(executionPage),
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of executions and page information", async () => {
            const response = await executionClient.fetchExecutionsPage("0", "1", "true");
            return expect(response).to.have.deep.members([new ExecutionsPage(executionPage)]);
        });
    });

    describe("Get executions by model name", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions exist for a model")
                    .uponReceiving("A request for the model's executions")
                    .withRequest({
                        path: "/executions",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "model_id=reporting/0.3&from=0&to=1",
                    })
                    .willRespondWith({
                        status: 200,
                        body: eachLike(executionPage),
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of executions for the model", async () => {
            const response = await executionClient.fetchExecutionsByModel(
                "0",
                "1",
                "reporting/0.3",
            );
            expect(response).to.have.deep.members([new ExecutionsPage(executionPage)]);
        });
    });

    describe("Get executions by model, name does not exist", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("There are models with executions in AIDE")
                    .uponReceiving(
                        "A request to get executions for a model which does not exist in AIDE",
                    )
                    .withRequest({
                        path: "/executions",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "model_id=does_not_exist&from=0&to=10",
                    })
                    .willRespondWith({
                        status: 400,
                    }),
            );
        });

        it("Will return 400 when a non existent model name is provided", async () => {
            const response = executionClient.fetchExecutionsByModelDontSerialise(
                "0",
                "10",
                "does_not_exist",
            );
            return expect(response).rejectedWith("Request failed with status code 400");
        });
    });

    describe("Get All executions without auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions are recorded in AIDE")
                    .uponReceiving("A request for all executions without auth")
                    .withRequest({
                        path: "/executions",
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "from=0&to=1&approved=true",
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return 401", () => {
            const response = executionClient.fetchAllExecutionsNoToken("0", "1", "true");
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
                        path: "/executions",
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "model_id=reporting/0.3&from=0&to=1",
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return 401", () => {
            const response = executionClient.fetchModelExecutionsNoToken("0", "1", "reporting/0.3");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });

    describe("Update execution approval", () => {
        const responseJson = { status: true, message: "Approval updated" };
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("An execution exists to review")
                    .uponReceiving("A request to approve the execution")
                    .withRequest({
                        path: "/executions/1234-5678-9/approvals",
                        method: "POST",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "acceptance=true",
                    })
                    .willRespondWith({
                        status: 200,
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                        body: responseJson,
                    }),
            );
        });

        it("Will return approval request status", async () => {
            const response = await executionClient.postModelApproval("1234-5678-9", "true");
            return expect(response.data).to.eql(responseJson);
        });
    });

    describe("Update execution approval no auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("An execution exists to review")
                    .uponReceiving("A reques to approve the execution with no auth")
                    .withRequest({
                        path: "/executions/1234-5678-9/approvals",
                        method: "POST",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        query: "acceptance=true",
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return approval request status", () => {
            const response = executionClient.postModelApprovalNoAuth("1234-5678-9", "true");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
