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

import { VersionDetails } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application version details",
    post: "Something unexpected went wrong saving the application version details",
    put: "Something unexpected went wrong updating the application version details",
};

const http = createAxiosInstance(errorMessages);

export async function getAllVersionDetails(): Promise<VersionDetails[]> {
    const response = await http.get(`/app_store/version_details`);
    return response.data;
}

export async function getVersionDetails(version_details_id: string): Promise<VersionDetails> {
    const response = await http.get(`/app_store/version_details/${version_details_id}`);
    return response.data;
}

export async function createVersionDetails(
    version_details: VersionDetails,
): Promise<VersionDetails> {
    const response = await http.post(`/app_store/version_details`, version_details);
    return response.data;
}

export async function updateVersionDetails(
    version_details_id: string,
    version_details: VersionDetails,
): Promise<VersionDetails> {
    const response = await http.put(
        `/app_store/version_details/${version_details_id}`,
        version_details,
    );
    return response.data;
}
