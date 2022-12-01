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
    GetAllUsersResponse,
    PaginatedRolesResponse,
    UserListItem,
    UserRoleListItem,
} from "@/models/user-management/UserManagement";
import {
    createAxiosInstance,
    ErrorMessageMap,
    isResultOk,
    provideDefaultResult,
} from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";

const errorMessagesUsers: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving users",
    put: "Something unexpected went wrong updating the user details",
    post: "Something unexpected went wrong creating the user",
    delete: "Something unexpected went wrong deleting the user",
};

const httpUsers = createAxiosInstance(errorMessagesUsers, true);

const errorMessagesRoles: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving roles",
    put: "Something unexpected went wrong updating the role details",
    post: "Something unexpected went wrong creating the role",
    delete: "Something unexpected went wrong deleting the role",
};

const httpRoles = createAxiosInstance(errorMessagesRoles, true);

interface QueryParams {
    search?: string;
    role?: string;
    page: number;
    itemsPerPage: number;
}

export async function getAllUsers(query: QueryParams): Promise<GetAllUsersResponse> {
    const params = new URLSearchParams({
        search: query.search ?? "",
        role: query.role ?? "",
        first: query.page === 1 ? "0" : `${query.page * query.itemsPerPage - query.itemsPerPage}`,
        max: `${query.itemsPerPage}`,
    });

    const response = await httpUsers.get<GetAllUsersResponse>(`/users?${params}`);

    const defaultData = { totalUserCount: 0, totalFilteredUserCount: 0, users: [] };

    return provideDefaultResult(response, defaultData);
}

export async function updateUserDetails(
    userId: string,
    user: UserListItem,
): Promise<AxiosResponse | AxiosError> {
    return httpUsers.put(`/users/${userId}`, user).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function createUser(user: UserListItem): Promise<AxiosResponse | AxiosError> {
    return httpUsers.post("/users", user).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function deleteUser(userId: string): Promise<boolean> {
    try {
        const result = await httpUsers.delete(`/users/${userId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function getAllRoles(): Promise<UserRoleListItem[]> {
    const response = await httpRoles.get<UserRoleListItem[]>("/roles/list");
    return provideDefaultResult(response, []);
}

export async function getPaginatedRoles(query: QueryParams): Promise<PaginatedRolesResponse> {
    const params = new URLSearchParams({
        search: query.search ?? "",
        first: query.page === 1 ? "0" : `${query.page * query.itemsPerPage - query.itemsPerPage}`,
        max: `${query.itemsPerPage}`,
    });

    const defaultData = { totalRolesCount: 0, totalFilteredRolesCount: 0, roles: [] };

    const response = await httpRoles.get<PaginatedRolesResponse>(`/roles?${params}`);
    return provideDefaultResult(response, defaultData);
}

export async function createRole(
    role: Pick<UserRoleListItem, "name">,
): Promise<AxiosResponse | AxiosError> {
    return httpRoles.post("/roles", role).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function updateRole(
    roleId: string,
    role: UserRoleListItem,
): Promise<AxiosResponse | AxiosError> {
    return httpRoles.put(`/roles/${roleId}`, role).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function deleteRole(roleId: string): Promise<boolean> {
    try {
        const result = await httpRoles.delete(`/roles/${roleId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}
