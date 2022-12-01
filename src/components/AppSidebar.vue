<!--
  Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <v-navigation-drawer v-model="drawer" app permanent expand-on-hover clipped mini-variant>
        <v-list dense nav>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                :to="{ name: item.route }"
                :data-cy="item.datacy"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { routes } from "@/router";

const accessibility = {
    title: "Accessibility Statement",
    icon: "mdi-human",
    datacy: "accessibility-button",
    route: "Accessibility",
    roles: [],
};

@Component
export default class AppSidebar extends Vue {
    // Declared as component data
    getRouteData(route: string) {
        const roles = routes.find((r) => r.name == route)?.meta?.requiredRoles;
        return {
            route,
            roles,
        };
    }

    // if user has no roles.
    getDefaultRoute() {
        return {
            title: "Application Repository",
            icon: "mdi-storefront",
            datacy: "app-store-button",
            ...this.getRouteData("ApplicationRepositoryList"),
        };
    }

    items = [
        {
            title: "System Dashboard",
            icon: "mdi-cog",
            datacy: "admin-button",
            ...this.getRouteData("AdminSystemDashboard"),
        },
        {
            title: "Payload Dashboard",
            icon: "mdi-family-tree",
            datacy: "admin-payload-button",
            ...this.getRouteData("AdminPayloadDashboard"),
        },
        {
            title: "Clinical Review",
            icon: "mdi-eye",
            datacy: "clinician-button",
            ...this.getRouteData("ClinicalReview"),
        },
        this.getDefaultRoute(),
        {
            title: "Export Destinations",
            icon: "mdi-application-export",
            datacy: "export-destinations-button",
            ...this.getRouteData("AdminExportConfiguration"),
        },
        {
            title: "User Management",
            icon: "mdi-account",
            datacy: "user-management-button",
            ...this.getRouteData("UserManagement"),
        },
        {
            title: "Workflows",
            icon: "mdi-file-tree",
            datacy: "workflows-button",
            ...this.getRouteData("Workflows"),
        },
    ];
    roles: string[] = [];
    drawer = false;

    mounted(): void {
        const realmAccess = this.$keycloak?.tokenParsed?.realm_access ?? Vue.prototype.localRoles;

        if (!realmAccess) {
            this.items = [this.getDefaultRoute()];
            return;
        }

        this.roles = realmAccess.roles ?? [];

        if (this.roles.length > 0) {
            this.items = this.items.filter((item) => {
                return this.roles.some((r) => item.roles.includes(r));
            });
        }

        if (this.roles.length == 0) {
            this.items = [this.getDefaultRoute()];
        }

        this.items.push(accessibility);

        EventBus.$on("toggleSidebar", (drawer: boolean) => {
            this.drawer = drawer;
        });
    }
}
</script>

<style scoped>
.v-list-item--active {
    background-color: #61366e;
    color: #fff !important;
}
</style>
