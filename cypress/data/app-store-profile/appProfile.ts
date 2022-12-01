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

import { Application, Version } from "../../../src/models/AppRepo/Application";
import ApiMocks from "../../fixtures/mockIndex";

export class AppProfileData implements Application {
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

    public static APPLICATION_DETAILS1: AppProfileData = new AppProfileData(
        <Application>ApiMocks.APP_PROFILE_PAGE1,
    );
    public static APPLICATION_DETAILS2: AppProfileData = new AppProfileData(
        <Application>ApiMocks.APP_PROFILE_PAGE2,
    );
}
