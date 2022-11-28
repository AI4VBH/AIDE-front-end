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

import {
    ClinicalReviewTaskDetail,
    PagedClinicalReviewList,
} from "@/models/ClinicalReview/ClinicalReviewTask";
import {
    createAxiosInstance,
    ErrorMessageMap,
    isResultOk,
    provideDefaultResult,
} from "@/utils/axios-helpers";

const clinicalReviewErrorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving clinical review tasks",
};

const http = createAxiosInstance(clinicalReviewErrorMessages);

interface CRTaskQueryParams {
    pageNumber: number;
    pageSize: number;
    patientName?: string;
    patientId?: string;
    applicationName?: string;
}

export async function getStudy(taskExecutionId: string): Promise<ClinicalReviewTaskDetail> {
    const response = await http.get<ClinicalReviewTaskDetail>(
        `/clinical-review/${taskExecutionId}`,
    );

    return provideDefaultResult(response, { study: [] });
}

export async function getDicomFile(key: string): Promise<ArrayBuffer> {
    const response = await http.get<ArrayBuffer>(`/clinical-review/dicom?key=${key}`, {
        responseType: "arraybuffer",
    });

    return response.data;
}

export async function getClinicalReviewTasks(
    query: CRTaskQueryParams,
): Promise<PagedClinicalReviewList> {
    const params = new URLSearchParams({
        pageNumber: `${query.pageNumber}`,
        pageSize: `${query.pageSize}`,
        patientId: query.patientId ?? "",
        patientName: query.patientName ?? "",
        applicationName: query.applicationName ?? "",
    });

    const response = await http.get<PagedClinicalReviewList>(`/clinical-review?${params}`);

    return provideDefaultResult(response, {
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalRecords: 0,
        data: [],
        succeeded: false,
    });
}

export async function updateClinicalReview(
    execution_uid: string,
    acceptance: boolean,
    reason: string,
    message: string,
) {
    const response = await http.put(`/clinical-review/${execution_uid}`, {
        acceptance: acceptance,
        reason: reason,
        message: message,
    });
    return isResultOk(response);
}
