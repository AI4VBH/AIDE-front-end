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
    <v-card>
        <v-card-title class="text-h5" data-cy="role-modal-title">
            <span v-if="editing">Edit&nbsp;</span>
            <span v-if="!editing">Add&nbsp;</span>
            Role Details
        </v-card-title>
        <v-divider />
        <div class="px-6 pt-3">
            <v-form v-model="requiredFieldsFilled">
                <div>
                    <span class="font-weight-medium mb-2 required">Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="Name"
                        data-cy="role-name"
                        v-model="name"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
                <div v-if="roleExists">
                    <ErrorMessageContainer
                        :errorMessages="['Role with this name already exists']"
                    />
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn text class="secondary-button" data-cy="role-modal-discard" @click="discard">
                Cancel
                <v-icon right> mdi-close </v-icon>
            </v-btn>
            <v-btn
                text
                data-cy="role-modal-save"
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                <span v-if="role.id">Save</span>
                <span v-else>Add role</span>
                <v-icon small right> mdi-content-save </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";
import ErrorMessageContainer from "../Shared/ErrorMessageContainer.vue";

@Component({
    components: { ErrorMessageContainer },
    computed: {
        editing(): boolean {
            return !!this.$props.role?.id;
        },
        name: {
            get() {
                return this.$props.role?.name;
            },
            set(value: string) {
                this.$data.roleName = value;
            },
        },
    },
})
export default class RoleModal extends Vue {
    @Prop()
    role?: UserRoleListItem;

    @Prop({ default: false })
    roleExists?: boolean;

    requiredFieldsFilled = false;
    requiredTextRules: InputValidationRules = [(value) => !!value || "Required"];
    roleName = "";

    discard() {
        this.$emit("discard");
    }

    save() {
        const role = { ...(this.role || {}) };

        role.name = this.roleName;

        this.$emit("save", role);
    }
}
</script>
