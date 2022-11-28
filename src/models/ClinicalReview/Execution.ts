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

export interface ExecutionPage {
    total: number;
    page: number;
    size: number;
    results: Execution[];
}

export interface Execution {
    correlation_id: string;
    event: Event;
    model: ExecutionModel;
    result: Result;
    timestamp: Timestamp;
}

export interface Event {
    correlation_id: string;
    executions: Array<ExecutionEvent>;
    origin: Origin;
    resources: Array<Resources>;
}

export interface ExecutionModel {
    execution_uid: string;
    mode: string;
    model_name: string;
    model_uid: string;
    model_version: string;
}

export interface Result {
    clinical_review: ClinicalReview;
    message: string;
    status: string;
}

export interface Timestamp {
    clinical_review_received: string;
    inference_finished: string;
    inference_started: string;
    received_at: string;
}

export interface ClinicalReview {
    completed: boolean;
}

interface ExecutionEvent {
    execution_uid: string;
    model_uid: string;
    status: string;
    clinical_review_received: boolean;
}

interface Origin {
    file_path: string;
    namespace: string;
    patientID: string;
    received_timestamp: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    series: Array<Object>;
    studyUID: string;
    type: string;
}

interface Resources {
    file_path: string;
    namespace: string;
    type: string;
}
