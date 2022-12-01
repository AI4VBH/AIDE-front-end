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

import SeriesItem from "./series-item.vue";

describe("<series-item />", () => {
    before(() => {
        window.FRONTEND_API_HOST = "http://localhost:8080";
    });

    it("renders modality and slice count correctly", () => {
        cy.intercept("/clinical-review/dicom?key=CT000000.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct");

        const propsData = {
            series: {
                series_uid: "5910155b-3c21-4438-b00a-27754596dd28",
                modality: "CT",
                files: ["CT000000.dcm"],
            },
        };

        cy.mount(SeriesItem, { propsData });
        cy.wait("@ct");

        cy.dataCy("series-title").should("contain.text", "CT (1)");
    });
});
