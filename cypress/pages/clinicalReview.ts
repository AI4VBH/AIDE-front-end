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
import { AbstractPage } from "./abstractPage";
import { ClinicalReviewTaskData } from "../data/clinical-review/listOfTasks";
import { StudyData } from "data/clinical-review/study";
import {
    formatDateAndTimeOfString,
    formatDate,
    formatDateTime,
} from "../../src/utils/date-utilities";
import {
    ClinicalReviewRecord,
    PagedClinicalReviewList,
    ClinicalReviewStudyDetails,
} from "../../src/models/ClinicalReview/ClinicalReviewTask";
import { acceptRejectData } from "data/clinical-review/acceptReject";

const allTasks = ClinicalReviewTaskData.LIST_OF_ALL_TASKS;
const searchPatientIdTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;
const searchPatientNameTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;
const searchApplicationNameTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;

const nextPage = "[aria-label='Next page']";
const previousPage = "[aria-label='Previous page']";
const pageTen = "[aria-label='Goto Page 10']";
const pageNine = "[aria-label='Goto Page 9']";

export default class ClinicalReviewPage extends AbstractPage {
    public initPage() {
        cy.intercept(
            "GET",
            "https://localhost:8000/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            ApiMocks.CLINICAL_REVIEW_TASKS,
        ).as("all-tasks");
        cy.intercept("GET", "clinical-review/001", ApiMocks.CLINICAL_REVIEW_EXECUTION_1).as(
            "executions",
        );
        cy.intercept("/clinical-review/dicom?key=CT000000.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-1");
        cy.intercept("/clinical-review/dicom?key=CT000010.dcm", {
            fixture: "clinical-review/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-2");
        cy.intercept("/clinical-review/dicom?key=DO000000.dcm", {
            fixture: "clinical-review/DO000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("doc");
        cy.visit("clinical-review");
        cy.wait(["@all-tasks", "@executions", "@ct-1", "@ct-2", "@doc"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageNoTasks() {
        cy.intercept(
            "GET",
            "https://localhost:8000/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            ApiMocks.CLINICAL_REVIEW_NO_TASKS,
        ).as("no-tasks");
        cy.visit("clinical-review");
        cy.wait(["@no-tasks"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertNoTasksMessage() {
        this.initPageNoTasks();
        cy.dataCy("no-tasks-message").should(
            "contain.text",
            "There are no application outputs left to review",
        );
    }

    public assertAcceptRejectTask() {
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.fillAcceptModal();
        this.clickDataCy("action-cancel");
        this.fillAcceptModal();
        this.assertAccepted(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.fillRejectModal();
        this.assertRejected(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.fillAcceptModal();
        this.assertAccepted(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
    }

    public assertToastIfErrorOnReview(status_code: number) {
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.fillAcceptModal();
        this.errorPut(
            "action-accept",
            ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1],
            status_code,
        );
        this.fillRejectModal();
        this.errorPut(
            "action-reject",
            ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1],
            status_code,
        );
    }

    public errorPut(reviewType: string, task: ClinicalReviewRecord, status_code: number) {
        cy.intercept("PUT", `clinical-review/${task.clinical_review_message.execution_id}`, {
            statusCode: status_code,
        }).as("put");
        cy.dataCy(reviewType).click({ force: true });
        cy.wait("@put");
        this.assertToast(`Something unexpected went wrong saving your review`);
        cy.dataCy("action-cancel").click({ force: true });
    }

    public assertAccepted(task: ClinicalReviewRecord) {
        cy.intercept("PUT", `clinical-review/${task.clinical_review_message.execution_id}`, {
            statusCode: 200,
        }).as("put");
        cy.dataCy("action-accept").click({ force: true });
        cy.wait("@put").then((xhr) => {
            const actualRequest = new acceptRejectData(xhr.request.body);
            expect(actualRequest.acceptance).to.be.true;
            expect(actualRequest.message).to.eql("Looks good to me");
        });
        this.assertToast(`Clinical Review has been accepted`);
    }

    public assertRejected(task: ClinicalReviewRecord) {
        cy.intercept("PUT", `clinical-review/${task.clinical_review_message.execution_id}`, {
            statusCode: 200,
        }).as("put");
        cy.dataCy("action-reject").click({ force: true });
        cy.wait("@put").then((xhr) => {
            const actualRequest = new acceptRejectData(xhr.request.body);
            expect(actualRequest.acceptance).to.be.false;
            expect(actualRequest.message).to.eql("Wrong diagnosis");
        });
        this.assertToast(`Clinical Review has been rejected`);
    }

    public fillRejectModal() {
        cy.dataCy("reject-task").click({ force: true });
        cy.dataCy("action-reject").should("be.disabled");
        cy.get(".v-select__selections").click();
        cy.get(".v-list-item__title").contains("Result is not correct").click();
        cy.dataCy("action-reject").should("be.disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-reject").should("be.enabled");
        cy.get(".v-select__selections").click();
        cy.get(".v-list-item__title").contains("Other").click();
        cy.dataCy("action-reject").should("be.disabled");
        cy.dataCy("action-description").type("Wrong diagnosis");
        cy.dataCy("action-reject").should("be.enabled");
    }

    public fillAcceptModal() {
        cy.dataCy("accept-task").click({ force: true });
        cy.dataCy("action-accept").should("be.disabled");
        cy.dataCy("action-description").type("Looks good to me");
        cy.dataCy("action-accept").should("be.disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
    }

    public assertPatientDetails() {
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.assertDetails(
            ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1],
            StudyData.STUDY_DATA_2,
        );
    }

    public assertDetails(task: ClinicalReviewRecord, study: ClinicalReviewStudyDetails) {
        const date = formatDate(task.clinical_review_message.patient_metadata.patient_dob);
        const dateTime = formatDateTime(study.study_date);
        cy.dataCy("patient-name").should(
            "contain",
            task.clinical_review_message.patient_metadata.patient_name,
        );
        cy.dataCy("patient-age").should(
            "contain",
            task.clinical_review_message.patient_metadata.patient_age,
        );
        cy.dataCy("patient-dob").should("contain", date);
        cy.dataCy("patient-id").should(
            "contain",
            task.clinical_review_message.patient_metadata.patient_id,
        );
        cy.dataCy("patient-sex").should(
            "contain",
            task.clinical_review_message.patient_metadata.patient_sex,
        );
        cy.dataCy("study-date").should("contain", dateTime);
    }

    public assertViewAndFilterTasks() {
        this.assertTaskSelected(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.assertTaskDetails(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.searchPatientId();
        this.searchPatientName();
        this.searchApplicationName();
    }

    public assertPaginationandViewTasks() {
        this.changePage(nextPage, 2, ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_2);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION_PAGE_2, 0);
        this.changePage(previousPage, 1, ApiMocks.CLINICAL_REVIEW_TASKS);
        this.assertTaskDetails(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.changePage(pageTen, 10, ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_10);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION_PAGE_10, 0);
        this.changePage(pageNine, 9, ApiMocks.CLINICAL_REVIEW_PAGINATION_PAGE_9);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION_PAGE_9, 0);
    }

    public viewMetadataAndPin() {
        this.assertMetadata(1);
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.assertClickOtherSeries();
        this.assertMetadata(262);
        this.pinMetadata("StudyDate");
        this.assertPinnedMetadata(0, "StudyDate");
        this.pinMetadata("SeriesDate");
        this.assertPinnedMetadata(1, "SeriesDate");
    }

    public viewDicomsAndSeriesSelector() {
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.assertClickOtherSeries();
        this.assertSeriesListDisplay();
        const tuple = [
            [0, "CT (2)"],
            [1, "DOC (1)"],
            [2, "MRI (3)"],
        ];
        tuple.forEach(($type) => {
            const [array, text] = $type;
            this.assertSeriesTitles(array as number, text as string);
        });
    }

    public assertPinnedMetadata(index: number, metaName: string) {
        cy.dataCy("metadata-item").eq(index).should("contain", metaName);
    }

    public pinMetadata(metadataKey: string) {
        cy.dataCy("metadata-item")
            .filter(`:contains("${metadataKey}")`)
            .within(() => {
                cy.dataCy("pin-metadata").click();
            });
    }

    public assertMetadata(value: number) {
        cy.dataCy("metadata-value").eq(48).should("contain", value);
    }

    public assertClickOtherSeries() {
        cy.intercept("/clinical-review/dicom?key=MRI000000-33.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("mri-33");
        cy.intercept("/clinical-review/dicom?key=MRI000000-333.dcm", {
            fixture: "clinical-review/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("mri-333");
        cy.dataCy("series-item").eq(2).click({ force: true });
    }

    public assertSeriesTitles(index: number, text: string) {
        cy.dataCy("series-title").eq(index).should("contain.text", `${text}`);
    }

    public assertSeriesListDisplay() {
        cy.dataCy("dicom-tool-toggle-series")
            .should("contain.text", "Hide")
            .click()
            .should("contain.text", "Show")
            .click()
            .should("contain.text", "Hide");
    }

    public selectTaskViewDicom(task: ClinicalReviewRecord) {
        cy.intercept(
            "GET",
            `clinical-review/${task.clinical_review_message.execution_id}`,
            ApiMocks.CLINICAL_REVIEW_EXECUTION_2,
        ).as("executions");
        cy.intercept("/clinical-review/dicom?key=CT000000-01.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-1");
        cy.intercept("/clinical-review/dicom?key=CT000000-11.dcm", {
            fixture: "clinical-review/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-11");
        cy.intercept("/clinical-review/dicom?key=DO000000-02.dcm", {
            fixture: "clinical-review/DO000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("doc-1");
        cy.intercept("/clinical-review/dicom?key=MRI000000-03.dcm", {
            fixture: "clinical-review/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("mri-3");
        cy.dataCy(task.clinical_review_message.patient_metadata.patient_id).click({ force: true });
        cy.wait(["@executions", "@ct-1", "@ct-11", "@doc-1", "@mri-3"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public changePage(page: string, pageNumber: number, mocks: any) {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=${pageNumber}&pageSize=${allTasks.pageSize}&patientId=&patientName=&applicationName=`,
            mocks,
        ).as("pagination");
        cy.get(page).click();
        cy.wait("@pagination");
        cy.wait(100);
    }

    public assertTaskDetails(task: PagedClinicalReviewList, index: number) {
        const taskdate = formatDateAndTimeOfString(task.data[index].received.toString(), false);
        cy.dataCy(task.data[index].clinical_review_message.patient_metadata.patient_id)
            .should(
                "contain",
                task.data[index].clinical_review_message.patient_metadata.patient_name,
            )
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_id)
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_age)
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_sex)
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_name,
            )
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_version,
            )
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_mode,
            )
            .and("contain", taskdate);
    }

    public assertTaskSelected(task: PagedClinicalReviewList, index: number) {
        cy.dataCy(task.data[index].clinical_review_message.patient_metadata.patient_id).should(
            "have.class",
            "v-list-item--active",
        );
    }

    public searchPatientId() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=${searchPatientIdTaskData.patient_metadata.patient_id}&patientName=&applicationName=`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_ID,
        ).as("patient-id");
        cy.dataCy("patient-id-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search").type(searchPatientIdTaskData.patient_metadata.patient_id);
        cy.wait("@patient-id");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_PATIENT_ID, 0);
    }

    public searchPatientName() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=${searchPatientNameTaskData.patient_metadata.patient_name}&applicationName=`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_NAME,
        ).as("patient-name");
        cy.dataCy("patient-name-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search")
            .clear({ force: true })
            .type(searchPatientNameTaskData.patient_metadata.patient_name);
        cy.wait("@patient-name");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_PATIENT_NAME, 0);
    }

    public searchApplicationName() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=${searchApplicationNameTaskData.application_metadata.application_name}`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_APPLICATION_NAME,
        ).as("application-name");
        cy.dataCy("application-name-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search")
            .clear({ force: true })
            .type(searchApplicationNameTaskData.application_metadata.application_name);
        cy.wait("@application-name");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_APPLICATION_NAME, 0);
    }

    public assertPageRefresh() {
        cy.reload();
        cy.contains("Something unexpected went wrong").should("not.exist");
    }
}
