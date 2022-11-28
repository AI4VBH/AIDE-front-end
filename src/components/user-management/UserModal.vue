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
    <v-card>
        <v-card-title class="text-h5">
            <span v-if="editing">Edit&nbsp;</span>
            <span v-if="!editing">Add&nbsp;</span>
            User Details
        </v-card-title>
        <v-divider />
        <div class="px-6 pt-3">
            <v-form v-model="requiredFieldsFilled" ref="form">
                <div>
                    <span class="font-weight-medium mb-2 required">First Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="First Name"
                        data-cy="user-first-name"
                        v-model="firstName"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Last Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="Last Name"
                        data-cy="user-last-name"
                        v-model="lastName"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Email</span>
                    <v-text-field
                        outlined
                        dense
                        label="Email"
                        type="email"
                        data-cy="user-email"
                        v-model="email"
                        :rules="emailRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Roles</span>
                    <v-select
                        outlined
                        dense
                        multiple
                        hidden
                        return-object
                        label="Roles"
                        item-text="name"
                        data-cy="user-roles"
                        v-model="realmRoles"
                        :menu-props="{ contentClass: 'user-role' }"
                        :items="roles"
                        :rules="oneOrMoreRules"
                    ></v-select>
                </div>
                <div v-if="userEmailExists">
                    <ErrorMessageContainer
                        :errorMessages="['User with this email address already exists']"
                    />
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn text class="secondary-button" data-cy="user-modal-discard" @click="discard">
                Cancel
                <v-icon right> mdi-close </v-icon>
            </v-btn>
            <v-btn
                text
                data-cy="user-modal-save"
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                <span v-if="user.id">Save</span>
                <span v-else>Add user</span>
                <v-icon small right> mdi-content-save </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";
import { emailRegEx } from "@/utils/constants";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import ErrorMessageContainer from "../Shared/ErrorMessageContainer.vue";

@Component({
    components: { ErrorMessageContainer },
    computed: {
        editing(): boolean {
            return !!this.$props.user?.id;
        },
        firstName: {
            get() {
                return this.$props.user?.firstName;
            },
            set(value: string) {
                this.$data.userDetails.firstName = value;
            },
        },
        lastName: {
            get() {
                return this.$props.user?.lastName;
            },
            set(value: string) {
                this.$data.userDetails.lastName = value;
            },
        },
        email: {
            get() {
                return this.$props.user?.email;
            },
            set(value: string) {
                this.$data.userDetails.email = value;
            },
        },
        realmRoles: {
            get() {
                return this.$props.user?.realmRoles || [];
            },
            set(value: string) {
                this.$data.userDetails.realmRoles = value;
            },
        },
    },
})
export default class UserModal extends Vue {
    @Prop({ default: () => [] })
    roles!: UserRoleListItem[];

    @Prop()
    user?: UserListItem;

    @Prop({ default: false })
    userEmailExists?: boolean;

    requiredTextRules: InputValidationRules = [(value) => !!value || "Required"];
    oneOrMoreRules: InputValidationRules = [
        (value: string[]) => !!value.length || "Select one or more",
    ];
    emailRules: InputValidationRules = [
        (value) => !!value || "Required",
        (value) => emailRegEx.test(value) || "Invalid email address",
    ];
    requiredFieldsFilled = false;
    userDetails = {} as UserListItem;

    resetForm() {
        this.userDetails = {} as UserListItem;
        (this.$refs.form as any)?.reset();
        (this.$refs.form as any)?.resetValidation();
    }

    discard() {
        this.$emit("discard");
        this.resetForm();
    }

    save() {
        const user = { ...(this.user || {}), ...this.userDetails };
        this.$emit("save", user);
    }
}
</script>

<style scoped>
div.v-menu__content.theme--light.menuable__content__active.role-filters,
div.v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
    width: 460px;
    text-overflow: ellipsis;
}
</style>
