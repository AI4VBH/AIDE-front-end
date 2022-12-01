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
    <v-container fluid>
        <v-container fluid class="mt-3 mb-7 px-7">
            <v-row>
                <v-col class="col-md-7 col-xl-9">
                    <h2 class="section-title">User Management</h2>
                </v-col>
            </v-row>

            <v-row>
                <v-tabs v-model="currentTab" color="purple darken-1">
                    <v-tab v-for="tab in tabs" :key="tab" :data-cy="`user-management-tab-${tab}`">
                        {{ tab }}
                    </v-tab>

                    <v-tabs-items v-model="currentTab">
                        <UserTabItem :roles="roles" />
                        <UserRolesTabItem @rolesChanged="fetchAllRoles()" />
                    </v-tabs-items>
                </v-tabs>
            </v-row>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserTabItem from "@/components/user-management/UserTabItem.vue";
import UserRolesTabItem from "@/components/user-management/UserRolesTabItem.vue";
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import { getAllRoles } from "@/api/user-management/UserManagementService";

@Component({
    metaInfo: {
        title: "Users",
    },
    components: {
        UserTabItem,
        UserRolesTabItem,
    },
})
export default class UserManagement extends Vue {
    tabs = ["Users", "Roles"];
    currentTab = "Users";

    roles: UserRoleListItem[] = [];

    async mounted() {
        this.fetchAllRoles();
    }

    async fetchAllRoles() {
        this.roles = await getAllRoles();
        this.roles = this.roles.sort((a: UserRoleListItem, b: UserRoleListItem) =>
            a.name.localeCompare(b.name),
        );
    }
}
</script>
