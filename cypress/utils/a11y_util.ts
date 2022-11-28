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

import axe from "axe-core";
import { Options } from "cypress-axe";

export function nodeTerminal(violations: axe.Result[]) {
    cy.task(
        "log",
        `${violations.length} accessibility violation${violations.length === 1 ? "" : "s"} ${
            violations.length === 1 ? "was" : "were"
        } detected`,
    );
    // pluck specific keys to keep the table readable
    const violationData: Array<any> = violations.map(
        ({ id, impact, description, nodes, helpUrl }) => ({
            id,
            impact,
            description,
            nodes: nodes.length,
            helpUrl,
        }),
    );

    cy.task("table", violationData);
}

export const a11yConfig: Options = {
    runOnly: {
        type: "tags",
        values: ["wcag21a", "wcag21aa", "wcag2a", "wcag2aa"],
    },
};
