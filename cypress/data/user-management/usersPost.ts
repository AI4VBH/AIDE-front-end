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

import { UserRoleListItem, UserListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class UserDataPost implements UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    email: string;
    realmRoles: UserRoleListItem[];

    constructor(getAllUsersResponse: UserListItem) {
        this.id = getAllUsersResponse.id;
        this.firstName = getAllUsersResponse.firstName;
        this.lastName = getAllUsersResponse.lastName;
        this.email = getAllUsersResponse.email;
        this.realmRoles = getAllUsersResponse.realmRoles;
    }

    public static GET_ALL_USERS: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS,
    );
    public static USER_DATA_ADD_USER: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_ADD_USER,
    );
    public static USER_DATA_INITIAL_USER: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_ONE_USER,
    );
    public static USER_DATA_SEARCH: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_SEARCH,
    );
    public static USER_DATA_PAGINATION: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_PAGINATION,
    );
}
