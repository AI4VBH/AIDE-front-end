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

import AppProfilePage from "pages/appProfilePage";
import { AppProfileData } from "data/app-store-profile/appProfile";

const appProfilePage = new AppProfilePage();

describe.skip("App profile page version 1 ", () => {
    beforeEach(() => {
        appProfilePage.initPage1();
    });

    it("displays application version 1 details correctly", () => {
        return appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts version is selected and displayed", () => {
        appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS1);
    });
});

describe.skip("App profile page version 2 ", () => {
    beforeEach(() => {
        appProfilePage.initPage2();
    });

    it("displays application details with different sets of data", () => {
        appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS2);
    });
    //waiting reply to ordering from Dan
    // it("asserts version is selected and displayed", () => {
    //     appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS2);
    // });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS2);
    });
});

describe.skip("Error codes on app store profile page", () => {
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", () => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });

    it("Application profile page handles 400 error code", () => {
        appProfilePage.returning400HandledGracefully();
    });

    it("Application profile page handles 403 error code", () => {
        appProfilePage.returning403HandledGracefully();
    });

    it("Application not found and gives 404 error code", () => {
        appProfilePage.returning404HandledGracefully();
    });

    it("Application profile page handles 500 error code", () => {
        appProfilePage.returning500HandledGracefully();
    });
});
