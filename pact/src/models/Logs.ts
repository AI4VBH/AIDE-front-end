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

import AbstractClient from "./AbstractClient";

export default class LogClient extends AbstractClient {
    private url = "/logs/";

    public fetchLogs(executionId: string) {
        return this.axios.get(`${this.url}${executionId}`, { headers: { Authorization: "token" } });
    }

    public fetchLogsNoToken(executionId: string) {
        return this.axios.get(`${this.url}${executionId}`);
    }
}
