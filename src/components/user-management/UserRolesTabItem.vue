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
    <v-tab-item>
        <div v-if="!loading && rolesList !== undefined">
            <v-card class="px-4 py-4">
                <div class="d-flex mb-4 justify-space-between">
                    <div class="text-h5">{{ userRoleCount }}</div>
                    <div class="d-flex align-center">
                        <div class="mr-6">
                            <v-text-field
                                outlined
                                dense
                                hide-details
                                clearable
                                :append-icon="tableSearch ? '' : 'mdi-magnify'"
                                label="Search by name"
                                v-model="tableSearch"
                                data-cy="role-search-input"
                            ></v-text-field>
                        </div>
                        <v-btn class="primary-button" data-cy="add-role" @click="createNewRole">
                            Add new role
                            <v-icon class="ml-1">mdi-plus</v-icon>
                        </v-btn>
                    </div>
                </div>
                <v-card elevation="1">
                    <v-data-table
                        :headers="roleHeaders"
                        :items="rolesList"
                        :search="tableSearch"
                        :server-items-length="totalFilteredRoles"
                        :options.sync="tableOptions"
                        :footer-props="{ itemsPerPageOptions: [5, 10] }"
                        class="roles-table"
                    >
                        <template v-slot:item="{ item, index }">
                            <tr :data-cy="`role-table-row-${index}`">
                                <td
                                    class="text-start font-weight-bold"
                                    :data-cy="`role-table-row-name-${index}`"
                                >
                                    {{ item.name }}
                                </td>
                                <td
                                    v-if="item.editable"
                                    class="text-start"
                                    :data-cy="`role-table-row-actions-${index}`"
                                >
                                    <v-btn
                                        small
                                        elevation="0"
                                        class="mr-2 secondary-button"
                                        aria-label="edit role"
                                        data-cy="role-edit"
                                        @click="
                                            editRoleDetails({
                                                id: item.id,
                                                name: item.name,
                                                editable: true,
                                            })
                                        "
                                    >
                                        Edit
                                    </v-btn>
                                    <v-btn
                                        small
                                        elevation="0"
                                        class="outlined-button"
                                        aria-label="delete role"
                                        data-cy="role-delete"
                                        @click="
                                            confirmDeletion({
                                                id: item.id,
                                                name: item.name,
                                                editable: true,
                                            })
                                        "
                                    >
                                        Delete
                                        <v-icon small right> mdi-close </v-icon>
                                    </v-btn>
                                </td>
                                <td v-else />
                            </tr>
                        </template>

                        <template v-slot:no-data>
                            <span class="grey--text text--darken-2">No roles</span>
                        </template>
                        <template v-slot:no-results>
                            <span class="grey--text text--darken-2">No roles found</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card>
        </div>
        <div v-else>
            <v-col v-if="loading" cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </div>

        <v-dialog persistent v-model="roleModal" max-width="500px" v-if="roleToEdit">
            <RoleModal
                :role="roleToEdit"
                :roleExists="roleExists"
                @discard="discardChanged"
                @save="confirmEditRoleDetails"
            ></RoleModal>
        </v-dialog>

        <confirmation-modal
            :persistent="true"
            v-model="deleteConfirm"
            title="Delete role"
            continue-btn-text="Confirm"
            data-cy-prefix="role-delete"
            :deletionModal="true"
            @cancel="cancelRoleDeletion"
            @continue="deleteRole"
        >
            Are you sure you would like to delete <strong>{{ roleToDelete?.name }}</strong>
            ?
        </confirmation-modal>

        <confirmation-modal
            :persistent="true"
            v-model="editConfirm"
            title="Edit role"
            continue-btn-text="Confirm"
            data-cy-prefix="role-edit-confirm"
            @cancel="editConfirm = false"
            @continue="continueSavingRoleDetails"
        >
            Are you sure you wish to make changes to
            <strong> {{ roleToEdit?.name }} </strong>?
        </confirmation-modal>

        <v-col v-if="loading" cols="12">
            <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
        </v-col>
    </v-tab-item>
</template>

<script lang="ts">
import {
    deleteRole,
    getPaginatedRoles,
    createRole,
    updateRole,
} from "@/api/user-management/UserManagementService";
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions, DataTableHeader } from "vuetify";
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import RoleModal from "./RoleModal.vue";
import { throttle } from "underscore";
import { isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";
import ConfirmationModal from "../Shared/ConfirmationModal.vue";

@Component({
    components: {
        RoleModal,
        ConfirmationModal,
    },
    computed: {
        userRoleCount(): string {
            const count: number = this.$data.totalRoles;

            if (count === 1) {
                return "1 Role";
            }

            return `${count} Roles`;
        },
    },
})
export default class UserRolesTabItem extends Vue {
    roleHeaders: DataTableHeader[] = [
        { text: "Name", value: "name", sortable: false, align: "start", width: "83%" },
        { text: "Actions", value: "id", sortable: false, align: "start", width: "210px" },
    ];

    rolesList: UserRoleListItem[] = [];

    loading = false;

    totalRoles = 0;
    totalFilteredRoles = 0;

    roleExists = false;

    tableSearch = "";
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
    } as DataOptions;

    roleModal = false;
    roleToEdit: UserRoleListItem | null = null;

    editConfirm = false;
    roleToSave: UserRoleListItem | null = null;

    deleteConfirm = false;
    roleToDelete: UserRoleListItem | null = null;

    private throttledFetchRoles = throttle(() => {
        this.fetchRolePage();
    }, 500);

    @Watch("tableOptions", { deep: true })
    async tableOptionsChanged() {
        this.loading = true;
        this.throttledFetchRoles();
        this.loading = false;
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        this.throttledFetchRoles();
    }

    private async fetchRolePage() {
        const { totalRolesCount, totalFilteredRolesCount, roles } = await getPaginatedRoles({
            search: this.tableSearch,
            ...this.tableOptions,
        });

        this.totalRoles = totalRolesCount;
        this.totalFilteredRoles = totalFilteredRolesCount;
        this.rolesList = roles;
    }

    createNewRole() {
        this.roleToEdit = {} as UserRoleListItem;
        this.roleModal = true;
    }

    editRoleDetails(role: UserRoleListItem) {
        if (!role.editable) {
            return;
        }

        this.roleToEdit = role;
        this.roleModal = true;
    }

    confirmEditRoleDetails(role: UserRoleListItem) {
        if (role.id) {
            this.editConfirm = true;
            this.roleToSave = role;

            return;
        }

        this.saveRoleDetails(role);
    }

    discardChanged() {
        this.roleModal = false;
        this.roleExists = false;
        setTimeout(() => {
            this.roleToEdit = null;
        }, 500);
    }

    confirmDeletion(role: UserRoleListItem) {
        this.roleToDelete = role;
        this.deleteConfirm = true;
    }

    cancelRoleDeletion() {
        this.deleteConfirm = false;
        this.roleToDelete = null;
    }

    async deleteRole() {
        if (!this.roleToDelete) {
            return;
        }

        const responseOk = await deleteRole(this.roleToDelete.id);

        if (responseOk) {
            this.deleteConfirm = false;
            this.roleToDelete = null;

            await this.fetchRolePage();
            this.$emit("rolesChanged");

            Vue.$toast.success("Role successfully deleted");
        }
    }

    async continueSavingRoleDetails() {
        if (!this.roleToSave) {
            return;
        }

        this.editConfirm = false;
        await this.saveRoleDetails(this.roleToSave);
        this.roleToSave = null;
    }

    async saveRoleDetails(role: UserRoleListItem) {
        let response = {} as AxiosResponse | AxiosError;

        if (role.id && role.name === "") {
            response.status = 200;
        } else if (role.id && this.roleToEdit?.name !== role.name) {
            response = await updateRole(role.id, role);
        } else {
            response = await createRole(role);
        }

        if (isResultOk(response as AxiosResponse)) {
            this.roleModal = false;
            this.roleExists = false;

            setTimeout(() => {
                this.roleToEdit = null;
            }, 500);

            await this.fetchRolePage();
            this.$emit("rolesChanged");

            Vue.$toast.success("Role successfully saved");
            return;
        } else if ((response as AxiosError).response?.status === 409) {
            this.roleExists = true;
            return;
        } else {
            this.roleModal = false;
            this.roleExists = false;
            setTimeout(() => {
                this.roleToEdit = null;
            }, 500);
            return;
        }
    }
}
</script>
