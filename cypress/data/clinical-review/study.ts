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
    ClinicalReviewSeries,
    ClinicalReviewTaskDetail,
} from "../../../src/models/ClinicalReview/ClinicalReviewTask";
import ApiMocks from "../../fixtures/mockIndex";

export class StudyData implements ClinicalReviewTaskDetail {
    study_date?: string;
    study: ClinicalReviewSeries[];

    constructor(studyData: ClinicalReviewTaskDetail) {
        this.study_date = studyData.study_date;
        this.study = studyData.study;
    }

    public static STUDY_DATA_2: StudyData = new StudyData(
        <ClinicalReviewTaskDetail>ApiMocks.CLINICAL_REVIEW_EXECUTION_2,
    );
}
