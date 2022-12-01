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

import MetadataList from "./metadata-list.vue";

describe("<metadata-list />", () => {
    it("renders metadata", () => {
        cy.intercept("/clinical-review/dicom?key=some-sample-file", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("dicomFile");
        const propsData = {
            showMetadata: true,
            currentImageIndex: 0,
            imageSlices: ["some-sample-file"],
        };

        cy.mount(MetadataList, { propsData });
        cy.wait("@dicomFile");
        cy.dataCy("metadata-list").should("be.visible");
        cy.dataCy("metadata-item").should("have.length.above", 1);
    });

    it("panel hidden when showMetadata is false", () => {
        cy.intercept("/clinical-review/dicom?key=some-sample-file", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("dicomFile");
        const propsData = {
            showMetadata: false,
            currentImageIndex: 0,
            imageSlices: ["some-sample-file"],
        };

        cy.mount(MetadataList, { propsData });
        cy.wait("@dicomFile");
        cy.dataCy("metadata-list").should("not.be.visible");
        cy.dataCy("metadata-item").should("have.length.above", 1);
    });

    it("adds metadata item to pinned area", () => {
        cy.intercept("/clinical-review/dicom?key=some-sample-file", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("dicomFile");
        const propsData = {
            showMetadata: true,
            currentImageIndex: 0,
            imageSlices: ["some-sample-file"],
        };

        cy.mount(MetadataList, { propsData });
        cy.wait("@dicomFile");

        cy.dataCy("metadata-list").should("be.visible");
        cy.dataCy("metadata-item").should("have.length.above", 1);
        cy.dataCy("metadata-item").within(() => {
            cy.dataCy("pin-metadata").eq(0).click();
        });
        cy.dataCy("metadata-list-pinned").within(() => {
            cy.dataCy("metadata-item").should("have.length", 1);
        });
    });
});
