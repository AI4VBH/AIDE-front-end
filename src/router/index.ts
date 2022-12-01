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
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AccessibilityStatement from "@/views/AccessibilityStatement.vue";
import AdminSystemDashboard from "@/views/AdminSystemDashboard.vue";
import AdminDicomConfiguration from "@/views/AdminDicomConfiguration.vue";
import AdminPayloadDashboard from "@/views/AdminPayloadDashboard.vue";
import ClinicalReview from "@/views/ClinicalReview.vue";
import AppRepo from "@/views/AppRepo.vue";
import ListView from "@/components/AppRepo/ListView/ListView.vue";
import DetailView from "@/components/AppRepo/DetailView/DetailView.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import UserManagement from "@/views/UserManagement.vue";
import Workflows from "@/views/Workflows.vue";
import WorkflowEditor from "@/views/WorkflowEditor.vue";
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";
import { getDefaultDestinationForUser, UserRole } from "@/utils/user-utilities";

Vue.use(VueRouter);

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const routes: Array<RouteConfig> = [
    {
        path: "/accessibility",
        name: "Accessibility",
        component: AccessibilityStatement,
    },
    {
        path: "/admin-system-dashboard",
        name: "AdminSystemDashboard",
        component: AdminSystemDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.admin],
        },
    },
    {
        path: "/admin-payload-dashboard",
        name: "AdminPayloadDashboard",
        component: AdminPayloadDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.admin],
        },
    },
    {
        path: "/admin-export-configuration",
        name: "AdminExportConfiguration",
        component: AdminDicomConfiguration,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.admin],
        },
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.clinician],
        },
    },
    {
        path: "/application-repository",
        component: AppRepo,
        name: "ApplicationRepositoryList",
        children: [
            {
                path: "/",
                name: "ApplicationRepositoryList",
                component: ListView,
                beforeEnter: roleAuthenticatedRoute,
                meta: {
                    breadCrumb: [
                        {
                            text: "Application Repository",
                        },
                    ],
                    requiredRoles: [UserRole.deployer],
                },
            },
            {
                path: ":application_id",
                name: "ApplicationRepositoryDetail",
                component: DetailView,
                beforeEnter: roleAuthenticatedRoute,
                meta: {
                    breadCrumb(route: Route) {
                        const application_id = route.params.application_id;
                        return [
                            {
                                text: "Application Repository",
                                to: { name: "ApplicationRepositoryList" },
                            },
                            {
                                text: application_id,
                            },
                        ];
                    },
                    requiredRoles: [UserRole.deployer],
                },
            },
        ],
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.deployer, UserRole.admin],
        },
    },
    {
        path: "/user-management",
        name: "UserManagement",
        component: UserManagement,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.user_management],
        },
    },
    {
        path: "/workflows",
        name: "Workflows",
        component: Workflows,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.admin],
        },
    },
    {
        path: "/workflow-editor/:workflow_id?",
        name: "WorkflowEditor",
        component: WorkflowEditor,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [UserRole.admin],
        },
    },
    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: Unauthorized,
    },
    {
        path: "/*",
        beforeEnter: async (to, _from, next) => {
            if (process.env.VUE_APP_AUTH_ENABLED !== "true") {
                return next({ name: "AdminSystemDashboard" });
            }

            while (!Vue.prototype.$keycloak?.createLoginUrl) {
                await sleep(100);
            }

            if (!Vue.prototype.$keycloak?.authenticated) {
                const login = Vue.prototype.$keycloak.login;

                if (!login) {
                    return;
                }

                login({ redirectUri: window.location.origin });
            }

            Vue.prototype.$keycloak.keycloak.updateToken(70).then(() => {
                const redirect = window.sessionStorage.getItem("currentPage");
                const paramsStr = window.sessionStorage.getItem("params");
                const params = paramsStr ? JSON.parse(paramsStr) : undefined;

                return next({
                    name: redirect ?? getDefaultDestinationForUser(),
                    params: params,
                    replace: true,
                });
            });
        },
    },
];

function roleAuthenticatedRoute(to: Route, _: Route, next: NavigationGuardNext<Vue>) {
    const { requiredRoles } = to.meta || {};

    if (process.env.VUE_APP_AUTH_ENABLED !== "true" || !requiredRoles) {
        return next();
    }

    const keycloak: VueKeycloakInstance = Vue.prototype.$keycloak;

    if (!keycloak) {
        return next({ name: "InternalServerError" });
    }

    if (!keycloak?.authenticated && keycloak.login) {
        keycloak.login({ redirectUri: `${window.location.origin}/${to.path}` });

        return;
    }

    const roles: string[] = keycloak.tokenParsed?.realm_access?.roles ?? [];
    const hasRoles = requiredRoles.some((r: string) => roles.includes(r));

    if (!hasRoles) {
        return next({ name: "Unauthorized" });
    }

    keycloak.keycloak?.updateToken(70);
    return next();
}

const router = new VueRouter({
    routes,
    mode: "history",
});

router.afterEach((to) => {
    if (window.location.pathname === "/" || !to.name || to.name === "Unauthorized") {
        return;
    }

    window.sessionStorage.setItem("currentPage", to.name);

    if (to.params) {
        window.sessionStorage.setItem("params", JSON.stringify(to.params));
    }
});

export default router;
