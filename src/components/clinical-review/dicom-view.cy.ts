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

import DicomView from "./dicom-view.vue";

describe("<dicom-view />", () => {
    before(() => {
        window.FRONTEND_API_HOST = "http://localhost:8080";
    });

    beforeEach(() => {
        cy.intercept("http://localhost:8080/clinical-review/*", { middleware: true }, (req) => {
            req.on("before:response", (res) => {
                // force all API responses to not be cached
                res.headers["cache-control"] = "no-store";
            });
        });
    });

    it("renders the dicom viewer correctly", () => {
        cy.intercept("/clinical-review/5da2469c-df16-451a-a6f2-be94edc5a703", {
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
            ],
        });

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

        cy.mount(DicomView, {
            propsData: {
                taskExecutionId: "5da2469c-df16-451a-a6f2-be94edc5a703",
            },
        });

        cy.wait("@ct");
        cy.wait("@doc");

        cy.dataCy("series-list").should("be.visible");
        cy.dataCy("metadata-list").should("be.visible");
        cy.dataCy("dicom-tools").should("be.visible");
        cy.dataCy("dicom-footer").should("be.visible");

        // toggle PDF view
        cy.dataCy("series-item").eq(1).click();
        cy.get(".large-pdf-viewer").should("be.visible");
        cy.dataCy("dicom-tools").should("not.be.visible");
        cy.dataCy("dicom-footer").should("not.be.visible");
        cy.dataCy("series-item").eq(0).click();

        // toggle series panel
        cy.dataCy("series-list").should("be.visible");
        cy.dataCy("dicom-tool-toggle-series").click();
        cy.dataCy("series-list").should("not.be.visible");

        // toggle metadata panel
        cy.dataCy("metadata-list").should("be.visible");
        cy.dataCy("dicom-tool-toggle-metadata").click();
        cy.dataCy("metadata-list").should("not.be.visible");
    });
});
