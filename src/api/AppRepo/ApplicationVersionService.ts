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

import { Version } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application version",
    post: "Something unexpected went wrong saving the application version",
    put: "Something unexpected went wrong updating the application version",
};

const http = createAxiosInstance(errorMessages);

export async function getAllVersions(): Promise<Version[]> {
    const response = await http.get(`/app_store/versions`);
    return response.data;
}

export async function getVersion(version_id: string): Promise<Version> {
    const response = await http.get(`/app_store/versions/${version_id}`);
    return response.data;
}

export async function createVersion(version: Version): Promise<Version> {
    const response = await http.post(`/app_store/versions/`, version);
    return response.data;
}

export async function updateVersion(
    application_id: string,
    version_id: string,
    version: Version,
): Promise<Version> {
    const response = await http.put(`/app_store/versions/${version_id}`, version);
    return response.data;
}
