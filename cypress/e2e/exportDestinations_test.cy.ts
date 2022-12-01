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

import { DestinationData } from "data/dicom-configuration/destinations";
import Destinations from "pages/exportDestinations";

const dicomConfigurationPage = new Destinations();
const destinationsData = DestinationData.DESTINATIONS_EXAMPLE;
const newDestinationData = DestinationData.DESTINATION_ADD;

describe("Destinations", () => {
    beforeEach(() => {
        dicomConfigurationPage.initPage();
    });

    describe("GET destinations", () => {
        it(`The destinations table is populated with the data returned from the API`, () => {
            dicomConfigurationPage.assertTableDataCorrect(destinationsData);
        });
    });

    describe("Add new destination", () => {
        [
            "destination-name",
            "destination-ae-title",
            "destination-ip-address",
            "destination-port",
        ].forEach((field) => {
            it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.requiredFieldsValidationDestinations(field);
            });
        });
        ["destination-name", "destination-ae-title"].forEach((field) => {
            it(`Validation should be displayed to the user to indicate the '${field}' doesn't allows spaces or special characters`, () => {
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.noSpacesOrSpecialCharactersValidation(field);
            });
        });
        it(`When I enter an incorrect IP or hostname into the modal, validation should be shown`, () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.addressValidation("destination-ip-address");
        });
        it.skip(`I can only enter numbers into the port field`, () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.portValidation("destination-port");
        });
        it(`When I enter an export destination name that already exists, validation should be shown`, () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
            dicomConfigurationPage.return409();
            dicomConfigurationPage.assertSameNameValidation();
        });
        it("'Save' button is inactive until all fields are populated", () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.saveDisabledUnlessAllFIeldsEntered(newDestinationData);
        });
        it("Discarding a destination on the Modal does not save it", () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
            dicomConfigurationPage.modalButtons("add-cancel");
            dicomConfigurationPage.assertTableCorrect(destinationsData);
        });
        it("I can add a destination", () => {
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
            dicomConfigurationPage.modalButtons("add-save");
            dicomConfigurationPage.assertTableCorrect(newDestinationData);
            dicomConfigurationPage.assertToast("Destination created");
        });
    });

    describe("Edit destination", () => {
        ["destination-ae-title", "destination-ip-address", "destination-port"].forEach((field) => {
            it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
                dicomConfigurationPage.clickDataCy("destination-action-edit-0");
                dicomConfigurationPage.requiredFieldsValidationDestinations(field);
            });
        });
        it(`Destination name field should be disabled when editing`, () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.elementDisabled("destination-name");
        });
        it("Discarding a destination on the Modal does not save it", () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
            dicomConfigurationPage.modalButtons("edit-cancel");
            dicomConfigurationPage.assertTableDataCorrect(destinationsData);
        });
        it("I can edit a destination", () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
            dicomConfigurationPage.clickDataCy("destination-create-save");
            dicomConfigurationPage.elementVisibleGet(".v-card__text");
            dicomConfigurationPage.containsText(".v-card__text", destinationsData.name);
            dicomConfigurationPage.modalButtons("edit-save");
            dicomConfigurationPage.assertTableCorrect(newDestinationData);
            dicomConfigurationPage.assertToast("Destination updated");
        });
    });

    describe("Delete destination", () => {
        it("Clicking on 'Cancel' button does not delete the modal", () => {
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.modalButtons("delete-cancel");
            dicomConfigurationPage.assertTableDataCorrect(destinationsData);
        });
        it("I can delete a destination", () => {
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.modalButtons("delete-save");
            dicomConfigurationPage.assertTableCorrect(newDestinationData);
            dicomConfigurationPage.assertToast("Destination successfully deleted");
        });
    });

    describe("Echo destination", () => {
        it("I can echo a DICOM destination", () => {
            dicomConfigurationPage.echoStatusDisplayedWithValue(
                "destination-echo-status-0",
                200,
                "succeeded",
            );
            dicomConfigurationPage.elementVisibleDataCy("destination-echo-status-0");
        });
    });

    describe(" API errors", () => {
        const initError = "Something unexpected went wrong retrieving DICOM configurations";
        const deleteError = "Something unexpected went wrong deleting the DICOM configuration";
        const editError = "Something unexpected went wrong updating the DICOM configuration";
        const addError = "Something unexpected went wrong creating DICOM configuration";

        [400, 404, 500].forEach((statusCode) => {
            it(`Toast displayed if a ${statusCode} error is returned on getting Dicom configerations`, () => {
                dicomConfigurationPage.initPageError(statusCode);
                dicomConfigurationPage.assertToast(initError);
            });
            it(`Toast displayed if a ${statusCode} error is returned on deleting existing Dicom configuration`, () => {
                dicomConfigurationPage.initPage();
                dicomConfigurationPage.clickDataCy("destination-action-delete-0");
                dicomConfigurationPage.deleteDestinationAPIRequest(destinationsData, statusCode);
                dicomConfigurationPage.assertToast(deleteError);
            });
            it(`Toast displayed if a ${statusCode} error is returned on editing a DICOM configuration`, () => {
                dicomConfigurationPage.initPage();
                dicomConfigurationPage.clickDataCy("destination-action-edit-0");
                dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
                dicomConfigurationPage.clickDataCy("destination-create-save");
                dicomConfigurationPage.editDestinationAPIRequest(destinationsData, statusCode);
                dicomConfigurationPage.assertToast(editError);
            });
            it(`Toast displayed if a ${statusCode} error is returned on adding a DICOM configuration`, () => {
                dicomConfigurationPage.initPage();
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
                dicomConfigurationPage.addDestinationAPIRequest(statusCode);
                dicomConfigurationPage.assertToast(addError);
            });
            it(`'Failed' displayed if a ${statusCode} error is returned when sending an echo`, () => {
                dicomConfigurationPage.echoStatusDisplayedWithValue(
                    "destination-echo-status-0",
                    statusCode,
                    "failed",
                );
            });
        });
    });
});
