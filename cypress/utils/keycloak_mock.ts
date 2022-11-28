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

import { createMockInstance, activateMock } from "keycloak-mock";

//This doesn't work yet but I have left it here as a WIP for the login tests.

export class Keycloak {
    instance: any;
    activeMock: any;
    user: any;
    bearerToken: any;

    async MockKeycloak() {
        this.instance = await createMockInstance({
            authServerURL: "https://localhost:8443/auth",
            realm: "aide",
            clientID: "aide-app",
        });
        this.activeMock = activateMock(this.instance);

        this.user = this.instance.database.createUser({
            name: "test",
            email: "testuser@test.com", // username will be email
            credentials: [
                {
                    value: "Password01!",
                },
            ],
        });

        console.log(this.user.profile, this.user.credentials);

        this.bearerToken = this.instance.createBearerToken(this.user.profile.id);
    }
}
