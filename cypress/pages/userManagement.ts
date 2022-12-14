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

import { AbstractPage } from "./abstractPage";
import ApiMocks from "fixtures/mockIndex";
import {
    GetAllUsersResponse,
    PaginatedRolesResponse,
} from "../../src/models/user-management/UserManagement";
import { UserDataPost } from "data/user-management/usersPost";
import { RolePostData } from "data/user-management/rolesPost";

const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";
const paginationDropdown =
    ".v-window-item--active > div > .px-4 > .v-card > .v-data-table > .v-data-footer > .v-data-footer__select > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon";
const dropdown = ".d-flex > .v-input > .v-input__control > .v-input__slot > .v-select__slot";
const rolesDropdown = ":nth-child(4) > .v-input > .v-input__control > .v-input__slot";

export default class UserManagement extends AbstractPage {
    public initPage() {
        cy.intercept("users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageRoles() {
        cy.intercept("users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        this.clickDataCy("user-management-tab-Roles");
        cy.wait(500);
    }

    public initPageOneRole() {
        cy.intercept("users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ONE_USER).as(
            "users",
        );
        cy.intercept("roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ONE_ROLE).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ONE_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageOneUser() {
        cy.intercept("users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ONE_USER).as(
            "users",
        );
        cy.intercept("roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorAddUser(statusCode: number) {
        cy.intercept("POST", "/users", { statusCode: statusCode }).as("post");
        this.clickDataCy("user-modal-save");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorEditUser(statusCode: number) {
        cy.intercept("PUT", "/users/1", { statusCode: statusCode }).as("put");
        this.clickDataCy("user-edit-confirm-continue");
        cy.wait(["@put"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorDeleteUser(statusCode: number) {
        cy.intercept("DELETE", "/users/1", { statusCode: statusCode }).as("delete");
        this.clickDataCy("user-delete-continue");
        cy.wait(["@delete"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorRoles(statusCode: number) {
        cy.intercept("/users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles/list", { statusCode: statusCode }).as("roles");
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION).as(
            "rolesPaginated",
        );
        cy.visit("/user-management");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSearchRoles(statusCode: number) {
        cy.intercept("/users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        cy.intercept("/roles?search=H&first=0&max=10", {
            statusCode: statusCode,
        }).as("search");
        cy.dataCy("role-search-input").type("H");
        cy.wait(["@search"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorNextPageRoles(statusCode: number) {
        cy.intercept("/users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        cy.intercept("/roles?search=&first=10&max=10", {
            statusCode: statusCode,
        }).as("nextPage");
        cy.get(nextPage).last().click({ force: true });
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSearch(statusCode: number) {
        cy.intercept("GET", `/users?search=S&role=&first=0&max=10`, {
            statusCode: statusCode,
        }).as("search");
        cy.intercept("/users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION).as(
            "rolesPaginated",
        );
        cy.visit("/user-management");
        cy.dataCy("user-search-input").clear().type("S");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorPagination(statusCode: number) {
        cy.intercept("/users?search=&role=&first=0&max=10", ApiMocks.USER_MANAGEMENT_GET_USERS).as(
            "users",
        );
        cy.intercept("/roles?search=&first=0&max=10", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit("/user-management");
        cy.wait(["@users", "@rolesList"]);
        cy.intercept("GET", `/users?search=&role=&first=10&max=10`, {
            statusCode: statusCode,
        }).as("pagination");
        this.clickGet(nextPage);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchRoleTable(text: string): void {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=Clinician&first=0&max=10`,
            ApiMocks.USER_MANAGEMENT_ROLES_SEARCH,
        ).as("Clinician");
        cy.dataCy("role-search-input").clear().type(text);
        cy.wait(["@Clinician"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchUserTable(text: string): void {
        cy.intercept(
            "GET",
            `/users?search=Susan&role=&first=0&max=10`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Susan");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.dataCy("user-search-input").clear().type(text);
        cy.wait(["@Susan"]);
    }

    public assertCorrectUserDisplayed(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
    }

    public assertCorrectRoleDisplayed(): void {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Clinician");
    }

    public assertSecondPageUsers(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        cy.dataCy("user-table-row-firstname-1").should(`contain`, user.users[1].firstName);
        cy.dataCy("user-table-row-lastname-1").should(`contain`, user.users[1].lastName);
        cy.dataCy("user-table-row-email-1").should(`contain`, user.users[1].email);
    }

    public assertSecondPageRoles(): void {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Editable role 8");
        cy.dataCy("role-table-row-name-1").should(`contain`, "Editable role 9");
        cy.dataCy("role-table-row-name-2").should(`contain`, "Editable role 10");
    }

    public assertTotalUsers(users: GetAllUsersResponse) {
        cy.get(".text-h5").should("contain", users.totalUserCount);
    }

    public assertTotalRoles(roles: PaginatedRolesResponse) {
        cy.get(".text-h5").should("contain", roles.totalRolesCount);
    }

    public assertUserTable(user: GetAllUsersResponse) {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        this.checkStatus(user);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[0].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[1].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[2].name);
    }

    public assertTableDataCorrectAllRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Admin");
        cy.dataCy("role-table-row-name-1").should(`contain`, "Clinician");
        cy.dataCy("role-table-row-name-2").should(`contain`, "User-Manager");
        cy.dataCy("role-table-row-name-3").should(`contain`, "Editable role 1");
        cy.dataCy("role-table-row-name-4").should(`contain`, "Editable role 2");
        cy.dataCy("role-table-row-name-5").should(`contain`, "Editable role 3");
        cy.dataCy("role-table-row-name-6").should(`contain`, "Editable role 4");
        cy.dataCy("role-table-row-name-7").should(`contain`, "Editable role 5");
        cy.dataCy("role-table-row-name-8").should(`contain`, "Editable role 6");
    }

    public assertTableDataCorrectRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Added role");
    }

    public assertTableDataCorrectEditedRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Edited role");
    }

    public checkStatus(user: GetAllUsersResponse) {
        switch (user.users[0].enabled) {
            case true:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Enabled");
                break;
            case false:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public assertRoles(selection: string) {
        cy.get(dropdown).click({ force: true });
        cy.get(".v-menu__content").should("contain", selection);
    }

    public selectElementInDropdown(index: number) {
        cy.get(dropdown).click({ force: true });
        cy.intercept(
            "users?search=&role=Admin&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_SORT_ADMIN_ROLE,
        ).as("sortRoles");
        cy.get(".role-filters .v-list-item").eq(index).click({ force: true });
        cy.wait(["@sortRoles"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertRowContainsType(users: GetAllUsersResponse) {
        [0, 1, 2].forEach((row) => {
            cy.dataCy(`user-table-row-firstname-${row}`).should(
                "contain",
                users.users[row].firstName,
            );
            cy.dataCy(`user-table-row-lastname-${row}`).should(
                "contain",
                users.users[row].lastName,
            );
            cy.dataCy(`user-table-row-email-${row}`).should("contain", users.users[row].email);
        });
    }

    public paginationRequestUsers() {
        cy.intercept(
            "GET",
            `/users?search=&role=&first=10&max=10`,
            ApiMocks.USER_MANAGEMENT_PAGINATION,
        ).as("nextPage");
        this.clickGet(nextPage);
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestRoles() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=10&max=10`,
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("nextPage");
        cy.get(nextPage).last().click({ force: true });
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestFiveRolesPerPage() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=0&max=5`,
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("fivePerPage");
        cy.get(paginationDropdown).last().click({ force: true });
        cy.get(".menuable__content__active .v-list-item").eq(0).click();
        cy.wait(["@fivePerPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public tabActive() {
        cy.dataCy("user-management-tab-Users").should("have.class", "v-tab--active");
    }

    public editButtonVisibleRoles() {
        [3, 4, 5].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).within(() => {
                cy.dataCy("role-edit").should("be.visible");
            });
        });
    }

    public editButtonNotVisibleRoles() {
        [0, 1, 2].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).should("not.exist");
        });
    }

    public deleteButtonVisibleRoles() {
        [3, 4, 5, 6, 8, 9, 10, 11, 12].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).within(() => {
                cy.dataCy("role-delete").should("be.visible");
            });
        });
    }

    public deleteButtonNotVisibleRoles() {
        [0, 1, 2, 7].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).should("not.exist");
        });
    }

    public clickEditButtonUsers(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-edit").click();
        });
    }

    public clickEditButtonRoles() {
        cy.wait(500);
        cy.dataCy("role-edit").click();
    }

    public clickDeleteButtonUsers(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-delete").click();
        });
    }

    public clickDeleteButtonRoles() {
        cy.wait(500);
        cy.dataCy(`role-table-row-actions-0`).within(() => {
            cy.dataCy("role-delete").click();
        });
    }

    public clickAway() {
        cy.get(".v-card__title").click({ force: true });
        cy.wait(50);
    }

    public requiredFieldsValidationUsers(field: string) {
        switch (field) {
            case "FIRST_NAME":
                this.clickDataCy("user-first-name");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "LAST_NAME":
                this.clickDataCy("user-last-name");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "EMAIL":
                this.clickDataCy("user-email");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "ROLE":
                this.clickDataCy("user-roles");
                this.clickAway();
                cy.get(".v-messages__message").should("contain.text", "Select one or more");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public requiredFieldsValidationRoles() {
        this.clickDataCy("role-name");
        this.clickAway();
        this.assertRequiredText();
    }

    public assertRequiredText() {
        cy.get(".v-messages__message").should("contain.text", "Required");
    }

    public onlySaveWhenMandatoryFieldsEntered() {
        cy.dataCy("user-first-name").type("Added");
        this.assertAddUserButton("disabled");
        cy.dataCy("user-last-name").type("User");
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital");
        this.assertAddUserButton("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type(".com");
        this.clickAway();
        this.assertAddUserButton("enabled");
    }

    public enterNewRoleName() {
        cy.dataCy("role-name").type("Added role");
        this.clickAway();
    }

    public saveDisabledUnlessAllFIeldsEntered() {
        this.assertAddUserButton("enabled");
        cy.dataCy("user-first-name").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(12).click();
        this.clickAway();
        this.assertAddUserButton("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
        this.assertAddUserButton("enabled");
    }

    public editUsers() {
        cy.dataCy("user-first-name").clear();
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").clear();
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").clear();
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        this.clickAway();
    }

    public editRoles() {
        cy.dataCy("role-name").clear();
        cy.dataCy("role-name").type("Edited role");
        this.clickAway();
    }

    public assertPutRolesDetailsCorrect() {
        cy.intercept("PUT", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EDIT).as("Put");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT_TABLE,
        ).as("Get");
        this.clickDataCy("role-edit-confirm-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put").then((xhr) => {
            const actualRequest = new RolePostData(xhr.request.body);
            expect(actualRequest.name).to.eql("Edited role");
        });
    }

    public assertPostedDetailsCorrect() {
        cy.intercept("POST", "/users", ApiMocks.USER_MANAGEMENT_ADD_USER).as("Post");
        cy.intercept(
            "GET",
            "/users?search=&role=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        ).as("Get");
        this.clickDataCy("user-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post").then((xhr) => {
            const actualRequest = new UserDataPost(xhr.request.body);
            expect(actualRequest.firstName).to.eql("Added");
            expect(actualRequest.lastName).to.eql("User");
            expect(actualRequest.email).to.eql("added.user@answerdigital.com");
            expect(actualRequest.realmRoles[0].name).to.include("Admin");
            expect(actualRequest.realmRoles[1].name).to.include("Clinician");
            expect(actualRequest.realmRoles[2].name).to.include("User-Manager");
        });
    }

    public assertPutDetailsCorrect(user: GetAllUsersResponse) {
        cy.intercept("PUT", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_ADD_USER).as(
            "Put",
        );
        cy.intercept(
            "GET",
            "/users?search=&role=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        );
        this.clickDataCy("user-edit-confirm-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put").then((xhr) => {
            const actualRequest = new UserDataPost(xhr.request.body);
            expect(actualRequest.firstName).to.eql("Added");
            expect(actualRequest.lastName).to.eql("User");
            expect(actualRequest.email).to.eql("added.user@answerdigital.com");
            expect(actualRequest.realmRoles[0].name).to.include("Clinician");
            expect(actualRequest.realmRoles[1].name).to.include("User-Manager");
            expect(actualRequest.realmRoles[2].name).to.include("Admin");
        });
    }

    public errorAddingRole(statusCode: number) {
        cy.intercept("POST", "/roles", { statusCode: statusCode }).as("Post");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_ADD,
        ).as("Get");
        this.clickDataCy("role-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post");
    }

    public errorEditingRole(statusCode: number) {
        cy.intercept("PUT", "/roles/15", { statusCode: statusCode }).as("Put");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT,
        ).as("Get");
        this.clickDataCy("role-edit-confirm-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put");
    }

    public errorDeletingRole(statusCode: number) {
        cy.intercept("DELETE", "/roles/15", { statusCode: statusCode }).as("Delete");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT,
        ).as("Delete");
        this.clickDataCy("role-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Delete");
    }

    public assertPostedRoleCorrect() {
        cy.intercept("POST", "/roles", ApiMocks.USER_MANAGEMENT_ROLES_ADD).as("Post");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_ADD,
        ).as("Get");
        this.clickDataCy("role-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post").then((xhr) => {
            const actualRequest = new RolePostData(xhr.request.body);
            expect(actualRequest.name).to.eql("Added role");
        });
    }

    public assertAddUserButton(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("user-modal-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("user-modal-save").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public assertAddRoleButton(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("role-modal-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("role-modal-save").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public enterAddUserDetails() {
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(12).click();
        this.clickAway();
    }

    public duplicateRequest(url: string, selector: string) {
        cy.intercept(url, { statusCode: 409 }).as("Duplicate");
        this.clickDataCy(selector);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Duplicate"]);
    }

    public deleteUser(user: GetAllUsersResponse) {
        cy.intercept("DELETE", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_EMPTY).as(
            "Delete",
        );
        cy.intercept("GET", "https://localhost:8000/users?search=&role=&first=0&max=10", {}).as(
            "Get",
        );
        this.clickDataCy("user-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public assertDeleteRequestRoles() {
        cy.intercept("DELETE", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EMPTY).as("Delete");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10",
            ApiMocks.USER_MANAGEMENT_ROLES_EMPTY,
        ).as("Get");
        this.clickDataCy("role-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public assertEmptyTable(tableType: string) {
        cy.dataCy(`${tableType}-table-row-firstName-0`).should("not.exist");
    }

    public assertFieldsUser(user: GetAllUsersResponse) {
        cy.dataCy("user-first-name").click().should("have.value", user.users[0].firstName);
        cy.dataCy("user-last-name").click().should("have.value", user.users[0].lastName);
        cy.dataCy("user-email").click().should("have.value", user.users[0].email);
        cy.get(rolesDropdown).should("contain", user.users[0].realmRoles[0].name);
        cy.get(rolesDropdown).should("contain", user.users[0].realmRoles[1].name);
    }

    public assertFieldsRoles() {
        cy.dataCy("role-name").click().should("have.value", "Only role");
    }
}
