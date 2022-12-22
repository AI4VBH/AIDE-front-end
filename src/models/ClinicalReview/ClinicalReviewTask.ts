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

import { IPagedResponse } from "../common/IPagedResponse";

export type PagedClinicalReviewList = IPagedResponse<ClinicalReviewRecord>;

export interface ClinicalReviewRecord {
    execution_id: string;
    clinical_review_message: ClinicalReviewTaskDetails;
    ready: boolean;

    /**
     * ISO Date Time of when the task was reviewed.
     */
    reviewed?: string;

    /**
     * ISO Date Time of when the task was received.
     */
    received: string;
}

export interface ClinicalReviewTaskDetails {
    task_id: string;
    reviewed_task_id: string;
    execution_id: string;
    reviewed_execution_id: string;
    correlation_id: string;
    workflow_name: string;
    patient_metadata: PatientMetadata;
    files: File[];
    reviewer_roles: string[];
    application_metadata: ApplicationMetadata;
}

export interface PatientMetadata {
    patient_name: string;
    patient_id: string;
    patient_dob: string;
    patient_sex: string;
}

export interface File {
    name: string;
    endpoint: string;
    bucket: string;
    relative_root_path: string;
    credentials: Credentials;
}

export interface Credentials {
    access_key: string;
    access_token: string;
    session_token: string;
}

export interface ApplicationMetadata {
    application_name: string;
    application_version: string;
    mode: string;
}

// Series / Study
export interface ClinicalReviewSeries {
    series_uid: string;
    modality: string;
    files: string[];
    total_frames: number;
}

export interface ClinicalReviewStudyDetails {
    study_date?: string;
    study: ClinicalReviewSeries[];
}
