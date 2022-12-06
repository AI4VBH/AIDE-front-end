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

import { PatientMetadata } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDate, formatDateTime } from "@/utils/date-utilities";
import PatientHeader from "./patient-header.vue";

describe("<patient-header />", () => {
    it("renders patient information", () => {
        const patientMetadata: PatientMetadata = {
            patient_name: "Joe Bloggs",
            patient_age: "20",
            patient_dob: "2002-01-01",
            patient_id: "some-patient-id",
            patient_gender: "M",
        };

        const propsData = {
            patientMetadata,
            studyDate: "2022-11-11T11:11:11",
        };

        cy.mount(PatientHeader, { propsData });

        cy.dataCy("patient-name").should("contain.text", patientMetadata.patient_name);
        cy.dataCy("patient-age").should("contain.text", patientMetadata.patient_age);
        cy.dataCy("patient-dob").should("contain.text", formatDate(patientMetadata.patient_dob));
        cy.dataCy("patient-id").should("contain.text", patientMetadata.patient_id);
        cy.dataCy("patient-sex").should("contain.text", patientMetadata.patient_gender);
        cy.dataCy("study-date").should("contain.text", formatDateTime(propsData.studyDate));

        cy.dataCy("accept-task").should("be.enabled");
        cy.dataCy("reject-task").should("be.enabled");
    });

    it("disables action buttons when study date is not present", () => {
        const patientMetadata: PatientMetadata = {
            patient_name: "Joe Bloggs",
            patient_age: "20",
            patient_dob: "2002-01-01",
            patient_id: "some-patient-id",
            patient_gender: "M",
        };

        const propsData = {
            patientMetadata,
            studyDate: "",
        };

        cy.mount(PatientHeader, { propsData });

        cy.dataCy("patient-name").should("contain.text", patientMetadata.patient_name);
        cy.dataCy("patient-age").should("contain.text", patientMetadata.patient_age);
        cy.dataCy("patient-dob").should("contain.text", formatDate(patientMetadata.patient_dob));
        cy.dataCy("patient-id").should("contain.text", patientMetadata.patient_id);
        cy.dataCy("patient-sex").should("contain.text", patientMetadata.patient_gender);

        cy.dataCy("accept-task").should("not.be.enabled");
        cy.dataCy("reject-task").should("not.be.enabled");
    });
});
