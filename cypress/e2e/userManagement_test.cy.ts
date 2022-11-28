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

import UserManagement from "pages/userManagement";
import { UserData } from "../data/user-management/users";
import { RoleData } from "data/user-management/roles";

const userManagementPage = new UserManagement();
const allUsers = UserData.GET_ALL_USERS;
const filteredUsers = UserData.FILTERED_USERS;
const addUser = UserData.USER_DATA_ADD_USER;
const initialUser = UserData.USER_DATA_INITIAL_USER;
const SearchUser = UserData.USER_DATA_SEARCH;
const paginationUsers = UserData.USER_DATA_PAGINATION;
const allRoles = RoleData.ROLE_DATA_1;

describe("users table", () => {
    beforeEach(() => {
        userManagementPage.initPage();
    });
    it("When I navigate to the page, users tab is selected by default", () => {
        userManagementPage.tabActive();
    });
    it("'Total number of users' displays the correct number of users", () => {
        userManagementPage.assertTotalUsers(allUsers);
    });
    it(`The users table is populated with the data returned from the API`, () => {
        userManagementPage.assertUserTable(allUsers);
    });
    it(`I can search the users table`, () => {
        userManagementPage.searchUserTable("Susan" as string);
        userManagementPage.assertCorrectUserDisplayed(SearchUser as UserData);
    });
    ["User-Manager", "Clinician", "Admin"].forEach((role) => {
        it(`${role} is displayed in the dropdown filter`, () => {
            userManagementPage.assertRoles(role);
        });
    });
    it(`Selecting a role in the dropdown should filter users by that role`, () => {
        userManagementPage.selectElementInDropdown(0);
        userManagementPage.assertRowContainsType(filteredUsers);
    });
    it("I can view next page", () => {
        userManagementPage.paginationRequestUsers();
        userManagementPage.assertSecondPageUsers(paginationUsers);
    });
});

describe("Add/Edit/Delete users", () => {
    beforeEach(() => {
        userManagementPage.initPageOneUser();
    });
    ["FIRST_NAME", "LAST_NAME", "EMAIL", "ROLE"].forEach((field) => {
        it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.requiredFieldsValidationUsers(field);
        });
    });
    it("'Add user' is inactive until all fields are populated", () => {
        userManagementPage.clickDataCy("add-user");
        userManagementPage.onlySaveWhenMandatoryFieldsEntered();
    });
    it(`The correct roles are displayed in the dropdown filter`, () => {
        userManagementPage.clickDataCy("add-user");
        userManagementPage.clickDataCy("user-roles");
        ["Admin", "Clinician", "User-Manager"].forEach((role) => {
            userManagementPage.assertRoles(role);
        });
    });
    it("Validation on adding a user with an existing email", () => {
        userManagementPage.clickDataCy("add-user");
        userManagementPage.enterAddUserDetails();
        userManagementPage.duplicateRequest("/users", "user-modal-save");
        userManagementPage.assertErrorContainer("User with this email address already exists");
    });
    it("I can add a user", () => {
        userManagementPage.clickDataCy("add-user");
        userManagementPage.enterAddUserDetails();
        userManagementPage.assertPostedDetailsCorrect();
        userManagementPage.assertUserTable(addUser);
    });
    it("Clicking on Edit button on a row opens up the modal with user details populated", () => {
        userManagementPage.clickEditButtonUsers(0);
        userManagementPage.assertFieldsUser(initialUser);
    });
    it("'Save' is inactive unless all fields are populated", () => {
        userManagementPage.clickEditButtonUsers(0);
        userManagementPage.saveDisabledUnlessAllFIeldsEntered();
    });
    it("Validation on editing a user with an existing email", () => {
        userManagementPage.clickEditButtonUsers(0);
        userManagementPage.editUsers();
        userManagementPage.clickDataCy("user-modal-save");
        userManagementPage.duplicateRequest("/users/1", "user-edit-confirm-continue");
        userManagementPage.assertErrorContainer("User with this email address already exists");
    });
    it("I can edit a user", () => {
        userManagementPage.clickEditButtonUsers(0);
        userManagementPage.editUsers();
        userManagementPage.clickDataCy("user-modal-save");
        userManagementPage.assertPutDetailsCorrect(initialUser);
        userManagementPage.assertUserTable(addUser);
    });
    it("I can delete a user", () => {
        userManagementPage.clickDeleteButtonUsers(0);
        userManagementPage.deleteUser(initialUser);
        userManagementPage.assertEmptyTable("user");
    });
});

describe("Roles", () => {
    beforeEach(() => {
        userManagementPage.initPageRoles();
        cy.injectAxe();
    });
    it("Roles that are editable have visible edit/delete buttons", () => {
        userManagementPage.editButtonVisibleRoles();
        userManagementPage.deleteButtonVisibleRoles();
    });
    it("Roles that are not editable do not have visible edit/delete buttons", () => {
        userManagementPage.editButtonNotVisibleRoles();
        userManagementPage.deleteButtonNotVisibleRoles();
    });
    it("'Total number of roles are displayed", () => {
        userManagementPage.assertTotalRoles(allRoles);
    });
    it(`The roles table is populated with the data returned from the API`, () => {
        userManagementPage.assertTableDataCorrectAllRoles();
    });
    it(`I can search the roles table`, () => {
        userManagementPage.searchRoleTable("Clinician" as string);
        userManagementPage.assertCorrectRoleDisplayed();
    });
    it("I can view the next page", () => {
        userManagementPage.paginationRequestRoles();
        userManagementPage.assertSecondPageRoles();
    });
    it("I can change how many roles I view per page", () => {
        userManagementPage.paginationRequestFiveRolesPerPage();
    });
});

describe("Add/Edit/Delete list of roles", () => {
    beforeEach(() => {
        userManagementPage.initPageOneRole();
    });
    it(`Validation should be displayed to the user to indicate that the 'Name' field is required`, () => {
        userManagementPage.clickDataCy("add-role");
        userManagementPage.requiredFieldsValidationRoles();
    });
    it("'Add role' is inactive until 'Name' field is populated'", () => {
        userManagementPage.clickDataCy("add-role");
        userManagementPage.assertAddRoleButton("disabled");
        userManagementPage.enterNewRoleName();
        userManagementPage.assertAddRoleButton("enabled");
    });
    it("Validation on adding a role with an existing name", () => {
        userManagementPage.clickDataCy("add-role");
        userManagementPage.enterNewRoleName();
        userManagementPage.duplicateRequest("/roles", "role-modal-save");
        userManagementPage.assertErrorContainer("Role with this name already exists");
    });
    it("I can add a role", () => {
        userManagementPage.clickDataCy("add-role");
        userManagementPage.enterNewRoleName();
        userManagementPage.assertPostedRoleCorrect();
        userManagementPage.assertTableDataCorrectRoles();
    });
    it("Clicking on Edit button on a row opens up the modal with role name populated", () => {
        userManagementPage.clickEditButtonRoles();
        userManagementPage.assertFieldsRoles();
    });
    it("Validation on editing a role with an existing name", () => {
        userManagementPage.clickEditButtonRoles();
        userManagementPage.editRoles();
        userManagementPage.clickDataCy("role-modal-save");
        userManagementPage.duplicateRequest("/roles/15", "role-edit-confirm-continue");
        userManagementPage.assertErrorContainer("Role with this name already exists");
    });
    it("I can edit a role", () => {
        userManagementPage.clickEditButtonRoles();
        userManagementPage.editRoles();
        userManagementPage.clickDataCy("role-modal-save");
        userManagementPage.assertPutRolesDetailsCorrect();
        userManagementPage.assertTableDataCorrectEditedRoles();
    });
    it("Selecting delete sends a delete request for that role", () => {
        userManagementPage.clickDeleteButtonRoles();
        userManagementPage.assertDeleteRequestRoles();
        userManagementPage.assertEmptyTable("role");
    });
});

describe("Error statuscode responses", () => {
    [400, 404, 500].forEach((statusCode) => {
        describe(`Users - ${statusCode}`, () => {
            beforeEach(() => {
                userManagementPage.initPageOneUser();
            });

            const addUserErrorMessage = "Something unexpected went wrong creating the user";
            const editErrorMessage = "Something unexpected went wrong updating the user details";

            it(`Toast displayed if a ${statusCode} error is returned on adding new user`, () => {
                userManagementPage.clickDataCy("add-user");
                userManagementPage.enterAddUserDetails();
                userManagementPage.errorAddUser(statusCode);
                userManagementPage.assertToast(addUserErrorMessage);
            });

            it(`Toast displayed if a ${statusCode} error is returned on editing existing user`, () => {
                userManagementPage.clickEditButtonUsers(0);
                userManagementPage.clickDataCy("user-modal-save");
                userManagementPage.errorEditUser(statusCode);
                userManagementPage.assertToast(editErrorMessage);
            });
        });
    });

    [400, 404, 500].forEach((statusCode) => {
        describe(`Roles - ${statusCode}`, () => {
            beforeEach(() => {
                userManagementPage.initPageOneRole();
            });
            const addRoleErrorMessage = "Something unexpected went wrong creating the role";
            const editErrorMessage = "Something unexpected went wrong updating the role details";

            it(`Toast displayed if a ${statusCode} error is returned on adding new role`, () => {
                userManagementPage.clickDataCy("add-role");
                userManagementPage.enterNewRoleName();
                userManagementPage.errorAddingRole(statusCode);
                userManagementPage.assertToast(addRoleErrorMessage);
            });

            it(`Toast displayed if a ${statusCode} error is returned on editing existing role`, () => {
                userManagementPage.clickEditButtonRoles();
                userManagementPage.editRoles();
                userManagementPage.clickDataCy("role-modal-save");
                userManagementPage.errorEditingRole(statusCode);
                userManagementPage.assertToast(editErrorMessage);
            });
        });
    });
});
