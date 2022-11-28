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

import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import SeriesList from "./series-list.vue";

describe("<series-list />", () => {
    before(() => {
        window.FRONTEND_API_HOST = "http://localhost:8080";
    });

    it("renders series list", () => {
        cy.intercept("/clinical-review/dicom?key=CT000000.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct");
        cy.intercept("/clinical-review/dicom?key=DO000000.dcm", {
            fixture: "clinical-review/DO000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("doc");

        const propsData = {
            showSeries: true,
            study: [
                {
                    series_uid: "5910155b-3c21-4438-b00a-27754596dd28",
                    modality: "CT",
                    files: ["CT000000.dcm"],
                },
                {
                    series_uid: "7d6563ea-852c-4962-a820-637c681f47f1",
                    modality: "DOC",
                    files: ["DO000000.dcm"],
                },
            ] as ClinicalReviewSeries[],
        };

        cy.mount(SeriesList, { propsData });
        cy.wait("@ct");
        cy.wait("@doc");

        cy.dataCy("series-list").should("be.visible");
        cy.dataCy("series-item").should("have.length", 2);
    });

    it("panel hidden when showSeries is false", () => {
        const propsData = {
            showSeries: false,
            study: [],
        };

        cy.mount(SeriesList, { propsData });
        cy.dataCy("series-list").should("not.be.visible");
    });
});
