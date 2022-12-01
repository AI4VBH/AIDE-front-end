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

import { Application } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application",
    post: "Something unexpected went wrong saving the application",
    put: "Something unexpected went wrong updating the application",
};

const http = createAxiosInstance(errorMessages);

export async function getAllApplications(): Promise<Application[]> {
    const response = await http.get(`/app_store/applications/`);
    return response.data;
}

export async function getAllApplicationsFilteredByStatus(status: string): Promise<Application[]> {
    const response = await http.get(`/app_store/applications?status=${status}`);
    return response.data;
}

export async function getApplication(application_id: string): Promise<Application> {
    const response = await http.get(`/app_store/applications/${application_id}`);
    return response.data;
}

export async function getApplicationFilteredByStatus(
    application_id: string,
    status: string,
): Promise<Application> {
    const response = await http.get(`/app_store/applications/${application_id}?status=${status}`);
    return response.data;
}

export async function createApplication(application: Application): Promise<Application> {
    const response = await http.post(`/app_store/applications/`, application);
    return response.data;
}

export async function updateApplication(application: Application): Promise<Application> {
    const response = await http.put(`/app_store/applications/`, application);
    return response.data;
}
