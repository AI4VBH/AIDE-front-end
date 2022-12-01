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
        <v-card v-show="!loading" class="px-4 py-4">
            <div class="d-flex mb-4 justify-space-between">
                <div class="text-h5">{{ userCount }}</div>
                <div class="d-flex align-center">
                    <div class="mr-6">
                        <v-text-field
                            outlined
                            dense
                            hide-details
                            clearable
                            :append-icon="tableSearch ? '' : 'mdi-magnify'"
                            label="Search by name or email"
                            v-model="tableSearch"
                            data-cy="user-search-input"
                        ></v-text-field>
                    </div>
                    <div class="mr-6 d-flex align-center">
                        <span class="font-weight-bold mr-2">Show</span>
                        <v-select
                            outlined
                            dense
                            hide-details
                            hidden
                            style="width: 250px; text-overflow: ellipsis"
                            clearable
                            id="user-filter-role"
                            label="Roles"
                            data-cy="user-filter-role"
                            item-text="name"
                            placeholder="All roles"
                            :menu-props="{ contentClass: 'role-filters' }"
                            :items="roles"
                            v-model="selectedRole"
                        >
                        </v-select>
                    </div>
                    <v-btn class="primary-button" data-cy="add-user" @click="createNewUser">
                        Add user
                        <v-icon small class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card elevation="1">
                <v-data-table
                    :headers="userHeaders"
                    :items="users"
                    :search="tableSearch"
                    :server-items-length="totalFilteredUsers"
                    :options.sync="tableOptions"
                    :footer-props="{ itemsPerPageOptions: [5, 10] }"
                >
                    <template v-slot:item="{ item, index }">
                        <tr :data-cy="`user-table-row-${index}`">
                            <td
                                class="text-start font-weight-bold"
                                :data-cy="`user-table-row-firstname-${index}`"
                            >
                                {{ item.firstName }}
                            </td>
                            <td
                                class="text-start font-weight-bold"
                                :data-cy="`user-table-row-lastname-${index}`"
                            >
                                {{ item.lastName }}
                            </td>
                            <td class="text-start">
                                <v-chip
                                    :color="
                                        item.enabled ? 'light-green lighten-4' : 'red lighten-5'
                                    "
                                    :text-color="
                                        item.enabled ? 'light-green darken-4' : 'red darken-4'
                                    "
                                    :data-cy="`user-table-row-status-${index}`"
                                    small
                                >
                                    {{ item.enabled ? "Enabled" : "Disabled" }}
                                </v-chip>
                            </td>
                            <td class="text-start" :data-cy="`user-table-row-email-${index}`">
                                {{ item.email }}
                            </td>
                            <td
                                class="text-start text-capitalize"
                                :data-cy="`user-table-row-roles-${index}`"
                            >
                                {{ item.realmRoles | commaSeparated }}
                            </td>
                            <td class="text-start" :data-cy="`user-table-row-actions-${index}`">
                                <v-btn
                                    small
                                    elevation="0"
                                    class="mr-2 secondary-button"
                                    aria-label="edit user"
                                    data-cy="user-edit"
                                    @click.stop="() => editUserDetails(item)"
                                >
                                    Edit
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    class="outlined-button"
                                    aria-label="delete user"
                                    data-cy="user-delete"
                                    @click.stop="() => confirmDeletion(item)"
                                >
                                    Delete
                                    <v-icon small right> mdi-close </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:no-data>
                        <span v-if="!selectedRole" class="grey--text text--darken-2">No users</span>
                        <span v-else class="grey--text text--darken-2"
                            >No users found with filters applied</span
                        >
                    </template>
                    <template v-slot:no-results>
                        <span class="grey--text text--darken-2"
                            >No users found with filters applied</span
                        >
                    </template>
                </v-data-table>
            </v-card>
        </v-card>

        <v-dialog persistent v-model="userModal" max-width="500px" v-if="userToEdit">
            <UserModal
                :userEmailExists="userEmailExists"
                :roles="roles"
                :user="userToEdit"
                @discard="discardChanged"
                @save="confirmEditUserDetails"
            ></UserModal>
        </v-dialog>

        <confirmation-modal
            :persistent="true"
            v-model="deleteConfirm"
            title="Delete user"
            continue-btn-text="Confirm"
            data-cy-prefix="user-delete"
            :deletionModal="true"
            @cancel="cancelUserDeletion"
            @continue="deleteUser"
        >
            Are you sure you would like to delete
            <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>
            ?
        </confirmation-modal>

        <confirmation-modal
            :persistent="true"
            v-model="editConfirm"
            title="Edit user"
            continue-btn-text="Confirm"
            data-cy-prefix="user-edit-confirm"
            @cancel="editConfirm = false"
            @continue="continueSavingUserDetails"
        >
            Are you sure you wish to make changes to
            <strong>{{ userToEdit?.firstName }} {{ userToEdit?.lastName }} </strong>?
        </confirmation-modal>

        <v-col v-if="loading" cols="12">
            <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
        </v-col>
    </v-tab-item>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DataTableHeader, DataOptions } from "vuetify";
import UserModal from "./UserModal.vue";
import {
    createUser,
    getAllUsers,
    updateUserDetails,
    deleteUser,
} from "@/api/user-management/UserManagementService";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import { Prop, Watch } from "vue-property-decorator";
import { throttle } from "underscore";
import { isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";
import ConfirmationModal from "../Shared/ConfirmationModal.vue";

@Component({
    components: {
        UserModal,
        ConfirmationModal,
    },
    computed: {
        userCount(): string {
            if (this.$data.totalUsers === 1) {
                return "1 User";
            }

            return `${this.$data.totalUsers} Users`;
        },
    },
    filters: {
        commaSeparated(values: UserRoleListItem[]): string {
            return values.map((v) => v.name).join(", ");
        },
    },
})
export default class UserTabItem extends Vue {
    @Prop({ default: () => [] })
    roles!: UserRoleListItem[];

    loading = false;

    userHeaders: DataTableHeader[] = [
        { text: "First Name", value: "firstName", sortable: false, filterable: true },
        { text: "Last Name", value: "lastName", sortable: false, filterable: true },
        { text: "Status", value: "status", sortable: false },
        { text: "Email", value: "email", sortable: false, filterable: true },
        { text: "Roles", value: "roles", sortable: false },
        { text: "Actions", value: "id", sortable: false, width: "210px" },
    ];

    users: UserListItem[] = [];
    tableSearch = "";
    selectedRole = "";

    userModal = false;
    userToEdit: UserListItem | null = null;

    deleteConfirm = false;
    userToDelete: UserListItem | null = null;

    editConfirm = false;
    userToSave: UserListItem | null = null;

    userEmailExists = false;

    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
    } as DataOptions;

    totalUsers = 0;
    totalFilteredUsers = 0;

    private throttledFetchUsers = throttle(() => {
        this.fetchAndSetUsers();
    }, 500);

    @Watch("tableOptions", { deep: true })
    tableOptionsChanged() {
        this.loading = true;
        this.throttledFetchUsers();
        this.loading = false;
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        this.throttledFetchUsers();
    }

    @Watch("selectedRole")
    async selectedRoleChanged() {
        this.loading = true;
        this.throttledFetchUsers();
        this.loading = false;
    }

    createNewUser() {
        this.userToEdit = {} as UserListItem;
        this.userModal = true;
    }

    editUserDetails(user: UserListItem) {
        this.userToEdit = user;
        this.userModal = true;
    }

    discardChanged() {
        this.userModal = false;
        this.userEmailExists = false;
        setTimeout(() => {
            this.userToEdit = null;
        }, 500);
    }

    confirmDeletion(user: UserListItem) {
        this.userToDelete = user;
        this.deleteConfirm = true;
    }

    cancelUserDeletion() {
        this.deleteConfirm = false;
        this.userToDelete = null;
    }

    async deleteUser() {
        if (!this.userToDelete) {
            return;
        }

        const ok = await deleteUser(this.userToDelete.id);

        if (ok) {
            this.deleteConfirm = false;
            this.userToDelete = null;

            await this.fetchAndSetUsers();

            Vue.$toast.success("User successfully deleted");
        }
    }

    confirmEditUserDetails(user: UserListItem) {
        if (user.id) {
            this.editConfirm = true;
            this.userToSave = user;

            return;
        }

        this.saveUserDetails(user);
    }

    async continueSavingUserDetails() {
        if (!this.userToSave) {
            return;
        }

        this.editConfirm = false;
        await this.saveUserDetails(this.userToSave);
        this.userToSave = null;
    }

    async saveUserDetails(user: UserListItem) {
        let response: AxiosResponse | AxiosError;

        if (user.id) {
            response = await updateUserDetails(user.id, user);
        } else {
            response = await createUser(user);
        }

        if (isResultOk(response as AxiosResponse)) {
            this.userModal = false;
            this.userEmailExists = false;

            // need to set the timeout so it clears form correctly
            setTimeout(() => {
                this.userToEdit = null;
            }, 500);

            await this.fetchAndSetUsers();
            Vue.$toast.success("User successfully saved");

            return;
        } else if ((response as AxiosError).response?.status === 409) {
            this.userEmailExists = true;
            return;
        } else {
            this.userModal = false;
            this.userEmailExists = false;
            setTimeout(() => {
                this.userToEdit = null;
            }, 500);
            return;
        }
    }

    private async fetchAndSetUsers() {
        const { totalUserCount, totalFilteredUserCount, users } = await getAllUsers({
            search: this.tableSearch,
            role: this.selectedRole,
            ...this.tableOptions,
        });

        this.totalUsers = totalUserCount;
        this.totalFilteredUsers = totalFilteredUserCount;
        this.users = users;
    }
}
</script>

<style scoped>
div.v-menu__content.theme--light.menuable__content__active.role-filters,
div.v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
    width: 250px;
    text-overflow: ellipsis;
}
</style>
