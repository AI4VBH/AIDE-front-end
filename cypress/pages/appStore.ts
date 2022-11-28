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

import Order from "data/enums/order";
import { Application, MedicalSpeciality } from "../../src/models/AppRepo/Application";
import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
export default class AppStorePage extends AbstractPage {
    // Default Screen
    static APP_STORE_BUTTON = "app-store-button";
    static APPLICATION_CARD = "application-card";
    static APPLICATION_NAME = "application-name";
    static DEVELOPER_DETAILS = "developer-name";
    static VERSION = "version";
    static SHORT_DESCRIPTION = "short-description";
    static VIEW_APPLICATION_BUTTON = "view-application-button";
    static APPLICATION_IMAGE = "application-image";
    static SPECIALITY = "speciality";
    static CE_LOGO = "ce-logo";
    static UKCA_LOGO = "ukca-logo";
    static FDA_LOGO = "fda-logo";
    static NO_RESULTS_MESSAGE = "no-results-message";
    static APPLICATION_TABLE = "application-table";
    static MEDICAL_SPECIALITY_FILTER = "medical-speciality-filter";
    static SORT_BY = "sort-by";
    static SEARCH_APPLICATION_REPOSITORY = "search-application-repository";

    public clickAppStoreButton(): AppStorePage {
        cy.dataCy(AppStorePage.APP_STORE_BUTTON).click();
        return this;
    }

    public assertAppStorePageShows(): AppStorePage {
        cy.url().should("include", "/#/application-repository");
        cy.dataCy(AppStorePage.APPLICATION_NAME).should("be.visible");
        cy.dataCy(AppStorePage.DEVELOPER_DETAILS).should("be.visible");
        cy.dataCy(AppStorePage.VERSION).should("be.visible");
        cy.dataCy(AppStorePage.SHORT_DESCRIPTION).should("be.visible");
        cy.dataCy(AppStorePage.VIEW_APPLICATION_BUTTON).should("be.visible");
        cy.dataCy(AppStorePage.APPLICATION_IMAGE).should("be.visible");
        return this;
    }

    private assertCertificationLogoIsDisplayed(ce: boolean, fda: boolean, ukca: boolean): void {
        if (ce == true) {
            cy.dataCy(AppStorePage.CE_LOGO).should("be.visible");
        }
        if (fda == true) {
            cy.dataCy(AppStorePage.FDA_LOGO).should("be.visible");
        }
        if (ukca == true) {
            cy.dataCy(AppStorePage.UKCA_LOGO).should("be.visible");
        } else {
            cy.log("No certifications were provided");
        }
    }

    private assertSpecialityIsDisplayed(specialities: Array<MedicalSpeciality>): AppStorePage {
        if (specialities != []) {
            specialities.forEach((speciality) => {
                cy.dataCy(AppStorePage.SPECIALITY).should("contain", speciality.name);
            });
        } else {
            cy.log("No specialties were provided");
        }
        return this;
    }

    public assertApp(application: Application): AppStorePage {
        this.getApp(application.name).within(() => {
            cy.dataCy(AppStorePage.APPLICATION_NAME).should("contains.text", application.name);
            cy.dataCy(AppStorePage.DEVELOPER_DETAILS).should(
                "have.text",
                application.versions[0].version_details[0].developer_name,
            );
            cy.dataCy(AppStorePage.VERSION).should(
                "have.text",
                "Version: " + application.versions[0].version_string,
            );
            cy.dataCy(AppStorePage.VIEW_APPLICATION_BUTTON).should("be.visible");
            cy.dataCy(AppStorePage.SHORT_DESCRIPTION).should(
                "contains.text",
                application.versions[0].version_details[0].short_desc,
            );
            //Bug raised - AIDE 1181
            // cy.dataCy(AppStorePage.APPLICATION_IMAGE).should("be.visible");
            this.assertCertificationLogoIsDisplayed(
                application.versions[0].version_details[0].ce_certified,
                application.versions[0].version_details[0].fda_certified,
                application.versions[0].version_details[0].ukca_certified,
            );
            this.assertSpecialityIsDisplayed(
                application.versions[0].version_details[0].medical_specialities,
            );
            if (application.versions[0].version_details[0].short_desc.length > 50) {
                cy.dataCy(AppStorePage.SHORT_DESCRIPTION)
                    .should("have.css", "overflow", "hidden")
                    .should("have.css", "text-overflow", "ellipsis");
            }
        });
        return this;
    }

    public getApp(applicationName: string): Cypress.Chainable<JQuery> {
        return cy.dataCy("application-card").filter(`:contains("${applicationName}")`);
    }

    public assertBlankAppList(): AppStorePage {
        cy.intercept("/app_store/applications?status=Live", { statusCode: 200, body: "[]" }).as(
            "twoHundred",
        );
        cy.visit("/#/application-repository");
        cy.wait("@twoHundred");
        cy.dataCy(AppStorePage.NO_RESULTS_MESSAGE).should("be.visible");
        return this;
    }

    public assertAlphabeticalOrdering(order: Order): void {
        const originalOrder = [];
        cy.dataCy(AppStorePage.APPLICATION_NAME).each(($el) => {
            originalOrder.push($el.text());
        });
        if (order == Order.Ascending) {
            this.alphabeticalOrderDropDown("sort-by", "Ascending (A to Z)");
            cy.dataCy(AppStorePage.APPLICATION_NAME).each(($el, i) => {
                originalOrder.sort();
                expect($el.text()).to.equal(originalOrder[i]);
            });
        }
        if (order == Order.Descending) {
            this.alphabeticalOrderDropDown("sort-by", "Descending (Z to A)");
            cy.dataCy(AppStorePage.APPLICATION_NAME).each(($el, i) => {
                originalOrder.sort();
                originalOrder.reverse();
                expect($el.text()).to.equal(originalOrder[i]);
            });
        }
    }

    public assertTextSearchedApp(text, application): void {
        cy.dataCy(AppStorePage.SEARCH_APPLICATION_REPOSITORY).type(text);
        this.assertApp(application);
    }

    public assertErrorCodeHandling(code): void {
        cy.intercept("/app_store/applications?status=Live", { statusCode: code }).as("statusCode");
        cy.visit("/#/application-repository");
        cy.wait("@statusCode");
        this.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving the application",
        );
    }

    public async initPage() {
        cy.intercept("/app_store/applications?status=Live", ApiMocks.APP_STORE_ALL_PERMUTATIONS).as(
            "ApplicationList",
        );
        cy.intercept("/app_store/medical_specialities", ApiMocks.APP_STORE_SPECIALITY_DROP_DOWN).as(
            "DropDownList",
        );
        cy.visit("/#/application-repository");
        cy.wait(["@ApplicationList"]);
        cy.wait(["@DropDownList"]);
        Cypress.on("uncaught:exception", () => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    }
}
