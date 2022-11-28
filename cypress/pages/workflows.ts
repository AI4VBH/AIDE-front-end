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

import ApiMocks from "fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { WorkflowData } from "data/workflows/workflows";
import { WorkflowExampleData } from "data/workflows/workflowJson";

const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";
const errorOne =
    "Failed to validate workflow: 'router_1kjgdksgdkasgdkhasgdkhasgdhasgdjhs' is not a valid Workflow Name (source: Workflow).";
const errorTwo = "Found Task(s) without any task destinations to it: export-task-mr";
const errorThree = "Task: argo-task-mr has task destination: export-task that could not be found.";
const ErrorFour = "ERROR: Task destination export-task not found.";

export default class Workflows extends AbstractPage {
    public initPage() {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("workflows");
        cy.visit("/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageError(statuscode: number) {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", { statusCode: statuscode }).as(
            "workflows",
        );
        cy.visit("/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestWorkflows() {
        cy.intercept("GET", `/workflows?pageNumber=2&pageSize=10`, ApiMocks.WORKFLOWS).as(
            "nextPage",
        );
        this.clickGet(nextPage);
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertCorrectDeleteRequest(workflow: WorkflowData) {
        cy.intercept("DELETE", `/workflows/${workflow.data[0].workflow_id}`, ApiMocks.WORKFLOWS).as(
            "Delete",
        );
        cy.intercept("GET", "/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("Get");
        this.clickDataCy("workflow-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public errorDeleteWorkflow(workflow: WorkflowData, statusCode: number) {
        cy.intercept("DELETE", `/workflows/${workflow.data[0].workflow_id}`, {
            statusCode: statusCode,
        }).as("Delete");
        cy.intercept("GET", "/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("Get");
        this.clickDataCy("workflow-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete"]);
    }

    public assertTableDataCorrect(workflow: WorkflowData) {
        [0, 1, 2, 3, 4, 5].forEach((row) => {
            cy.dataCy(`workflow-table-row-name-${row}`).should(`contain`, workflow.data[row].name);
            cy.dataCy(`workflow-table-row-aetitle-${row}`).should(
                `contain`,
                workflow.data[row].ae_title,
            );
            workflow.data[row].data_origins.forEach((data_origin) => {
                cy.dataCy(`workflow-table-row-data-${row}`).should(`contain`, data_origin);
            });
            cy.dataCy(`workflow-table-row-version-${row}`).should(
                `contain`,
                workflow.data[row].version,
            );
            cy.dataCy(`workflow-table-row-description-${row}`).should(
                `contain`,
                workflow.data[row].description,
            );
        });
    }

    public clickDeleteButtonWorkflows(index: number) {
        cy.dataCy(`workflow-table-row-actions-${index}`).within(() => {
            cy.dataCy("workflow-delete").click();
        });
    }

    public assertEditUrl(workflow: WorkflowData) {
        cy.url().should("include", `workflow-editor/${workflow.data[0].workflow_id}`);
    }

    public assertAddUrl() {
        cy.url().should("include", `workflow-editor`);
    }

    public assertJsonError() {
        cy.get(".cm-content").clear().type("{ {");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("[]").type("{backspace}");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("{").type("{rightArrow}").type("{");
        cy.get(".jse-message").should("be.visible");
    }

    public clearJson() {
        cy.get(".cm-content").clear();
    }

    public assertSaveStatus(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("save-workflow-changes").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("save-workflow-changes").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public workflowEditRequest() {
        cy.intercept(`/workflows/12345-abcde`, ApiMocks.WORKFLOW_EMPTY).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowEditRequestError(statusCode) {
        cy.intercept(`/workflows/12345-abcde`, { statusCode: statusCode }).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowEditRequestEmpty() {
        cy.intercept(`/workflows/12345-abcde`, ApiMocks.WORKFLOW_EMPTY).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowDisplayedCorrectly() {
        cy.wait(500);
        cy.get(".cm-content").should("contain", "router_1");
    }

    public editWorkflow() {
        cy.get(".cm-content").clear().wait(500).type("{{}}").wait(500);
    }

    public assertPost() {
        cy.intercept("POST", `/workflows`, { statusCode: 200 }).as("post");
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnErrorPost(statusCode: number) {
        cy.intercept("POST", `/workflows`, { statusCode: statusCode }).as("post");
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnEditError() {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: 400,
            body: ApiMocks.WORKFLOW_ERRORS,
        }).as("error");
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@error"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnEditToastError(workflow: WorkflowExampleData, statusCode: number) {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: statusCode,
        }).as("error");
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@error"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnAddError() {
        cy.intercept("POST", `/workflows`, { statusCode: 400, body: ApiMocks.WORKFLOW_ERRORS }).as(
            "post",
        );
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorsDisplayed() {
        cy.dataCy("error-container").should("contain", errorOne);
        cy.dataCy("error-container").should("contain", errorTwo);
        cy.dataCy("error-container").should("contain", errorThree);
        cy.dataCy("error-container").should("contain", ErrorFour);
    }

    public returnSuccess() {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: 200,
        }).as("success");
        this.clickDataCy("workflow-edit-confirm-continue");
        cy.wait(["@success"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertWorkflowsUrl() {
        cy.url().should("eql", "http://localhost:8080/workflows");
    }

    public assertNoText() {
        cy.get(".cm-content").should("contain", "{}");
    }
}
