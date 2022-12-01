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

import { IExportDestination } from "@/models/export-destinations/ExportDestination";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";
import { AxiosResponse } from "axios";
import Vue from "vue";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving DICOM configurations",
    delete: "Something unexpected went wrong deleting the DICOM configuration",
    put: "Something unexpected went wrong updating the DICOM configuration",
    post: "Something unexpected went wrong creating DICOM configuration",
};

const httpService = createAxiosInstance(errorMessages);

export async function getExportDestinations(): Promise<IExportDestination[]> {
    const result = await httpService.get<IExportDestination[]>("/destinations");

    return isResultOk(result) ? result.data : [];
}

export async function createExportDestination(
    destination: IExportDestination,
): Promise<[boolean, string]> {
    const result = await httpService.post("/destinations", destination, {
        validateStatus: (status) => (status >= 200 && status <= 299) || status === 409,
    });

    const success = isResultOk(result);
    let message = "";

    if (!success && result.status === 409) {
        message = "A DICOM configuration with this name already exists";
    }

    return [success, message];
}

export async function updateExportDestination(
    destinationName: string,
    destination: IExportDestination,
): Promise<[boolean, string]> {
    const result = await httpService.put(`/destinations/${destinationName}`, destination);

    const success = isResultOk(result);
    let message = "";

    if (!success && result.status === 409) {
        message = "A DICOM configuration with this name already exists";
    }

    return [success, message];
}

export async function echoExportDestination(destinationName: string): Promise<AxiosResponse> {
    const result = await httpService.get(`/destinations/echo/${destinationName}`, {
        validateStatus: () => true,
    });

    return result;
}

export async function deleteExportDestination(destinationName: string): Promise<boolean> {
    const result = await httpService.delete(`/destinations/${destinationName}`);

    return isResultOk(result);
}
