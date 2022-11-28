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
    PagedClinicalReviewList,
    ClinicalReviewTask,
} from "../../../src/models/ClinicalReview/ClinicalReviewTask";
import ApiMocks from "../../fixtures/mockIndex";
export class ClinicalReviewTaskData implements PagedClinicalReviewList {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: ClinicalReviewTask[];
    succeeded: boolean;
    errors: any;
    message: any;

    constructor(taskData: PagedClinicalReviewList) {
        this.pageNumber = taskData.pageNumber;
        this.pageSize = taskData.pageSize;
        this.totalPages = taskData.totalPages;
        this.data = taskData.data;
        this.errors = taskData.errors;
        this.message = taskData.message;
    }

    public static LIST_OF_ALL_TASKS: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_TASKS,
    );
    public static SEARCH_PATIENT_ID: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_ID,
    );
    public static SEARCH_PATIENT_NAME: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_NAME,
    );
    public static SEARCH_APPLICATION_NAME: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_APPLICATION_NAME,
    );
    public static PAGINATION_PAGE_2: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_2,
    );
    public static PAGINATION_PAGE_9: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_9,
    );
    public static PAGINATION_PAGE_10: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_10,
    );
}
