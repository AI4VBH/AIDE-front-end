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
import PipelineClient from "../src/models/Pipeline";
import { Execution } from "../../src/models/Execution";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get Pipeline for correlation", () => {
    let pipelineClient: PipelineClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend pipeline",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const pipeline: Array<Execution> = [
        {
            timestamp: {
                received_at: "2021-07-12T22:45:45.817420",
                inference_started: "2021-07-12T22:46:45.817420",
                inference_finished: "2021-08-24T09:57:57.396009",
                clinical_review_received: "2021-07-12T22:48:45.817420",
            },
            model: {
                model_version: "1.0.0",
                model_uid: "model_1/1.0.0",
                execution_uid: "fcee4054-d966-4142-abb3-4081ba763895",
                mode: "QA",
                model_name: "model_1",
            },
            correlation_id: "461e696c-2baf-43f8-8c41-7fedbf9f6711",
            event: {
                correlation_id: "12345-67890",
                origin: {
                    received_timestamp: "2020-01-01T12:05:43",
                    series: [
                        {
                            SeriesInstanceUID: "colon.image",
                            Modality: "MR",
                            SliceThickness: 3,
                        },
                    ],
                    namespace: "dicom-ingestor/1.0.0",
                    studyUID: "MyStudyID",
                    patientID: "MyPatientId",
                    file_path: "WORKDIR\\MyStudyID",
                    type: "dicom/origin",
                },
                resources: [
                    {
                        namespace: "dicomingestor/1.0.0",
                        file_path: "WORKDIR\\MyStudyID",
                        type: "dicom/origin",
                    },
                ],
                executions: [
                    {
                        execution_uid: "fcee4054-d966-4142-abb3-4081ba763895",
                        model_uid: "model_1/1.0.0",
                        status: "done",
                        clinical_review_received: true,
                    },
                ],
            },
            result: {
                status: "success",
                clinical_review: {
                    completed: true,
                },
                message: "Done",
            },
        },
        {
            timestamp: {
                received_at: "2021-07-12T22:45:45.817420",
                inference_started: "2021-07-12T22:46:45.817420",
                inference_finished: "2021-08-24T09:57:57.396009",
                clinical_review_received: "2021-07-12T22:48:45.817420",
            },
            model: {
                model_version: "1.0.0",
                model_uid: "model_1/1.0.0",
                execution_uid: "fcee4054-d966-4142-abb3-4081ba763895",
                mode: "QA",
                model_name: "model_1",
            },
            correlation_id: "461e696c-2baf-43f8-8c41-7fedbf9f6711",
            event: {
                correlation_id: "12345-67890",
                origin: {
                    received_timestamp: "2020-01-01T12:05:43",
                    series: [
                        {
                            SeriesInstanceUID: "colon.image",
                            Modality: "MR",
                            SliceThickness: 3,
                        },
                    ],
                    namespace: "dicom-ingestor/1.0.0",
                    studyUID: "MyStudyID",
                    patientID: "MyPatientId",
                    file_path: "WORKDIR\\MyStudyID",
                    type: "dicom/origin",
                },
                resources: [
                    {
                        namespace: "dicomingestor/1.0.0",
                        file_path: "WORKDIR\\MyStudyID",
                        type: "dicom/origin",
                    },
                ],
                executions: [
                    {
                        execution_uid: "fcee4054-d966-4142-abb3-4081ba763895",
                        model_uid: "model_1/1.0.0",
                        status: "done",
                        clinical_review_received: true,
                    },
                ],
            },
            result: {
                status: "success",
                clinical_review: {
                    completed: true,
                },
                message: "Done",
            },
        },
    ];

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        pipelineClient = new PipelineClient(providerPort);
    });

    after(() => {
        provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get Pipeline for correlation", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions have been completed for some data")
                    .uponReceiving("A request containing the correlation ID for the executions")
                    .withRequest({
                        path: "/pipeline/4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 200,
                        body: pipeline,
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });

        it("Will return a list of all models", async () => {
            const response = await pipelineClient.fetchPipeline(
                "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            );
            return expect(response).to.include.deep.members(pipeline);
        });
    });

    describe("Get pipeline, no auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Multiple executions exist for a correlation")
                    .uponReceiving("A request for the pipeline with no auth")
                    .withRequest({
                        path: "/pipeline/4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
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
            const response = pipelineClient.fetchPipelineNoAuth(
                "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            );
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
