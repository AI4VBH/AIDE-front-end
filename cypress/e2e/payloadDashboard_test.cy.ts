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

import AdminPayloadDashboardPage from "pages/payloadDashboard";
import { PayloadData } from "data/payloads-dashboard/payloadTable";
import { PayloadTreeData } from "data/payloads-dashboard/payloadTree";

const adminPayloadPage = new AdminPayloadDashboardPage();
const payloadTableData = PayloadData.PAYLOAD_TABLE_DATA;
const payloadSearch = PayloadData.PAYLOAD_SEARCH;
const workflowInstanceOne = PayloadTreeData.TREE_DATA_1;
const workflowInstanceTwo = PayloadTreeData.TREE_DATA_2;

describe(`Admin Payload - Table`, () => {
    beforeEach(() => {
        adminPayloadPage.initPagePayload();
        cy.injectAxe();
    });
    it(`I can view the payloads returned in the Payload table`, () => {
        adminPayloadPage.assertTableDataCorrect(payloadTableData as PayloadData);
    });
    it(`I can search by Patient ID or Patient Name`, () => {
        adminPayloadPage.searchPayloadsTable("223");
        adminPayloadPage.assertCorrectTaskReturned(payloadSearch);
        adminPayloadPage.selectRadioButton("patient-name-radio-btn");
        adminPayloadPage.searchPayloadsTable("Louiza");
        adminPayloadPage.assertCorrectTaskReturned(payloadSearch);
    });
});

describe(`Admin Payload - Tree`, () => {
    beforeEach(() => {
        adminPayloadPage.initPagePayload();
        adminPayloadPage.expandAndViewTree(payloadTableData);
    });
    [workflowInstanceOne, workflowInstanceTwo].forEach((task) => {
        it(`The payload tree data is correct`, () => {
            adminPayloadPage.assertPayloadTreeDataCorrect(task);
        });
        it(`Using the zoom and reset buttons does not effect the data displayed`, () => {
            adminPayloadPage.clickZoomIn();
            adminPayloadPage.assertPayloadTreeDataCorrect(task);
            adminPayloadPage.clickZoomOut();
            adminPayloadPage.assertPayloadTreeDataCorrect(task);
            adminPayloadPage.clickReset();
            adminPayloadPage.assertPayloadTreeDataCorrect(task);
        });
        it(`Clicking on a task node shows me a popover with task details`, () => {
            adminPayloadPage.assertPopoverDataCorrect(task);
        });
        it(`I can view log data for a task`, () => {
            adminPayloadPage.assertPopoverLogsDisplayed(task);
        });
        it(`I can view metadata for a task`, () => {
            adminPayloadPage.assertPopoverMetadataDisplayed(task);
        });
    });
});

describe(`Admin payload - API errors`, () => {
    const text = "Something unexpected went wrong retrieving executions!";

    [400, 404, 500].forEach((code) => {
        it(`Toast displayed if a ${code} error is returned when a request for payloads is made`, () => {
            adminPayloadPage.initPagePayloadApiError(code);
            adminPayloadPage.assertToast(text);
        });
        it(`Toast displayed if a ${code} error is returned when a request for payload tree data is made`, () => {
            adminPayloadPage.initPagePayload();
            adminPayloadPage.initPagePayloadTreeApiError(code, payloadTableData as PayloadData);
            adminPayloadPage.assertToast(text);
        });
    });
});
