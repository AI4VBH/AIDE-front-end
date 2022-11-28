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
    ClinicalReviewTask,
    PagedClinicalReviewList,
    ClinicalReviewTaskDetail,
} from "../../src/models/ClinicalReview/ClinicalReviewTask";

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
            fixture: "clinical-review-new/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-1");
        cy.intercept("/clinical-review/dicom?key=CT000010.dcm", {
            fixture: "clinical-review-new/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-2");
        cy.intercept("/clinical-review/dicom?key=DO000000.dcm", {
            fixture: "clinical-review-new/DO000000.dcm,null",
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

    public assertPatientDetails() {
        this.selectTaskViewDicom(ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1]);
        this.assertDetails(
            ClinicalReviewTaskData.LIST_OF_ALL_TASKS.data[1],
            StudyData.STUDY_DATA_2,
        );
    }

    public assertDetails(task: ClinicalReviewTask, study: ClinicalReviewTaskDetail) {
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
            fixture: "clinical-review-new/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("mri-33");
        cy.intercept("/clinical-review/dicom?key=MRI000000-333.dcm", {
            fixture: "clinical-review-new/CT000010.dcm,null",
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

    public selectTaskViewDicom(task: ClinicalReviewTask) {
        cy.intercept(
            "GET",
            `clinical-review/${task.clinical_review_message.execution_id}`,
            ApiMocks.CLINICAL_REVIEW_EXECUTION_2,
        ).as("executions");
        cy.intercept("/clinical-review/dicom?key=CT000000-01.dcm", {
            fixture: "clinical-review-new/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-1");
        cy.intercept("/clinical-review/dicom?key=CT000000-11.dcm", {
            fixture: "clinical-review-new/CT000010.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct-11");
        cy.intercept("/clinical-review/dicom?key=DO000000-02.dcm", {
            fixture: "clinical-review-new/DO000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("doc-1");
        cy.intercept("/clinical-review/dicom?key=MRI000000-03.dcm", {
            fixture: "clinical-review-new/CT000010.dcm,null",
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
            "have.attr",
            "aria-selected",
            "true",
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

    //below to possibly be reused for accept reject tests

    public assertPageRefresh() {
        cy.reload();
        this.assertTaskSelected(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.assertTaskDetails(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        cy.contains("Something unexpected went wrong").should("not.exist");
    }

    public acceptRejects(decision: boolean): ClinicalReviewPage {
        if (decision) {
            cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).click();
        } else {
            cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).click();
        }

        return this;
    }

    public acceptRejectModal(decision: boolean): ClinicalReviewPage {
        if (decision) {
            cy.dataCy(ClinicalReviewPage.ACCEPT_MODAL).click();
        } else {
            cy.dataCy(ClinicalReviewPage.REJECT_MODAL).click();
        }

        return this;
    }

    public fillReviewModal(signed: boolean, reason?: RejectReason, description?: string) {
        if (reason) {
            cy.get(ClinicalReviewPage.REJECT_REASON_SELECT).click();
            cy.get(ClinicalReviewPage.REJECT_REASONS).contains(reason).click();
        }

        if (description) {
            cy.dataCy(ClinicalReviewPage.DESCRIPTION).type(description);
        }

        if (signed) {
            cy.get(ClinicalReviewPage.CHECKBOX).click();
        }
        return this;
    }

    public assertAcceptWorklistItem() {
        this.acceptRejects(true);
        cy.intercept("GET", "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        this.fillReviewModal(true, undefined, "This looks really good!")
            .acceptRejectModal(true)
            .worklistItemWithText(kellyName)
            .should("not.exist");
    }

    public assertRejectWorklistItem() {
        this.acceptRejects(false);
        cy.intercept("GET", "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        this.fillReviewModal(true, RejectReason.INPUTINVALID, "For some reason!")
            .acceptRejectModal(false)
            .worklistItemWithText(kellyName)
            .should("not.exist");
    }

    public assertDicomSeriesSelector() {
        this.waitForInitialViewerLoad();
        cy.get(".serieslist-header").then((el) => {
            expect(el[0].textContent).to.eq("Hide Series ");
        });
        cy.dataCy(ClinicalReviewPage.SERIES)
            .eq(0)
            .within(() => {
                cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                    expect(el[0].textContent).to.eq(
                        `${ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["Modality"]}(22)`,
                    );
                });
                cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION).should(
                    "have.text",
                    ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0][
                        "SeriesDescription"
                    ],
                );
            });
    }

    public assertDicomMetadataView() {
        this.waitForInitialViewerLoad();
        cy.intercept(
            "GET",
            "https://demo.orthanc-server.com/instances/*/simplified-tags",
            ApiMocks.REMOTE_DICOM_METADATA,
        );
        this.assertMetadataValues(
            ApiMocks.REMOTE_DICOM_METADATA,
            ClinicalReviewPage.METADATA_SERIES,
        );
    }

    public assertDicomMetadataPinned() {
        this.waitForInitialViewerLoad();
        const metadataToPin = filterObject(
            ApiMocks.REMOTE_DICOM_METADATA,
            (k) => k === "PatientName" || k === "SeriesDescription" || k === "SeriesDate",
        );
        cy.wait(1000); // Re-render issue
        Object.keys(metadataToPin).forEach((k) => this.pinMetadata(k));
        this.assertMetadataValues(metadataToPin, ClinicalReviewPage.PINNED_METADATA);
    }

    public assertDicomViewportDisplay() {
        this.waitForInitialViewerLoad();
    }

    public assertDicomImagesScrolling() {
        this.waitForInitialViewerLoad();
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).trigger("wheel", "center", { deltaY: 100 });
        this.waitForScrolledImageLoad(2);
    }

    public assertViewerMeasureTool() {
        this.waitForInitialViewerLoad();
        cy.dataCy(ClinicalReviewPage.LENGTH_TOOL).click();
        cy.get("canvas").click().trigger("mousemove", "top").click("top");
    }

    public assertExecutionsPagination() {
        this.worklistItemWithText(kellyName).should("exist");
        cy.get("[aria-label='Previous page']").should("be.disabled");
        cy.get("[aria-label='Next page']").should("be.enabled");
        this.selectNextPage();
        cy.get("[aria-label='Previous page']").should("be.enabled");
        cy.get("[aria-label='Next page']").should("be.disabled");
        this.worklistItemWithText(fionaName).should("exist");
        this.selectPreviousPage();
        this.worklistItemWithText(kellyName).should("exist");
    }

    public assertPageRefresh() {
        cy.reload();
        cy.contains("Something unexpected went wrong").should("not.exist");
    }

    public assertNoTasks() {
        cy.visit("/#/clinical-review");
        cy.intercept("/executions*", { body: [], statusCode: 404 }).as("No executions");
        cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).should("be.disabled");
        cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).should("be.disabled");
    }
}
