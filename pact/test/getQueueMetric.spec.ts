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
import QueueStats, { QueueStatsClient } from "../src/models/QueueStats";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Queue metric api", () => {
    let queueClient: QueueStatsClient;
    const provider = new Pact({
        consumer: "Front-end",
        provider: "Backend queue stats",
        log: path.resolve(process.cwd(), "pact/logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pact/pacts"),
    });

    const queueStats = {
        name: "input",
        delivered: 5,
        message_count: 10,
        published: 5,
    };

    before(async () => {
        await provider.setup();
        const providerPort = provider.mockService["port"];
        queueClient = new QueueStatsClient(providerPort);
    });

    after(async () => {
        await provider.finalize();
    });

    afterEach(async () => {
        await provider.verify();
    });

    describe("Get input queue", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("The input queue exists")
                    .uponReceiving("A request for the input queue stats")
                    .withRequest({
                        path: "/queues/input",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        body: eachLike(queueStats),
                        status: 200,
                        headers: {
                            "Content-Type": "application/json charset=utf-8",
                        },
                    }),
            );
        });
        it("Will receive queue stats for the input queue", () => {
            return expect(queueClient.fetchStats("input")).to.eventually.have.deep.members([
                new QueueStats(queueStats),
            ]);
        });
    });

    describe("404 if queue name is not specified", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Queues exist with metrics")
                    .uponReceiving("A request for a queue which doesn't exist")
                    .withRequest({
                        path: "/queues/invalid",
                        method: "GET",
                        headers: {
                            Authorization: "token",
                            Accept: "application/json, text/plain, */*",
                        },
                    })
                    .willRespondWith({
                        status: 404,
                    }),
            );
        });

        it("Will give back a 404 if there is no queue", async () => {
            const response = queueClient.fetchQueueDontSerialise("invalid");
            return expect(response).rejectedWith("Request failed with status code 404");
        });
    });

    describe("401 if unauthorised", () => {
        before(() => {
            return provider.addInteraction(
                new Interaction()
                    .given("Queues exist with metrics")
                    .uponReceiving("A request without an authentication token")
                    .withRequest({
                        path: "/queues/no_auth",
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

        it("Will error 401 if auth is not provided", () => {
            const response = queueClient.fetchQueueDontSerialise("no_auth");
            return expect(response).rejectedWith("Request failed with status code 401");
        });
    });
});
