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

import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import UserModal from "./UserModal.vue";

describe("<UserModal />", () => {
    it("renders the modal with no user", () => {
        const roles: UserRoleListItem[] = [
            {
                id: "admin",
                name: "admin",
            },
        ];

        cy.mount(UserModal, { propsData: { roles, user: {} } });
        cy.get("[data-cy=user-modal-save]").should("be.disabled");
    });

    it("renders the modal with user", () => {
        const roles: UserRoleListItem[] = [
            {
                id: "admin",
                name: "admin",
            },
        ];

        const user: UserListItem = {
            id: "some-user",
            firstName: "Joe",
            lastName: "Bloggs",
            enabled: true,
            realmRoles: [
                {
                    id: "admin",
                    name: "admin",
                },
            ],
            email: "joe.bloggs@email.com",
        };

        cy.mount(UserModal, { propsData: { roles, user } });
        cy.get("[data-cy=user-modal-save]").should("be.enabled");
    });
});
