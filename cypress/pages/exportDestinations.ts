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
import { DestinationData } from "data/dicom-configuration/destinations";
import { IExportDestination } from "../../src/models/export-destinations/ExportDestination";

export default class Destinations extends AbstractPage {
    public initPage() {
        cy.intercept("/destinations", ApiMocks.DESTINATIONS_EXAMPLE).as("destinations");
        cy.visit("/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public return409() {
        cy.intercept("POST", "/destinations", { statusCode: 409 });
        this.clickDataCy(`destination-create-save`);
    }

    public assertSameNameValidation() {
        cy.dataCy("error-container").should(
            "contain",
            "A DICOM configuration with this name already exist",
        );
    }

    public modalButtons(scenario: string) {
        switch (scenario) {
            case "add-cancel":
                cy.intercept("POST", "/destinations", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy(`destination-create-cancel`);
                break;
            case "add-save":
                cy.intercept("POST", "/destinations", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("get");
                this.clickDataCy(`destination-create-save`);
                cy.wait("@get");
                break;
            case "edit-cancel":
                cy.intercept("PUT", "/destinations/USEAST", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy("destination-create-cancel");
                break;
            case "edit-save":
                cy.intercept("PUT", "/destinations/USEAST", ApiMocks.DESTINATION_ADD).as("put");
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("get");
                this.clickDataCy(`destination-edit-continue`);
                cy.wait(["@put", "@get"]);
                break;
            case "delete-cancel":
                cy.intercept("DELETE", `/destinations/USEAST`, {
                    statusCode: 200,
                });
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy("destination-delete-cancel");
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                break;
            case "delete-save":
                cy.intercept("DELETE", `/destinations/USEAST`, {
                    statusCode: 200,
                }).as("Delete");
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("Get");
                this.clickDataCy("destination-delete-continue");
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                cy.wait(["@Delete", "@Get"]);
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public deleteDestinationAPIRequest(destination: DestinationData, statusCode: number) {
        cy.intercept("DELETE", `/destinations/${destination.name}`, {
            statusCode: statusCode,
        }).as("Delete");
        cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
        this.clickDataCy("destination-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete"]);
    }

    public initPageError(statuscode: number) {
        cy.intercept("/destinations", { statusCode: statuscode }).as("destinations");
        cy.visit("/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public editDestinationAPIRequest(destination: DestinationData, statusCode: number) {
        cy.intercept("PUT", `/destinations/${destination.name}`, {
            statusCode: statusCode,
        }).as("Put");
        this.clickDataCy("destination-edit-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Put"]);
    }

    public addDestinationAPIRequest(statusCode: number) {
        cy.intercept("POST", `/destinations`, {
            statusCode: statusCode,
        }).as("Post");
        this.clickDataCy("destination-create-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post"]);
    }

    public assertTableDataCorrect(destination: IExportDestination) {
        cy.dataCy(`destination-name-0`).should(`contain`, destination.name);
        cy.dataCy(`destination-port-0`).should(`contain`, destination.port);
        cy.dataCy(`destination-ae-title-0`).should(`contain`, destination.aeTitle);
        cy.dataCy(`destination-ip-0`).should(`contain`, destination.hostIp);
    }

    public enterAddDestinationDetails(newDestinationData: IExportDestination) {
        this.clickDataCy("destination-name");
        cy.dataCy("destination-name").type(newDestinationData.name);
        this.clickDataCy("destination-ae-title");
        cy.dataCy("destination-ae-title").type(newDestinationData.aeTitle);
        this.clickDataCy("destination-ip-address");
        cy.dataCy("destination-ip-address").type(newDestinationData.hostIp);
        this.clickDataCy("destination-port");
        cy.dataCy("destination-port").type(newDestinationData.port.toString());
        this.clickAway();
    }

    public enterEditDestinationDetails(newDestinationData: IExportDestination) {
        this.clickDataCy("destination-ae-title");
        cy.dataCy("destination-ae-title").clear().type(newDestinationData.aeTitle);
        this.clickDataCy("destination-ip-address");
        cy.dataCy("destination-ip-address").clear().type(newDestinationData.hostIp);
        this.clickDataCy("destination-port");
        cy.dataCy("destination-port").clear().type(newDestinationData.port.toString());
        this.clickAway();
    }

    public saveDisabledUnlessAllFIeldsEntered(newDestinationData: IExportDestination) {
        cy.dataCy("destination-name").type(newDestinationData.name);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-ae-title").type(newDestinationData.aeTitle);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-ip-address").type(newDestinationData.hostIp);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-port").type(newDestinationData.port.toString());
        this.assertAddDICOMConfigurationButton("enabled");
    }

    public assertTableCorrect(destination: IExportDestination) {
        cy.dataCy(`destination-name-0`).should(`contain`, destination.name);
        cy.dataCy(`destination-port-0`).should(`contain`, destination.port);
        cy.dataCy(`destination-ae-title-0`).should(`contain`, destination.aeTitle);
        cy.dataCy(`destination-ip-0`).should(`contain`, destination.hostIp);
    }

    public assertAddDICOMConfigurationButton(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("destination-create-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("destination-create-save").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public echoStatusDisplayedWithValue(element: string, statusCode: number, echoStatus: string) {
        cy.intercept("GET", "/destinations/echo/*", { statusCode: statusCode }).as(
            "destinations-echo",
        );
        this.clickDataCy("destination-action-echo-0");
        cy.wait(["@destinations-echo"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.dataCy(element).should("contain.text", echoStatus);
    }

    public requiredFieldsValidationDestinations(field: string) {
        this.clickDataCy(field);
        cy.dataCy(field).clear();
        this.clickAway();
        this.assertValidationText("Required");
    }

    public noSpacesOrSpecialCharactersValidation(field) {
        this.clickDataCy(field);
        cy.dataCy(field).type("_");
        this.assertValidationText("No spaces or special characters allowed");
    }

    public sameNameValidation(field) {
        this.clickDataCy(field);
        cy.dataCy(field).type("SameName");
        this.assertValidationText("No spaces or special characters allowed");
    }

    public addressValidation(field) {
        this.clickDataCy(field);
        cy.dataCy(field).type("_");
        this.assertValidationText("Invalid address");
        cy.dataCy(field).clear().type("/");
        this.assertValidationText("Invalid address");
        cy.dataCy(field).clear().type(".");
        this.assertValidationText("Invalid address");

        cy.dataCy(field).clear().type("1.");
        this.assertValidationText("Invalid address");
        cy.dataCy(field).clear().type("1.1.");
        this.assertValidationText("Invalid address");
    }

    public portValidation(field) {
        this.clickDataCy(field);
        cy.dataCy(field).type("-");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type(".");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type("+");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type("0");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type("65536");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type("655356");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
        cy.dataCy(field).clear().type("65535.");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");

        cy.dataCy(field).clear().type("1.");
        this.assertValidationText("Invalid address");
        cy.dataCy(field).clear().type("1.1.");
        this.assertValidationText("Invalid port: numbers from 1 to 65535 only");
    }

    public assertValidationText(text: string) {
        cy.get(".v-messages__message").should("contain.text", text);
    }

    public clickAway() {
        cy.get(".v-card__title").click({ force: true });
        cy.wait(50);
    }

    public elementVisibleGet(tag: string) {
        cy.wait(500);
        cy.get(tag).should("be.visible");
    }

    public elementVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("be.visible");
    }

    public elementDisabled(tag: string) {
        cy.dataCy(tag).should("be.disabled");
    }

    public containsText(tag: string, text: string) {
        cy.wait(500);
        cy.get(tag).should("contain.text", text);
    }
}
