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
import ExecutionClient from "../src/models/Executions";
import { randomBytes } from "crypto";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Get File output", () => {
    let executionClient: ExecutionClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend file",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

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

    describe("Get File for execution", () => {
        const bytes = randomBytes(50);
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Executions have been completed for some data")
                    .uponReceiving("A request for the output of the execution")
                    .withRequest({
                        path: "/file",
                        method: "POST",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        body: { file_path: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc" },
                    })
                    .willRespondWith({
                        status: 200,
                        body: bytes,
                        headers: {
                            "Content-Type": "application/pdf",
                        },
                    }),
            );
        });

        it("Will return the file as bytes", async () => {
            const response = await executionClient.postFile("4e67b9e0-07b7-41e8-93c7-6f1561686ebc");
            return expect(response.data).to.eql(bytes.toJSON());
        });
    });

    describe("Get file, no auth", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("An output file exists for an execution")
                    .uponReceiving("A request for the file with no auth")
                    .withRequest({
                        path: "/file",
                        method: "POST",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                        body: { file_path: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc" },
                    })
                    .willRespondWith({
                        status: 401,
                    }),
            );
        });

        it("Will return a 401", () => {
            const response = executionClient.postFileNoAuth("4e67b9e0-07b7-41e8-93c7-6f1561686ebc");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });

    describe("Get file, not found", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Output for executions is saved in the filesystem")
                    .uponReceiving("A request for a file which doesn't exist")
                    .withRequest({
                        path: "/file",
                        method: "POST",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                        body: { file_path: "invalid" },
                    })
                    .willRespondWith({
                        status: 404,
                    }),
            );
        });

        it("Returns 404 when no file exists", () => {
            const response = executionClient.postFile("invalid");
            return expect(response).rejectedWith("Request failed with status code 404");
        });
    });
});
