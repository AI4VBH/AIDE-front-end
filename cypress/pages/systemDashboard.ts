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
import { IOverview } from "../../src/models/Admin/IOverview";
import { IIssue } from "../../src/models/Admin/IIssue";
import { IModelDetails, IModelSummary } from "../../src/models/Admin/IModel";
import { ExecStatistics } from "data/system-dashboard/statistics";
import { ModelDetailsData } from "../data/system-dashboard/graph";
import moment from "moment";
import { NhsDateTimeFormat } from "../../src/utils/date-utilities";
import { IPagedResponse, IPayload, WorkflowInstance } from "../../src/models/Admin/IPayload";

export default class AdminSystemDashboardPage {
    //OVERVIEW
    static MODEL_FAILURES = `model-failures`;
    static MODEL_EXECUTIONS = `model-failures-executions`;
    static MODEL_EXECUTIONS2 = `model-executions`;
    static MODEL_NUMBERS = `model-numbers`;
    static FAILURES_HIGHLIGHT = `model-failures-card`;
    //ISSUES TABLE
    static TASK_ID = `task-id`;
    static STATUS = `status`;
    static MODEL_NAME = `model-name`;
    static PATIENT_NAME = `patient-name`;
    static PATIENT_ID = `patient-id`;
    static EXECUTION_DATE_TIME = `execution-date-time`;
    static VIEW_LOGS_BUTTON = `view-logs-button`;
    static LOG = "logs";
    static DISMISS_BUTTON = `dismiss-button`;
    static DISMISS_SELECTED = `dismiss-selected`;
    static TASK = `task`;
    static SELECT_ALL = `[aria-label=""] > .v-data-table__checkbox > .v-input--selection-controls__input > .v-input--selection-controls__ripple`;
    static CHECKBOX = `checkbox`;
    static VALIDATION_OK = `validation-continue`;
    static VALIDATION_CANCEL = `validation-cancel`;
    static SEARCH_ISSUES_TABLE = `search-issues-table`;
    //GRAPH
    static DROPDOWN = `dropdown`;
    static DROPDOWN_MODELS = `#list-108`;
    static PROGRESS = `progress`;
    static START_DATE = `start-date`;
    static START_DATE_TEXT = `start-date-text`;
    static END_DATE = `end-date`;
    static END_DATE_TEXT = `end-date-text`;
    static STATUS2 = `status2`;
    static FAILURE_RATE = `failure-rate`;
    static EXECUTIONS = `executions`;
    static FAILURES = `failures`;

    public assertTableDataCorrect(task: IIssue): void {
        this.getTask(task.task_id).within(() => {
            const dateTime = this.formatTaskDate(task.execution_time, false);
            cy.dataCy(AdminSystemDashboardPage.TASK_ID).should(`contain`, task.task_id);
            cy.dataCy(AdminSystemDashboardPage.PATIENT_NAME).should(`contain`, task.patient_name);
            cy.dataCy(AdminSystemDashboardPage.PATIENT_ID).should(`contain`, task.patient_id);
            cy.dataCy(AdminSystemDashboardPage.EXECUTION_DATE_TIME).should(`contain`, dateTime);
            switch (task.failure_reason) {
                case "Rejected":
                    cy.dataCy(AdminSystemDashboardPage.STATUS).should(
                        `contain`,
                        task.failure_reason,
                    );
                    cy.dataCy("view-logs-button").should(`contain`, "View rejection");
                    break;
                default:
                    cy.dataCy(AdminSystemDashboardPage.STATUS).should(`contain`, task.status);
                    cy.dataCy("view-logs-button").should(`contain`, "View logs");
            }
        });
    }

    public assertTakenToCorrectTask(task: IIssue, node: WorkflowInstance, array: number) {
        this.getTask(task.task_id).within(() => {
            cy.intercept(
                `/payloads?pageNumber=1&pageSize=10&patientId=&patientName=`,
                ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE,
            ).as(`payloadTable`);
            cy.intercept(
                `/payloads/${task.payload_id}/executions`,
                ApiMocks.PAYLOAD_TASK_REDIRECT,
            ).as(`executions`);
            cy.intercept(
                `executions/${node.tasks[array].workflow_instance_id}/tasks/${task.execution_id}/artifacts`,
                ApiMocks.PAYLOAD_TASK_REDIRECT,
            ).as(`node`);
            cy.dataCy("view-logs-button").click();
            cy.wait([`@payloadTable`, `@executions`, `@node`]);
            cy.url().should(
                "eq",
                `http://localhost:8080/admin-payload-dashboard?payload_id=${task.payload_id}&execution_id=${task.execution_id}`,
            );
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
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

    public formatTaskDate(dateStr: string, inludeFromNow = true) {
        const dateMoment = moment(dateStr);
        return inludeFromNow
            ? `${dateMoment.format(NhsDateTimeFormat)} (${dateMoment.fromNow()})`
            : `${dateMoment.format(NhsDateTimeFormat)}`;
    }

    public assertLogsDisplayed(task: IIssue): void {
        cy.intercept(`/logs/4543531`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(`Logs`);
        this.getTask(task.task_id).within(() => {
            cy.dataCy(AdminSystemDashboardPage.VIEW_LOGS_BUTTON).click();
            cy.wait([`@Logs`]);
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
        });
        this.assertExecutionLogs(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
    }
    public assertExecutionLogs(text: string): void {
        cy.dataCy(AdminSystemDashboardPage.LOG).should("contain.text", text);
    }

    public assertTaskCanBeDismissed(task: IIssue): void {
        cy.get(`tbody > :nth-child(${task.task_id})`).within(() => {
            cy.dataCy(AdminSystemDashboardPage.DISMISS_BUTTON).click();
        });
        cy.intercept(`/workflowinstances/345435/executions/4543531/acknowledge`, {
            statusCode: 200,
        }).as(`AcknowledgedIssues`);
        cy.intercept(`/issues/failed`, {
            body: ApiMocks.ADMIN_DASHBOARD_ISSUES_DISMISS,
        }).as(`FailedIssues`);
        cy.dataCy(AdminSystemDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
        cy.wait(`@AcknowledgedIssues`);
        cy.wait(`@FailedIssues`);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
        cy.dataCy(AdminSystemDashboardPage.TASK_ID)
            .contains(` ${task.task_id} `)
            .should(`not.exist`);
    }

    public assertDismisalOfTaskFailure(task: IIssue): void {
        cy.get(`tbody > :nth-child(${task.task_id})`).within(() => {
            cy.dataCy(AdminSystemDashboardPage.DISMISS_BUTTON).click();
        });
        cy.intercept(`/workflowinstances/345435/executions/4543531/acknowledge`, {
            statusCode: 400,
        }).as(`FailedDismiss`);
        cy.dataCy(AdminSystemDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
        cy.wait(`@FailedDismiss`);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
        cy.dataCy(AdminSystemDashboardPage.TASK_ID).contains(` ${task.task_id} `).should(`exist`);
    }

    public assertOverviewModelDataCorrect(executionStatistics: IOverview): void {
        cy.dataCy(AdminSystemDashboardPage.MODEL_NUMBERS).should(
            `contain`,
            executionStatistics.deployed_models,
        );
        cy.dataCy(AdminSystemDashboardPage.MODEL_EXECUTIONS).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminSystemDashboardPage.MODEL_EXECUTIONS2).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminSystemDashboardPage.MODEL_FAILURES).should(
            `contain`,
            executionStatistics.model_failures,
        );
    }

    public assertCorrectHighlightAroundTile(executionStatistics: ExecStatistics): void {
        if (executionStatistics.model_failures >= 1) {
            cy.dataCy(AdminSystemDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(211, 47, 47)`);
        } else {
            cy.dataCy(AdminSystemDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(255, 255, 255)`);
        }
    }

    public selectAllIssues(): void {
        cy.get(AdminSystemDashboardPage.SELECT_ALL).click();
    }

    public selectDismissSelectedButton(): void {
        cy.dataCy(AdminSystemDashboardPage.DISMISS_SELECTED).click();
    }

    public AssertDismissButtonUnclickable(): void {
        cy.dataCy(AdminSystemDashboardPage.DISMISS_SELECTED).should(`be.disabled`);
    }

    public getTask(taskId: string): Cypress.Chainable<JQuery> {
        return cy.get(`tbody > :nth-child(${taskId})`);
    }

    public unselectAllIssues(): void {
        cy.get(AdminSystemDashboardPage.SELECT_ALL).click();
    }

    public assertCheckboxesSelected(): void {
        cy.get(`.v-data-table__selected`).should(`exist`);
    }

    public assertCheckboxesUnselected(): void {
        cy.get(`.v-data-table__selected`).should(`not.exist`);
    }

    public assertNoIssues(): void {
        cy.dataCy(AdminSystemDashboardPage.TASK_ID).should(`not.exist`);
    }

    public selectOKValidation(): void {
        cy.intercept(`/workflowinstances/*/executions/*/acknowledge`, {
            statusCode: 200,
        }).as(`AcknowledgedIssues`);
        cy.intercept(`/issues/failed`, {
            body: [],
        }).as(`EmptyIssues`);
        cy.dataCy(AdminSystemDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
        cy.wait(`@AcknowledgedIssues`);
        cy.wait(`@EmptyIssues`);
    }

    public selectCancelValidation(): void {
        cy.dataCy(AdminSystemDashboardPage.VALIDATION_CANCEL).click({
            multiple: true,
            force: true,
        });
    }

    public searchIssuesTable(text: string): void {
        if (text !== ``) {
            cy.dataCy(AdminSystemDashboardPage.SEARCH_ISSUES_TABLE).clear().type(text);
        } else {
            cy.dataCy(AdminSystemDashboardPage.SEARCH_ISSUES_TABLE).clear();
        }
    }

    public assertCorrectTaskReturned(task: IIssue): void {
        cy.dataCy(AdminSystemDashboardPage.TASK)
            .should(`contain`, task.task_id)
            .should(`contain`, task.patient_name);
    }

    public assertModelsVisible(modelData: IModelSummary): void {
        cy.dataCy(AdminSystemDashboardPage.DROPDOWN).click();
        cy.wait(250);
        cy.get(`.model-names .v-list-item__content > .v-list-item__title`).should(
            `contain`,
            modelData.model_name,
        );
    }

    public assertModelDataDisplayed(modelDetails: IModelDetails, model_array_order: number): void {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(
            `/graph/${modelDetails.model_id}?start_date=${startDate}&end_date=${endDate}`,
            modelDetails,
        ).as(`FirstModel`);
        cy.dataCy(AdminSystemDashboardPage.DROPDOWN).click();
        cy.wait(500);
        cy.get(".model-names .v-list-item__content").eq(model_array_order).click();
        cy.dataCy(AdminSystemDashboardPage.STATUS2).should(`contain`, modelDetails.status);
        cy.dataCy(AdminSystemDashboardPage.EXECUTIONS).should(
            `contain`,
            modelDetails.total_executions,
        );
        cy.dataCy(AdminSystemDashboardPage.FAILURES).should(`contain`, modelDetails.total_failures);
        cy.dataCy(AdminSystemDashboardPage.FAILURE_RATE).should(
            `contain`,
            this.calculateFailureRate(modelDetails),
        );
    }

    calculateFailureRate(modelDetails: IModelDetails): number {
        const totalFailures = modelDetails.total_failures;
        const totalExecutions = modelDetails.total_executions;

        const failureRate = Number(((totalFailures / totalExecutions) * 100).toFixed(2));
        return failureRate;
    }

    public formatDate(date: Date) {
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        const year = date.getFullYear();
        return year + "-" + month + "-" + day;
    }

    public assertLatestErrorContainsMessage(text: string): void {
        cy.get("[class=v-toast__text]").should("have.text", text);
    }

    public async initPage() {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(
            `Model stats`,
        );
        cy.intercept(`/issues/failed`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Issues`);
        cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as("Models");
        cy.intercept(
            `/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`,
            ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY,
        ).as(`FirstModel`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Issues`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageOverviewApiErrors(error: number) {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/overview?period=day`, { statusCode: error }).as(`Model stats`);
        cy.intercept(`/issues/failed`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Issues`);
        cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as("Models");
        cy.intercept(
            `/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`,
            ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY,
        ).as(`FirstModel`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Model stats`, `@Issues`, `@Models`, `@FirstModel`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageIssuesApiErrors(error: number) {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(
            `Model stats`,
        );
        cy.intercept(`/issues/failed`, { statusCode: error }).as(`Issues`);
        cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as("Models");
        cy.intercept(
            `/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`,
            ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY,
        ).as(`FirstModel`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Issues`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageModelsApiErrors(error: number) {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(
            `Model stats`,
        );
        cy.intercept(`/issues/failed`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Issues`);
        cy.intercept(`/models`, { statusCode: error }).as("Models");
        cy.intercept(
            `/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`,
            ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY,
        ).as(`FirstModel`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Issues`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageModelStatisticsApiErrors(error: number) {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(
            `Model stats`,
        );
        cy.intercept(`/issues/failed`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Issues`);
        cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as("Models");
        cy.intercept(
            `/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`,
            { statusCode: error },
        ).as(`FirstModel`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Issues`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageWithNoFailedModels() {
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS).as(
            `No models fail`,
        );
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@No models fail`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPageSingleTask() {
        cy.intercept(`/overview?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(
            `Model stats`,
        );
        cy.intercept(`/issues/failed`, ApiMocks.ADMIN_DASHBOARD_SINGLE_TASK).as(`Task`);
        cy.visit(`/admin-system-dashboard`);
        cy.wait([`@Model stats`, `@Task`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }
}
