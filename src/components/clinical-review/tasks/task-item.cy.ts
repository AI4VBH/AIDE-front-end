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

import { formatDateTime } from "@/utils/date-utilities";
import TaskItem from "./task-item.vue";

const task = {
    _id: "678",
    clinical_review_message: {
        task_id: "",
        reviewed_task_id: "cde",
        execution_id: "677",
        reviewed_execution_id: "abc",
        correlation_id: "123",
        workflow_name: "bobwf",
        patient_metadata: {
            patient_name: "Joe Bloggs",
            patient_id: "1299-123-232-3422",
            patient_gender: "M",
            patient_dob: "10-10-2000",
        },
        files: [],
        reviewer_roles: ["admin", "clinician"],
        application_metadata: {
            application_name: "stroke model",
            application_version: "1.1",
            mode: "CU",
        },
    },
    reviewed: false,
    received: "2022-11-11T11:11:11",
};

describe("<task-item />", () => {
    it("renders task item with data", () => {
        const { clinical_review_message } = task;

        cy.mount(TaskItem, {
            propsData: {
                patient: clinical_review_message.patient_metadata,
                application: clinical_review_message.application_metadata,
                received: task.received,
            },
        });

        cy.get("[data-cy=patient-name]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_name,
        );
        cy.get("[data-cy=patient-id]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_id,
        );
        cy.get("[data-cy=patient-dob]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_dob,
        );
        cy.get("[data-cy=patient-sex]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_gender,
        );
        cy.get("[data-cy=application]").should(
            "contain.text",
            task.clinical_review_message.application_metadata.application_name,
            task.clinical_review_message.application_metadata.application_version,
        );
        cy.get("[data-cy=mode]").should(
            "contain.text",
            task.clinical_review_message.application_metadata.mode,
        );
        cy.get("[data-cy=received]").should("contain.text", formatDateTime(task.received));
    });
});
