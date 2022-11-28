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

import RoleModal from "./RoleModal.vue";

describe("<RoleModal />", () => {
    it("renders the modal with no role", () => {
        cy.mount(RoleModal, { propsData: { role: {} } });
        cy.get("[data-cy=role-modal-title]").should("contain.text", "Add");
        cy.get("[data-cy=role-modal-save]").should("be.disabled");
    });

    it("renders modal with existing role", () => {
        // see: https://test-utils.vuejs.org/guide/
        const role = { id: "some-id", name: "Some role" };
        cy.mount(RoleModal, { propsData: { role } });

        cy.get("[data-cy=role-modal-title]").should("contain.text", "Edit");
        cy.get("[data-cy=role-modal-save]").should("be.enabled");
    });

    it("renders validation message when name is deleted", () => {
        // see: https://test-utils.vuejs.org/guide/
        const role = { id: "some-id", name: "Some role" };
        cy.mount(RoleModal, { propsData: { role } });

        cy.get("[data-cy=role-modal-title]").should("contain.text", "Edit");
        cy.get("[data-cy=role-modal-save]").should("be.enabled");

        cy.get("[data-cy=role-name]").clear();
        cy.get("[data-cy=role-modal-save]").should("be.disabled");
    });
});
