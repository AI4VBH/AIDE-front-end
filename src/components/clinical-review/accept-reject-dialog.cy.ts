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

import AcceptRejectDialog from "./accept-reject-dialog.vue";

describe("<accept-reject-dialog />", () => {
    it("renders accept modal", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: false,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("accept-reject-modal-title").should("contain.text", "Accept");
        cy.dataCy("accept-reject-modal-title").should("contain.text", "AMAZING AI");
        cy.dataCy("action-signing").should("contain.text", "This action will be signed by you");
        cy.dataCy("action-description").should("be.enabled");
        cy.dataCy("action-cancel").should("be.enabled");
        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
    });

    it("renders reject modal", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: true,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("accept-reject-modal-title").should("contain.text", "Reject");
        cy.dataCy("accept-reject-modal-title").should("contain.text", "AMAZING AI");
        cy.dataCy("action-signing").should("contain.text", "This action will be signed by you");
        cy.dataCy("action-description").should("be.enabled");
        cy.dataCy("reject-reason-text").should("contain.text", "Reason for rejection");
        cy.dataCy("reject-reason").should("be.enabled");
        cy.dataCy("action-cancel").should("be.enabled");
        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
    });
});

describe("<accept-reject-dialog, validation for accept />", () => {
    it("enables accept button when checkbox is clicked", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: false,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-accept").should("not.have.class", "v-btn--disabled");
    });
    it("keeps accept button disabled when only description", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: false,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
        cy.dataCy("action-description").type("Description Goes Here");
        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
    });
    it("disables accept button and shows validation message when selecting and then deselecting the checkbox permission", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: false,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-accept").should("not.have.class", "v-btn--disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-accept").should("have.class", "v-btn--disabled");
        cy.get(".v-messages__message").should("contain.text", "You need to accept before saving");
    });
});

describe("<accept-reject-dialog, validation for reject />", () => {
    it("enables reject button when a non-Other reason is selected and the checkbox is clicked", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: true,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.get("[data-cy=reject-reason]").type("Input{enter}", { force: true });
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");
        cy.dataCy("action-description").type("Description Goes Here");
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");
    });
    it("enables reject button when Other reason is selected and the checkbox is clicked", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: true,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.get("[data-cy=reject-reason]").type("Other{enter}", { force: true });
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.dataCy("action-description").type("Description Goes Here");
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
    });
    it("disables reject button and shows validation message when selecting and then deselecting the checkbox permission or reason", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: true,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.get("[data-cy=reject-reason]").type("Other{enter}", { force: true });
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-description").type("Description Goes Here");
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");

        cy.dataCy("action-accept-permission").click({ force: true });
        cy.get(".v-messages__message").should("contain.text", "You need to accept before saving");
        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.dataCy("action-accept-permission").click({ force: true });
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");

        cy.dataCy("action-description").focus().clear();
        cy.get(".v-messages__message").should("contain.text", "Required");
        cy.dataCy("action-reject").should("have.class", "v-btn--disabled");
        cy.dataCy("action-description").type("Description Goes Here");
        cy.dataCy("action-reject").should("not.have.class", "v-btn--disabled");
    });
});
