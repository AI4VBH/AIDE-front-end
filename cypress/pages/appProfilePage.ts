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

import {
    Application,
    MedicalSpeciality,
    InputType,
    OutputType,
    Version,
    VersionDetails,
} from "../../src/models/AppRepo/Application";
import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";

export default class AppProfilePage extends AbstractPage {
    // Default Screen
    static APPLICATION_ID = "v-breadcrumbs__item";
    static APPLICATION_NAME = "name";
    static VERSION = "version-selector";
    static VERSIONS = "versions";
    static APPLICATION_VERSION_ID = "version-id";
    static IMAGE = "application-image";
    static SHORT_DESCRIPTION = "short-description";
    static INTENDED_USE = "intended-use";
    static LONG_DESCRIPTION = "model-details";
    static MEDICAL_SPECIALTIES = "speciality";
    static LOGO = ["ce-logo", "fda-logo", "ukca-logo"];
    static CE_CERTIFICATION = "ce-title";
    static FDA_CERTIFICATION = "fda-title";
    static UKCA_CERTIFICATION = "ukca-title";
    static CERTIFICATION_DETAILS = "certification-details";
    static GPU_MEMORY = "min-gpu-memory-value";
    static NUMBER_OF_CORES = "min-cpu-cores-value";
    static DISK_SPACE = "min-disk-space-value";
    static RAM = "min-ram-mb-value";
    static INPUT_TYPES = "input-types-value";
    static OUTPUT_TYPES = "output-types-value";
    static DEVELOPER_DETAILS = "developer-details";
    static DEVELOPERS = "developers";
    static FILES = "file-card";
    static FILE_LABEL = "file-label";
    static FILE_IMAGE = "file-image";
    static CREATED_AT = "created-at";
    static UPDATED_AT = "updated-at";
    static SPECIFICATIONS = "specification-table";
    static SPECIALITY = "specialty";
    static GOTO_VERSION = "goto-version";
    static HISTORY_VERSION = "history-version";
    static VERSION_DATE = "version-date";

    public assertAppDetails(application: Application): void {
        cy.dataCy(AppProfilePage.APPLICATION_NAME)
            .should("exist")
            .should("contains.text", application.name);
        //Raised a bug - AIDE 1181
        // cy.dataCy(AppProfilePage.IMAGE).should("exist");
        cy.dataCy(AppProfilePage.INTENDED_USE)
            .should("exist")
            .should("contains.text", application.versions[0].version_details[0].intended_use);
        //Raised a bug, AIDE 1187
        // this.assertCertificationLogoIsDisplayed(application.versions[0].version_details[0].ce_certified,
        //         application.versions[0].version_details[0].fda_certified,
        //         application.versions[0].version_details[0].ukca_certified);
        cy.dataCy(AppProfilePage.SHORT_DESCRIPTION)
            .should("exist")
            .should("contains.text", application.versions[0].version_details[0].short_desc);
        cy.dataCy(AppProfilePage.LONG_DESCRIPTION)
            .should("exist")
            .should("contains.text", application.versions[0].version_details[0].long_desc);
        cy.dataCy(AppProfilePage.DEVELOPERS)
            .should("exist")
            .should("contains.text", application.versions[0].version_details[0].developer_name);
        // Raised a bug - AIDE 1189
        // cy.dataCy(AppProfilePage.DEVELOPER_DETAILS)
        //     .should("exist")
        //     .should("contains.text", application.versions[0].version_details[0].developer_details);
        //Bug raised - AIDE 1188
        // this.assertSpecialityIsDisplayed(application.versions[0].version_details[0].medical_specialities);
        //what are the files in the json
        // this.assertFilesAreDisplayed(application.versions[0].version_details[0]);
        this.assertInputRequirements(application.versions[0].version_details[0].input_types);
        this.assertOutputRequirements(application.versions[0].version_details[0].output_types);
        this.assertVersions(application.versions);
    }

    public assertVersion(application: Application): void {
        // waiting on dan to reply about ordering
        this.VersionDropdown("version-selector", application.versions);
    }

    versionDetails: Array<Application>;

    public assertSystemRequirements(application: Application): void {
        this.getGpu(application.versions[0].version_details);
        this.getCores(application.versions[0].version_details);
        this.getDiskSpace(application.versions[0].version_details);
        this.getRam(application.versions[0].version_details);
    }

    public getGpu(versionDetails: Array<VersionDetails>): void {
        if (versionDetails != []) {
            versionDetails.forEach((version_details) => {
                cy.dataCy(AppProfilePage.GPU_MEMORY).should(
                    "contain",
                    version_details.min_gpu_memory,
                );
            });
        }
    }
    public getCores(versionDetails: Array<VersionDetails>): void {
        if (versionDetails != []) {
            versionDetails.forEach((version_details) => {
                cy.dataCy(AppProfilePage.NUMBER_OF_CORES).should(
                    "contain",
                    version_details.min_cpu_cores,
                );
            });
        }
    }
    public getDiskSpace(versionDetails: Array<VersionDetails>): void {
        if (versionDetails != []) {
            versionDetails.forEach((version_details) => {
                cy.dataCy(AppProfilePage.DISK_SPACE).should(
                    "contain",
                    version_details.min_disk_space,
                );
            });
        }
    }
    public getRam(versionDetails: Array<VersionDetails>): void {
        if (versionDetails != []) {
            versionDetails.forEach((version_details) => {
                cy.dataCy(AppProfilePage.RAM).should("contain", version_details.min_ram);
            });
        }
    }

    public assertInputRequirements(inputType: Array<InputType>): AppProfilePage {
        if (inputType != []) {
            inputType.forEach((input_type) => {
                cy.dataCy(AppProfilePage.INPUT_TYPES).should("contain", input_type.name);
            });
        } else {
            cy.log("No specifications were provided");
        }
        return this;
    }
    public assertOutputRequirements(outputType: Array<OutputType>): AppProfilePage {
        if (outputType != []) {
            outputType.forEach((output_type) => {
                cy.dataCy(AppProfilePage.OUTPUT_TYPES).should("contain", output_type.name);
            });
        } else {
            cy.log("No specifications were provided");
        }
        return this;
    }

    public assertVersions(versions: Array<Version>): void {
        if (versions != null) {
            versions.forEach((version) => {
                cy.dataCy(AppProfilePage.GOTO_VERSION).should("exist");
                cy.dataCy(AppProfilePage.HISTORY_VERSION).should("contain", version.version_string);
                cy.dataCy(AppProfilePage.VERSION_DATE).should(
                    "contain",
                    this.dateTimeConvertor(version.createdAt),
                );
            });
        } else {
            cy.log("No versions were provided");
        }
    }

    private assertSpecialityIsDisplayed(specialities: Array<MedicalSpeciality>): AppProfilePage {
        if (specialities != []) {
            specialities.forEach((speciality) => {
                cy.dataCy(AppProfilePage.SPECIALITY).should("contain", speciality.name);
            });
        } else {
            cy.log("No specialties were provided");
        }
        return this;
    }

    public assertFilesAreDisplayed(files: Array<string>): void {
        if (files != null) {
            files.forEach((file) => {
                switch (file) {
                    case "file-label": {
                        return cy.dataCy(AppProfilePage.FILE_LABEL).should("be.visible");
                    }
                    case "file-image": {
                        return cy.dataCy(AppProfilePage.FILE_IMAGE).should("be.visible");
                    }
                }
            });
        } else {
            cy.log("No files were provided");
        }
    }

    private assertCertificationLogoIsDisplayed(ce: boolean, fda: boolean, ukca: boolean): void {
        switch (ce) {
            case true:
                cy.dataCy(AppProfilePage.CE_CERTIFICATION).should("contain", "CE");
        }
        switch (fda) {
            case true:
                cy.dataCy(AppProfilePage.FDA_CERTIFICATION).should("contain", "FDA");
        }
        switch (ukca) {
            case true:
                cy.dataCy(AppProfilePage.UKCA_CERTIFICATION).should("contain", "FDA");
        }
    }

    public async initPage1() {
        const application_id = "06e5e7fc-f1b6-4a09-8c8a-32d6bee02fdc";
        const version_id = "5ae54fb1-24cc-46e5-a90e-bb65bdbb65c6";
        cy.intercept(
            `/app_store/applications/${application_id}?status=Live`,
            ApiMocks.APP_PROFILE_PAGE1,
        );
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${version_id}`,
        );
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public async initPage2() {
        const application_id = "06e5e7fc-f1b6-4a09-8c8a-32d6bee02fdd";
        const version_id = "5ae54fb1-24cc-46e5-a90e-bb65bdbb65c7";
        cy.intercept(
            `/app_store/applications/${application_id}?status=Live`,
            ApiMocks.APP_PROFILE_PAGE2,
        );
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${version_id}`,
        );
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public async returning400HandledGracefully() {
        const application_id = "9e5d4728-e73d-4ef1-ac56-69f682453316";
        const application_version_id = "667fc4a4-b568-4e3a-b46f-cd06773c9239";
        cy.intercept(`/app_store/applications/${application_id}?status=Live`, {
            statusCode: 400,
        }).as("fourHundred");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundred");
        this.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving the application",
        );
    }

    public async returning403HandledGracefully() {
        const application_id = "9e5d4728-e73d-4ef1-ac56-69f682453316";
        const application_version_id = "667fc4a4-b568-4e3a-b46f-cd06773c9239";
        cy.intercept(`/app_store/applications/${application_id}?status=Live`, {
            statusCode: 403,
        }).as("fourHundredThree");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundredThree");
        this.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving the application",
        );
    }

    public async returning404HandledGracefully() {
        const application_id = "9e5d4728-e73d-4ef1-ac56-69f682453316";
        const application_version_id = "667fc4a4-b568-4e3a-b46f-cd06773c9239";
        cy.intercept(`/app_store/applications/${application_id}?status=Live`, {
            statusCode: 404,
        }).as("fourHundredFour");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundredFour");
        this.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving the application",
        );
    }

    public async returning500HandledGracefully() {
        const application_id = "9e5d4728-e73d-4ef1-ac56-69f682453316";
        const application_version_id = "667fc4a4-b568-4e3a-b46f-cd06773c9239";
        cy.intercept(`/app_store/applications/${application_id}?status=Live`, {
            statusCode: 500,
        }).as("fiveHundred");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fiveHundred");
        this.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving the application",
        );
    }
}
