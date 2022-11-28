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

import { Application, Version } from "../../../src/models/AppRepo/Application";
import ApiMocks from "../../fixtures/mockIndex";

export class ApplicationData implements Application {
    application_id: string;
    name: string;
    versions: Version[];
    createdAt: string;
    updatedAt: string;

    constructor(application: Application) {
        this.application_id = application.application_id;
        this.name = application.name;
        this.versions = application.versions;
        this.createdAt = application.createdAt;
        this.updatedAt = application.updatedAt;
    }

    public static MISSING_IMAGE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[0],
    );
    public static CE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[1],
    );
    public static UKCA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[2],
    );
    public static FDA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[3],
    );
    public static SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[4],
    );
    public static LONG_DESCRIPTION_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[5],
    );
    public static UNIQUE_SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[6],
    );
}
