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

import TaskList from "./task-list.vue";

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
            patient_sex: "M",
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

describe("<Tasks />", () => {
    it("renders tasks along with the page with search and radio buttons visible ", () => {
        cy.intercept(
            "/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            {
                data: [task],
            },
        );

        cy.mount(TaskList);

        cy.dataCy("no-tasks-message").should("not.be.visible");
        cy.dataCy("radio-buttons").should("be.visible");
        cy.dataCy("worklist-search").should("be.visible");
        cy.dataCy("pagination").should("be.visible");
    });

    it("renders no tasks along with the page with search and radio buttons visible ", () => {
        cy.intercept(
            "/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            {
                data: [],
            },
        );

        cy.mount(TaskList);

        cy.dataCy("no-tasks-message").should("be.visible");
        cy.dataCy("radio-buttons").should("be.visible");
        cy.dataCy("worklist-search").should("be.visible");
        cy.dataCy("pagination").should("be.visible");
    });
});
