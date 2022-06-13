import ApiMocks from "../fixtures/mockIndex";
// import { AbstractPage } from "./abstractPage";
import { IExecutionStatistics } from "../../src/models/AdminStatistics/IExecutionStatistics";
import { IIssue } from "../../src/models/AdminStatistics/IIssue";
import { ILog } from "../../src/models/AdminStatistics/ILogs";
import {
    IModelDetails,
    IModelStatistics,
    IModelSummary,
} from "../../src/models/AdminStatistics/IModel";
import { ExecStatistics } from "data/statistics";
import { ModelDetailsData } from "../data/graph";

export default class AdminHealthDashboardPage {
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
    static VALIDATION_OK = `validation-ok`;
    static VALIDATION_CANCEL = `validation-cancel`;
    static SEARCH_ISSUES_TABLE = `search-issues-table`;
    //GRAPH
    static DROPDOWN = `dropdown`;
    static DROPDOWN_MODELS = `#list-108`
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
            const dateTime = this.formatTaskDate(task.execution_time);
            cy.dataCy(AdminHealthDashboardPage.TASK_ID).should(`contain`, task.task_id);
            cy.dataCy(AdminHealthDashboardPage.STATUS).should(`contain`, task.status);
            cy.dataCy(AdminHealthDashboardPage.MODEL_NAME).should(`contain`, task.model_name);
            cy.dataCy(AdminHealthDashboardPage.PATIENT_NAME).should(`contain`, task.patient_name);
            cy.dataCy(AdminHealthDashboardPage.PATIENT_ID).should(`contain`, task.patient_id);
            cy.dataCy(AdminHealthDashboardPage.EXECUTION_DATE_TIME).should(`contain`, dateTime);
        });
    }

    public formatTaskDate(task: string): string {
        const date = task.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(task.split("T")[1].substring(0, 2));
        const suffix: string = hour >= 12 ? "PM" : "AM";
        const formattedHour = (hour % 12 || 12).toString();
        const minutes = task.split("T")[1].substring(4, 2).toString();
        task = date + " " + (Number(formattedHour) < 10 ? "0" + formattedHour : formattedHour) + ":" + minutes + " " + suffix;
        return task;
    }

    public assertLogsDisplayed(task: IIssue, log: ILog): void {
        this.getTask(task.task_id).within(() => {
            cy.intercept(`/api/logs/${task.task_id}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(
                `Logs`,
            );
            cy.dataCy(AdminHealthDashboardPage.VIEW_LOGS_BUTTON).click();
            cy.wait([`@Logs`]);
            Cypress.on(`uncaught:exception`, (err, runnable) => {
                return false;
            });
        });
        this.assertExecutionLogs(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
    }
    public assertExecutionLogs(text: string): void {
        cy.dataCy(AdminHealthDashboardPage.LOG).should("contain.text", text);
    }

    public assertTaskCanBeDismissed(task: IIssue): void {
        cy.get(`tbody > :nth-child(${task.task_id})`).within(() => {
            cy.dataCy(AdminHealthDashboardPage.DISMISS_BUTTON).click();
        });
        cy.dataCy(AdminHealthDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
        cy.dataCy(AdminHealthDashboardPage.TASK_ID).should(`not.exist`);
    }

    public assertOverviewModelDataCorrect(executionStatistics: IExecutionStatistics): void {
        cy.dataCy(AdminHealthDashboardPage.MODEL_NUMBERS).should(
            `contain`,
            executionStatistics.deployed_models,
        );
        cy.dataCy(AdminHealthDashboardPage.MODEL_EXECUTIONS).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminHealthDashboardPage.MODEL_EXECUTIONS2).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminHealthDashboardPage.MODEL_FAILURES).should(
            `contain`,
            executionStatistics.model_failures,
        );
    }

    public assertCorrectHighlightAroundTile(executionStatistics: ExecStatistics): void {
        if (executionStatistics.model_failures >= 1) {
            cy.dataCy(AdminHealthDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(211, 47, 47)`);
        } else {
            cy.dataCy(AdminHealthDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(255, 255, 255)`);
        }
    }

    public selectAllTasks(): void {
        cy.get(AdminHealthDashboardPage.SELECT_ALL).click();
    }

    public selectDismissSelectedButton(): void {
        cy.dataCy(AdminHealthDashboardPage.DISMISS_SELECTED).click();
    }

    public AssertDismissButtonUnclickable(): void {
        cy.dataCy(AdminHealthDashboardPage.DISMISS_SELECTED).should(`be.disabled`);
    }

    public getTask(taskId: number): Cypress.Chainable<JQuery> {
        return cy.get(`tbody > :nth-child(${taskId})`);
    }

    public unselectAllTasks(): void {
        cy.get(AdminHealthDashboardPage.SELECT_ALL).click();
    }

    public assertCheckboxesSelected(): void {
            cy.get(`.v-data-table__selected`).should(`exist`);;
    }

    public assertCheckboxesUnselected(): void {
            cy.get(`.v-data-table__selected`).should(`not.exist`);;
    }

    public assertNoTasks(): void {
        cy.dataCy(AdminHealthDashboardPage.TASK_ID).should(`not.exist`);
    }

    public selectOKValidation(): void {
        cy.dataCy(AdminHealthDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
    }

    public selectCancelValidation(): void {
        cy.dataCy(AdminHealthDashboardPage.VALIDATION_CANCEL).click({ multiple: true, force: true });
    }

    public searchIssuesTable(text: string): void {
        if (text !== ``) {
            cy.dataCy(AdminHealthDashboardPage.SEARCH_ISSUES_TABLE).clear().type(text);
        } else {
            cy.dataCy(AdminHealthDashboardPage.SEARCH_ISSUES_TABLE).clear();
        }
    }

    public assertCorrectTaskReturned(task: IIssue): void {
        cy.dataCy(AdminHealthDashboardPage.TASK)
            .should(`contain`, task.task_id)
            .should(`contain`, task.patient_name);
    }

    public assertModelsVisible(modelData: IModelSummary, model_array_order: number): void {
        cy.dataCy(AdminHealthDashboardPage.DROPDOWN).click();
        cy.wait(250);
        cy.get(`#list-item-131-${model_array_order} > .v-list-item__content > .v-list-item__title`).should(
            `contain`,
            modelData.model_name)
    }

    public assertModelDataDisplayed(modelDetails: IModelDetails, model_array_order: number): void {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/api/graph/${modelDetails.model_id}?start_date=${startDate}&end_date=${endDate}`, modelDetails).as(`FirstModel`);
        cy.dataCy(AdminHealthDashboardPage.DROPDOWN).click();
        cy.wait(500);
        cy.get(`#list-item-131-${model_array_order}`).click();
        cy.dataCy(AdminHealthDashboardPage.STATUS2).should(`contain`, modelDetails.status); //EXECUTIONS FAILURES
        cy.dataCy(AdminHealthDashboardPage.EXECUTIONS).should(`contain`, modelDetails.total_executions);
        cy.dataCy(AdminHealthDashboardPage.FAILURES).should(`contain`, modelDetails.total_failures);
        cy.dataCy(AdminHealthDashboardPage.FAILURE_RATE).should(`contain`, this.calculateFailureRate(modelDetails));
    }

    // public assertDatesCorrect(modelDetails: IModelDetails, model_array_order: number): void {
    //     const startDate = this.formatDate(new Date(Date.now() - 604800000));
    //     const endDate = this.formatDate(new Date());
    //     cy.intercept(`/api/graph/${modelDetails.model_id}?start_date=${startDate}&end_date=${endDate}`, modelDetails).as(`FirstModel`);
    //     cy.dataCy(AdminHealthDashboardPage.DROPDOWN).click();
    //     cy.wait(500);
    //     cy.get(`#list-item-131-${model_array_order}`).click();
    //     cy.contains(endDate).should(`be.visible` )
    // }

    calculateFailureRate(modelDetails: IModelDetails): number {
        let totalFailures = modelDetails.total_failures
        let totalExecutions = modelDetails.total_executions

        let failureRate = Number(((totalFailures / totalExecutions) * 100).toFixed(2));
        return failureRate
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
        cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Tasks`);
        cy.intercept(`/api/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
        cy.intercept(`/api/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`, ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY).as(`FirstModel`)
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`, '@Models', `@FirstModel`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageOverviewApiErrors() {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/api/model-execution-stats?period=day`, { statusCode: 400 }).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Tasks`);
        cy.intercept(`/api/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
        cy.intercept(`/api/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`, ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY).as(`FirstModel`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`, `@Models`, `@FirstModel`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageTasksApiErrors() {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(`Model stats`);
        cy.intercept(`/api/tasks`, { statusCode: 400 }).as(`Tasks`);
        cy.intercept(`/api/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
        cy.intercept(`/api/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`, ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY).as(`FirstModel`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`, `@Models`, `@FirstModel`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageModelsApiErrors() {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Tasks`);
        cy.intercept(`/api/models`, { statusCode: 400 }).as('Models');
        cy.intercept(`/api/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`, ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY).as(`FirstModel`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`, `@Models`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageModelStatisticsApiErrors() {
        const startDate = this.formatDate(new Date(Date.now() - 604800000));
        const endDate = this.formatDate(new Date());
        cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Tasks`);
        cy.intercept(`/api/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
        cy.intercept(`/api/graph/${ModelDetailsData.MODEL_DETAILS_ASDA.model_id}?start_date=${startDate}&end_date=${endDate}`, { statusCode: 400 }).as(`FirstModel`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`, `@Models`, `@FirstModel`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageWithNoFailedModels() {
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS,
        ).as(`No models fail`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@No models fail`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageSingleTask() {
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS,
        ).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_SINGLE_TASK).as(`Task`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Task`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }














// public async initPageWithErrors() {
    //     // cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS)
    //     // .as(`Model stats`);
    //     cy.intercept("/api/model-execution-stats?period=day", { statusCode: 400 }).as("Executions not found");
    //     cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_SINGLE_TASK)
    //     .as(`Task`);
    //     cy.visit(`/#/admin-health-dashboard`);
    //     cy.wait([`@Executions not found`, `@Task`]);
    //     //cy.intercept(`/logs/${taskId}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(`Logs`);
    //     //cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
    //     //cy.intercept(`/graph/${model_id}?start_date=${aWeekAgo}&end_date=${today}`, ApiMocks.ADMIN_DASHBOARD_GRAPH_ONE_DAY).as(`Model`);
    //     cy.visit(`/#/admin-health-dashboard`);
    //     cy.wait([`@Model stats`, `@Tasks`]);
    //     Cypress.on(`uncaught:exception`, (err, runnable) => {
    //         return false;
    //     })
    // }
}
