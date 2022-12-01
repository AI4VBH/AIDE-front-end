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

import Workflows from "pages/workflows";
import { WorkflowData } from "data/workflows/workflows";
import { WorkflowExampleData } from "data/workflows/workflowJson";

const workflowInitData = WorkflowData.WORKFLOWS_INIT;
const workflowPage = new Workflows();
const workflowEmpty = WorkflowExampleData.WORKFLOW_EMPTY;

describe("Workflows", () => {
    beforeEach(() => {
        workflowPage.initPage();
    });
    describe("View/Delete workflows", () => {
        it(`I can see workflows`, () => {
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
        it("I can view next page", () => {
            workflowPage.paginationRequestWorkflows();
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
        it("I can delete workflows", () => {
            workflowPage.clickDeleteButtonWorkflows(0);
            workflowPage.assertCorrectDeleteRequest(workflowInitData);
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
    });

    describe("Edit Workflows", () => {
        it("Editing a workflow takes me to the editor with the workflow instance displayed", () => {
            workflowPage.workflowEditRequestEmpty();
            workflowPage.assertEditUrl(workflowInitData);
            workflowPage.workflowDisplayedCorrectly();
        });
        it("Editing a workflow with incorrect json displays validation and disables save button", () => {
            workflowPage.workflowEditRequest();
            workflowPage.assertJsonError();
            workflowPage.assertSaveStatus("disabled");
            workflowPage.clearJson();
            workflowPage.assertSaveStatus("enabled");
        });
        it("Selecting save or discard and then canceling on the modal keeps you on the editor page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.clickDataCy("workflow-edit-confirm-cancel");
            workflowPage.assertEditUrl(workflowInitData);
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-cancel");
            workflowPage.assertEditUrl(workflowInitData);
        });
        it("Selecting discard and then confirm on the modal returns you to the workflow tables page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-continue");
            workflowPage.assertWorkflowsUrl();
        });
        it("I can save an edited workflow", () => {
            const successToast = "Workflow updated successfully";
            workflowPage.workflowEditRequest();
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnSuccess();
            workflowPage.assertWorkflowsUrl();
            workflowPage.assertToast(successToast);
        });
        it("If a 400 error is returned on saving, the error message is displayed at the top of the page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnEditError();
            workflowPage.errorsDisplayed();
        });
    });

    describe("Add Workflows", () => {
        it("Adding a workflow takes me to an empty editor", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.assertAddUrl();
            workflowPage.assertNoText();
        });
        it("Adding incorrect json displays validation and disables save button", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.assertJsonError();
            workflowPage.assertSaveStatus("disabled");
            workflowPage.clearJson();
            workflowPage.assertSaveStatus("enabled");
        });
        it("Selecting save or discard and then cancel on the modal keeps you on the editor page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.clickDataCy("workflow-edit-confirm-cancel");
            workflowPage.assertAddUrl();
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-cancel");
            workflowPage.assertAddUrl();
        });
        it("Selecting discard and then confirm on the modal returns you to the workflow tables page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-continue");
            workflowPage.assertWorkflowsUrl();
        });
        it("If a 400 error is returned on saving, the error message is displayed at the top of the page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnAddError();
            workflowPage.errorsDisplayed();
        });
        it("I can add and save a new workflow", () => {
            const successToast = "Workflow created successfully";
            workflowPage.clickDataCy("add-workflow");
            workflowPage.editWorkflow();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPost();
            workflowPage.assertWorkflowsUrl();
            workflowPage.assertToast(successToast);
        });
    });

    describe("API errors", () => {
        const initError = "Something unexpected went wrong retrieving workflows";
        const deleteErrorMessage = "Something unexpected went wrong deleting the workflow";
        const getErrorMessage = "Something unexpected went wrong retrieving workflows";
        const putErrorMessage = "Something unexpected went wrong updating the workflow";
        const postErrorMessage = "Something unexpected went wrong creating the workflow";

        [400, 404, 500].forEach((statusCode) => {
            it.skip(`Toast displayed if a ${statusCode} error is returned on getting workflows`, () => {
                workflowPage.initPageError(statusCode);
                workflowPage.assertToast(initError);
            });
            it(`Toast displayed if a ${statusCode} error is returned on deleting existing workflow`, () => {
                workflowPage.initPage();
                workflowPage.clickDeleteButtonWorkflows(0);
                workflowPage.errorDeleteWorkflow(workflowInitData, statusCode);
                workflowPage.assertToast(deleteErrorMessage);
            });
            it(`Toast displayed if a ${statusCode} error is returned on editing existing workflow`, () => {
                workflowPage.initPage();
                workflowPage.workflowEditRequestError(statusCode);
                workflowPage.assertToast(getErrorMessage);
            });
            it(`Toast displayed if a ${statusCode} error is returned on saving an edited workflow`, () => {
                workflowPage.initPage();
                workflowPage.workflowEditRequest();
                workflowPage.editWorkflow();
                workflowPage.clickDataCy("save-workflow-changes");
                workflowPage.returnEditToastError(workflowEmpty, statusCode);
                workflowPage.assertToast(putErrorMessage);
            });
            it(`Toast displayed if a ${statusCode} error is returned on adding a workflow`, () => {
                workflowPage.initPage();
                workflowPage.clickDataCy("add-workflow");
                workflowPage.editWorkflow();
                workflowPage.clickDataCy("save-workflow-changes");
                workflowPage.returnErrorPost(statusCode);
                workflowPage.assertToast(postErrorMessage);
            });
        });
    });
});
