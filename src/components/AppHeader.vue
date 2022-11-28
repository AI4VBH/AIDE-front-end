<!--
  Copyright 2022 Crown Copyright

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
    <v-app-bar app color="#fff" clipped-left class="elevation-1">
        <div class="ml-6 mr-5" data-cy="logo">
            <router-link :to="{ name: getDefaultDestinationForUser() }">
                <v-img class="mx-auto" src="@/assets/NHSlogo.svg" height="33px" width="83px" />
            </router-link>
        </div>

        <v-divider vertical />

        <div class="mx-3" data-cy="logo">
            <router-link to="/">
                <v-img class="mx-auto" src="@/assets/AIClogo.svg" height="64px" width="65px" />
            </router-link>
        </div>

        <v-divider vertical />

        <v-toolbar-title class="ml-4">{{ pageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon disabled aria-label="notification bell">
            <v-icon>mdi-bell</v-icon>
        </v-btn>

        <v-menu bottom left offset-y offset-overflow :nudge-left="80">
            <template v-slot:activator="{ on, attrs }">
                <v-btn text v-on="on" aria-label="log out button">
                    <v-icon v-bind="attrs" class="mr-2">mdi-account-circle </v-icon>
                    {{ name }}
                    <v-icon class="ml-2">mdi-chevron-down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list dense>
                    <v-list-item-group color="primary">
                        <v-list-item @click="logout()">
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import { getDefaultDestinationForUser } from "@/utils/user-utilities";

@Component
export default class AppHeader extends Vue {
    // Class properties will be component data
    pageTitle = "Page Title";
    name = "";
    getDefaultDestinationForUser = getDefaultDestinationForUser;

    // Methods will be component methods
    mounted(): void {
        this.updatePageTitle();
        if (this.$keycloak?.authenticated) {
            this.name = this.$keycloak?.tokenParsed?.name ?? "";
        } else {
            if (!this.$keycloak && Vue.prototype.isLocal) {
                this.name = "Dev User";
                return;
            }
            this.name = "Unauthenticated User";
        }
    }

    updatePageTitle(): void {
        switch (this.$route.name) {
            case "AdminSystemDashboard":
                this.pageTitle = "Admin System Dashboard";
                break;

            case "AdminPayloadDashboard":
                this.pageTitle = "Admin Payload Dashboard";
                break;

            case "ClinicalReview":
                this.pageTitle = "Model outputs for clinical review";
                break;

            case "ClinicalReviewViewer":
                this.pageTitle = "Model outputs for clinical review";
                break;

            case "ApplicationRepositoryList":
                this.pageTitle = "Application Repository";
                break;

            case "ApplicationRepositoryDetail":
                this.pageTitle = "Application Repository";
                break;

            case "UserManagement":
                this.pageTitle = "User Management";
                break;

            case "Workflows":
                this.pageTitle = "Workflow Management";
                break;

            case "WorkflowEditor":
                this.pageTitle = "Workflow Manager";
                break;

            case "AdminExportConfiguration":
                this.pageTitle = "Export Destination Configuration";
                break;
        }
    }

    logout(): void {
        const logout = this.$keycloak?.logoutFn;

        if (logout !== undefined) {
            sessionStorage.clear();
            logout();
        }
    }

    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        this.updatePageTitle();
    }
}
</script>

<style>
.v-toolbar__content {
    padding: 0px !important;
}
</style>
