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

import { OutputType } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the output types",
    post: "Something unexpected went wrong saving the output type",
};

const http = createAxiosInstance(errorMessages);

export async function getAllOutputType(): Promise<OutputType[]> {
    const response = await http.get(`/app_store/output_types`);
    return response.data;
}

export async function createOutputType(outputType: OutputType): Promise<OutputType> {
    const response = await http.post(`/app_store/output_types`, outputType);
    return response.data;
}
