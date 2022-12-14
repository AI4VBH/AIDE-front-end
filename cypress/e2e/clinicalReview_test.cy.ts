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

import ClinicalReviewPage from "../pages/clinicalReview";

const reviewPage = new ClinicalReviewPage();

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
    });
    it("Can accept and reject a task", () => {
        reviewPage.assertAcceptRejectTask();
    });

    it("Can view and filter the clinical review worklist tasks", () => {
        reviewPage.assertViewAndFilterTasks();
    });

    it("Can use pagination to view clinical review worklist tasks", () => {
        reviewPage.assertPaginationandViewTasks();
    });

    it("Can view series selector and DICOMs", () => {
        reviewPage.viewDicomsAndSeriesSelector();
    });

    it("Can view and pin Metadata", () => {
        reviewPage.viewMetadataAndPin();
    });

    it("Can view patient details in top panel", () => {
        reviewPage.assertPatientDetails();
    });
    [400, 404, 500].forEach((error_code) => {
        it(`Toast displayed on both accepting or rejecting a task if ${error_code} status is returned`, () => {
            reviewPage.assertToastIfErrorOnReview(error_code);
        });
    });
});

describe("Clinical review page - No tasks", () => {
    it("When there are no tasks to review, a message informing me of this is displayed", () => {
        reviewPage.assertNoTasksMessage();
    });
});
