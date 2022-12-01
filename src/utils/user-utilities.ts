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

import Vue from "vue";

export enum UserRole {
    admin = "admin",
    clinician = "clinician",
    user_management = "user_management",
    deployer = "deployer",
}

export const getDefaultDestinationForUser = () => {
    if (process.env.VUE_APP_AUTH_ENABLED === "false") {
        return "AdminSystemDashboard";
    }

    const noRole = () => false;
    const hasRealmRole = Vue.prototype.$keycloak.hasRealmRole ?? noRole;

    if (hasRealmRole(UserRole.admin)) {
        return "AdminSystemDashboard";
    } else if (hasRealmRole(UserRole.clinician)) {
        return "ClinicalReview";
    } else if (hasRealmRole(UserRole.deployer)) {
        return "ApplicationRepositoryList";
    } else if (hasRealmRole(UserRole.user_management)) {
        return "UserManagement";
    }

    return "Unauthorized";
};
