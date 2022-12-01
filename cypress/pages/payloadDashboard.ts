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

import ApiMocks from "../fixtures/mockIndex";
import {
    IPagedResponse,
    IPayload,
    TaskExecution,
    WorkflowInstance,
} from "../../src/models/Admin/IPayload";
import { formatDateAndTimeOfString } from "../../src/utils/date-utilities";
import { formatDateAndTimeOfArray } from "../../src/utils/date-utilities";
import { AbstractPage } from "./abstractPage";

export default class AdminPayloadDashboardPage extends AbstractPage {
    static succeeded = "tree-node d-flex flex-column Succeeded";
    static failed = "tree-node d-flex flex-column Failed";
    static dispatched = "tree-node d-flex flex-column Dispatched";

    public assertCorrectTaskReturned(payload: IPagedResponse<IPayload>): void {
        cy.dataCy("patient-name-payload-0").should(`contain`, payload.data[0].patient_name);
        cy.dataCy("patient-id-payload-0").should(`contain`, payload.data[0].patient_id);
    }

    public selectRadioButton(radioButton: string) {
        cy.dataCy(radioButton).click({ force: true });
    }

    public searchPayloadsTable(text: string): void {
        cy.intercept(
            `/payloads?pageNumber=1&pageSize=10&patientId=${text}&patientName=`,
            ApiMocks.PAYLOAD_SEARCH,
        );
        cy.intercept(
            `/payloads?pageNumber=1&pageSize=10&patientId=&patientName=${text}`,
            ApiMocks.PAYLOAD_SEARCH,
        );
        cy.dataCy("search-payloads-table").clear().type(text);
        cy.intercept(`/executions/*/tasks/*/artifacts`, {});
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public expandAndViewTree(payload: IPagedResponse<IPayload>): void {
        const payload_id = payload.data[0].payload_id;
        cy.intercept(
            `/payloads/${payload_id}/executions`,
            ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS,
        ).as(`executions`);
        cy.get("tbody > :nth-child(1) > :nth-child(5) > .v-icon").click({ force: true });
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPagePayload() {
        cy.intercept(
            `/payloads?pageNumber=1&pageSize=10&patientId=&patientName=`,
            ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE,
        ).as(`payloadTable`);
        cy.visit(`/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertPopoverStatusColour(treedata: WorkflowInstance) {
        treedata.tasks.forEach((tasks: TaskExecution) => {
            switch (tasks.status) {
                case "Succeeded":
                    cy.dataCy("selected-node-status").should(
                        `have.css`,
                        `background-color`,
                        `rgb(220, 237, 200)`,
                    );
                    break;
                case "Failed":
                    cy.dataCy("selected-node-status").should(
                        `have.css`,
                        `background-color`,
                        `rgb(255, 205, 210)`,
                    );
                    break;
                case "Dispatched":
                    cy.dataCy("selected-node-status").should(
                        `have.css`,
                        `background-color`,
                        `rgb(255, 224, 178)`,
                    );
                    break;
                default:
                    throw "This scenario has not been implemented. Please review";
            }
        });
    }

    public assertPopoverStatus(treedata: WorkflowInstance) {
        treedata.tasks.forEach((tasks: TaskExecution) => {
            switch (tasks.status) {
                case "Succeeded":
                    cy.dataCy("selected-node-status").should("contain", "Succeeded");
                    break;
                case "Failed":
                    cy.dataCy("selected-node-status").should("contain", "Failed");
                    break;
                case "Dispatched":
                    cy.dataCy("selected-node-status").should("contain", "Dispatched");
                    break;
                default:
                    throw "This scenario has not been implemented. Please review";
            }
        });
    }

    public assertPayloadNodesColour(treedata: WorkflowInstance): void {
        switch (treedata.status) {
            case "Succeeded":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.css`,
                    `background-color`,
                    `rgb(0, 128, 0)`,
                );
                break;
            case "Failed":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.css`,
                    `background-color`,
                    `rgb(255, 0, 0)`,
                );
                break;
            case "Dispatched":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.css`,
                    `background-color`,
                    `rgb(255, 165, 0)`,
                );
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
        treedata.tasks.forEach((tasks: TaskExecution) => {
            switch (tasks.status) {
                case "Succeeded":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.css`,
                        `background-color`,
                        `rgb(0, 128, 0)`,
                    );
                    break;
                case "Failed":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.css`,
                        `background-color`,
                        `rgb(255, 0, 0)`,
                    );
                    break;
                case "Dispatched":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.css`,
                        `background-color`,
                        `rgb(255, 165, 0)`,
                    );
                    break;
                default:
                    throw "This scenario has not been implemented. Please review";
            }
        });
    }

    public assertPayloadNodesStatus(treedata: WorkflowInstance) {
        switch (treedata.status) {
            case "Succeeded":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.class`,
                    AdminPayloadDashboardPage.succeeded,
                );
                break;
            case "Failed":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.class`,
                    AdminPayloadDashboardPage.succeeded,
                );
                break;
            case "Dispatched":
                cy.dataCy(`node-${treedata.workflow_name}`).should(
                    `have.class`,
                    AdminPayloadDashboardPage.dispatched,
                );
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
        treedata.tasks.forEach((tasks: TaskExecution) => {
            switch (tasks.status) {
                case "Succeeded":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.class`,
                        AdminPayloadDashboardPage.succeeded,
                    );
                    break;
                case "Failed":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.class`,
                        AdminPayloadDashboardPage.failed,
                    );
                    break;
                case "Dispatched":
                    cy.dataCy(`node-${tasks.task_id}`).should(
                        `have.class`,
                        AdminPayloadDashboardPage.dispatched,
                    );
                    break;
                default:
                    throw "This scenario has not been implemented. Please review";
            }
        });
    }

    public assertPayloadNames(treedata: WorkflowInstance) {
        cy.dataCy(`node-name-${treedata.workflow_name}`).should(`contain`, treedata.workflow_name);
        treedata.tasks.forEach((tasks: TaskExecution) => {
            cy.dataCy(`node-name-${tasks.task_id}`).should(`contain`, tasks.task_id);
        });
    }

    public assertPayloadDateTime(treedata: WorkflowInstance) {
        const dateTimeWorkflow = formatDateAndTimeOfString(treedata.start_time);
        cy.dataCy(`node-date-${treedata.workflow_name}`).should(`contain`, dateTimeWorkflow);
        treedata.tasks.forEach((tasks: TaskExecution) => {
            const dateTimeWorkflow = formatDateAndTimeOfString(tasks.task_start_time);
            cy.dataCy(`node-date-${tasks.task_id}`).should(`contain`, dateTimeWorkflow);
        });
    }

    public assertPopoverDataCorrect(treedata: WorkflowInstance) {
        this.clickTaskNodes(treedata);
        this.assertPopoverStatus(treedata);
        this.assertPopoverStatusColour(treedata);
        treedata.tasks.forEach((tasks: TaskExecution) => {
            const dateTimeWorkflow = formatDateAndTimeOfString(tasks.task_start_time);
            cy.dataCy("selected-node-name").should(`contain`, tasks.task_id);
            cy.dataCy("selected-node-started").should(`contain`, dateTimeWorkflow);
        });
    }

    public clickTaskNodes(treedata: WorkflowInstance) {
        treedata.tasks.forEach((tasks: TaskExecution) => {
            cy.dataCy(`node-${tasks.task_id}`).click({ force: true });
        });
    }

    public assertPopoverMetadataDisplayed(treedata: WorkflowInstance): void {
        this.clickTaskNodes(treedata);
        treedata.tasks.forEach((tasks: TaskExecution) => {
            cy.intercept(
                `executions/${tasks.workflow_instance_id}/tasks/${tasks.execution_id}/metadata`,
                ApiMocks.PAYLOAD_METADATA,
            ).as(`Logs`);
            cy.dataCy(`view-node-metadata`).click({ force: true });
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
            this.assertPopoverModalText(ApiMocks.PAYLOAD_METADATA.IdentityKey);
            this.assertPopoverModalText(ApiMocks.PAYLOAD_METADATA.workflowInstanceId);
            this.assertPopoverModalText(ApiMocks.PAYLOAD_METADATA.duration);
            this.assertPopoverModalText(ApiMocks.PAYLOAD_METADATA.startedAt);
            cy.get(".my-2").click();
        });
    }

    public assertPopoverModalText(text: string): void {
        cy.dataCy("logs").should("contain.text", text);
    }

    public assertPopoverLogsDisplayed(treedata: WorkflowInstance): void {
        this.clickTaskNodes(treedata);
        treedata.tasks.forEach((tasks: TaskExecution) => {
            cy.intercept(`/logs/${tasks.execution_id}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(
                `Logs`,
            );
            cy.dataCy(`view-node-logs`).click({ force: true });
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
            this.assertPopoverModalText(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
            this.assertPopoverModalText(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].execution_id);
            this.assertPopoverModalText(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].written_at);
        });
    }

    public assertPayloadTreeDataCorrect(treedata: WorkflowInstance) {
        this.assertPayloadNames(treedata);
        this.assertPayloadDateTime(treedata);
        this.assertPayloadNodesStatus(treedata);
        this.assertPayloadNodesColour(treedata);
    }

    public assertTableDataCorrect(payload: IPagedResponse<IPayload>): void {
        payload.data.forEach((row: IPayload, index: number) => {
            formatDateAndTimeOfArray(payload.data, "payload_received");
            cy.dataCy(`patient-name-payload-${index}`).should(`contain`, row.patient_name);
            cy.dataCy(`patient-id-payload-${index}`).should(`contain`, row.patient_id);
            cy.dataCy(`payload-id-${index}`).should(`contain`, row.payload_id);
            cy.dataCy(`payload-received-${index}`).should(`contain`, row.payload_received);
        });
    }

    public clickZoomIn(): void {
        cy.dataCy("zoom-in").click().click().click();
    }

    public clickZoomOut(): void {
        cy.dataCy("zoom-out").click().click().click();
    }

    public clickReset(): void {
        cy.dataCy("reset").click();
    }

    public async initPagePayloadApiError(error: number) {
        cy.intercept(`/payloads?pageNumber=1&pageSize=10&patientId=&patientName=`, {
            statusCode: error,
        }).as(`payloadTable`);
        cy.visit(`/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public initPagePayloadTreeApiError(error: number, payload: IPagedResponse<IPayload>): void {
        const payload_id = payload.data[0].payload_id;
        cy.intercept(`/payloads/${payload_id}/executions`, {
            statusCode: error,
        }).as(`executions`);
        cy.get(`tbody > :nth-child(${payload_id}) > :nth-child(1)`).click();
        cy.wait([`@executions`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }
}
