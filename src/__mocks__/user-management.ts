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

import { rest } from "msw";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";

const users: UserListItem[] = [
    {
        id: "17867604-8366-4173-b251-e7ea8ebfd4c4",
        firstName: "Evert",
        lastName: "Von Superlonglastnameandwewanttoseehowitlooks",
        email: "evert.von@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "7255786a-fb27-47cc-aac8-535662f59ccb",
        firstName: "Timmothy",
        lastName: "Yost",
        email: "timmothy.yost@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
            {
                id: "8s9ea60ac-7b29-4013-9733-845801b90e21",
                name: "developer admin",
                editable: true,
            },
        ],
    },
    {
        id: "dc739c25-3eb2-4dd5-813c-db8ecd4df64f",
        firstName: "Lourdes",
        lastName: "Howell",
        email: "lourdes.howell@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "4d1ea88c-e967-43b0-b66e-a655bce711a4",
        firstName: "Reece",
        lastName: "Braun",
        email: "reece.braun@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "692df91d-d912-4d7f-8684-89964e650d06",
        firstName: "Kyle",
        lastName: "Tillman",
        email: "kyle.tillman@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "652b088a-8fd6-4e11-9ae1-826919ae2837",
        firstName: "Fritz",
        lastName: "Murphy",
        email: "fritz.murphy@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "270cb301-7b6c-427d-be78-b1dded42d111",
        firstName: "Martine",
        lastName: "Ryan",
        email: "martine.ryan@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "72d8182b-12f0-4efa-962a-ae1e58c63508",
        firstName: "Justice",
        lastName: "Robel",
        email: "justice.robel@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "56da0530-ff2d-4099-b96a-605adb747323",
        firstName: "Leila",
        lastName: "Heidenreich",
        email: "leila.heidenreich@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "0e2408c9-1a3c-4e6e-879c-41853c27f7b0",
        firstName: "Carlo",
        lastName: "Turner",
        email: "carlo.turner@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "adbcc05d-ebe5-4b9a-8e6c-e4647a268fdc",
        firstName: "Candice",
        lastName: "Collier",
        email: "candice.collier@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "346a2552-c11e-4b1a-858b-9eb29f23e497",
        firstName: "June",
        lastName: "Sporer",
        email: "june.sporer@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "f181a8ef-0a7a-4d6e-b4bc-d5e4e9fddc12",
        firstName: "Rahsaan",
        lastName: "Price",
        email: "rahsaan.price@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
        ],
    },
    {
        id: "7aead6e4-b073-4ef9-afd7-4ce6bf407071",
        firstName: "Vince",
        lastName: "Casper",
        email: "vince.casper@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "858294fe-79da-4a40-983c-6740b9f5b891",
        firstName: "Montana",
        lastName: "Kovacek",
        email: "montana.kovacek@example.com",
        enabled: true,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "758e8410-ea53-4d02-9f6d-1d222db63bf2",
        firstName: "Llewellyn",
        lastName: "McLaughlin",
        email: "llewellyn.mclaughlin@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
    {
        id: "0d078616-e9a5-4ea6-8446-dbb53a2df70d",
        firstName: "Rebeka",
        lastName: "Walsh",
        email: "rebeka.walsh@example.com",
        enabled: false,
        realmRoles: [
            {
                id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
                name: "admin",
            },
            {
                id: "9e5d60ac-7b29-4013-9733-845801b90e21",
                name: "clinician",
            },
        ],
    },
];

const roles: UserRoleListItem[] = [
    {
        id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "admin",
        editable: false,
    },
    {
        id: "9e5d60ac-7b29-4013-9733-845801b90e21",
        name: "clinician",
        editable: false,
    },
    {
        id: "1a9e60ac-7b29-4013-9733-845801b90e21",
        name: "deployer",
        editable: false,
    },
    {
        id: "8e9e60ac-7b29-4013-9733-845801b90e21",
        name: "developer",
        editable: true,
    },
    {
        id: "4e9e60ac-7b29-4013-9733-845801b90e21",
        name: "user",
        editable: true,
    },
    {
        id: "73657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "otheruser",
        editable: true,
    },
    {
        id: "9g5d60ac-7b29-4013-9733-845801b90e21",
        name: "admin-clinician-developer-user-clinician-user-admin-user-admin-admin-clinician-developer-user-clinician-user-admin-user-admin-admin-clinician-developer-user-clinician-user-admin-user-admin",
        editable: true,
    },
    {
        id: "8s9ea60ac-7b29-4013-9733-845801b90e21",
        name: "developer admin",
        editable: true,
    },
    {
        id: "9g5d60assc-7b29-4013-9733-845801b90e21",
        name: "user-clinician-user-admin-user-admin",
        editable: true,
    },
    {
        id: "8s9essa60ac-7b29-4013-9733-845801b90e21",
        name: "admin2",
        editable: true,
    },
    {
        id: "9g5dss60ac-7b29-4013-9733-845801b90e21",
        name: "admin-user-admin-user-admin",
        editable: true,
    },
    {
        id: "8s9essa60ac-7b29-4013-9733-845801b90e21",
        name: "developer2",
        editable: true,
    },
];

export const userManagementHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/users`, (req, res, ctx) => {
        const first = req.url.searchParams.get("first") || "0";
        const max = req.url.searchParams.get("max") || "0";
        const search = req.url.searchParams.get("search");

        const start = parseInt(first);
        const end = parseInt(max) + parseInt(first);

        let filtered: UserListItem[] = users;
        let totalFilteredUsers = users.length;

        if (search) {
            filtered = filtered.filter((u) => {
                const searchText = search.toLocaleLowerCase();

                return (
                    u.firstName.toLocaleLowerCase().includes(searchText) ||
                    u.lastName.toLocaleLowerCase().includes(searchText) ||
                    u.email.toLocaleLowerCase().includes(searchText)
                );
            });

            totalFilteredUsers = filtered.length;
        }

        filtered = filtered.slice(start, end > users.length ? users.length : end);

        return res(
            ctx.json({
                totalUserCount: users.length,
                totalFilteredUserCount: totalFilteredUsers,
                users: filtered,
            }),
        );
    }),
    rest.post(`${window.FRONTEND_API_HOST}/users`, (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/users/:userId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/users/:userId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/roles/list`, (_, res, ctx) => {
        return res(ctx.json(roles));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/roles`, (req, res, ctx) => {
        const first = req.url.searchParams.get("first") || "0";
        const max = req.url.searchParams.get("max") || "0";
        const search = req.url.searchParams.get("search");

        const start = parseInt(first);
        const end = parseInt(max) + parseInt(first);

        let filtered: UserRoleListItem[] = roles;
        let totalFilteredRolesCount = roles.length;

        if (search) {
            filtered = filtered.filter((u) => {
                const searchText = search.toLocaleLowerCase();

                return u.name.toLocaleLowerCase().includes(searchText);
            });

            totalFilteredRolesCount = filtered.length;
        }

        filtered = filtered.slice(start, end > roles.length ? roles.length : end);

        return res(
            ctx.json({
                totalRolesCount: roles.length,
                totalFilteredRolesCount,
                roles: filtered,
            }),
        );
    }),
    rest.post(`${window.FRONTEND_API_HOST}/roles`, (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/roles/:roleId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/roles/:roleId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
