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
        <v-card-title><span v-if="editing">Edit&nbsp;</span>DICOM Configuration</v-card-title>
        <v-divider />
        <div class="px-4 pt-3">
            <v-form v-model="requiredFieldsFilled" ref="form">
                <div>
                    <span class="font-weight-medium mb-2 required">Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="Name"
                        data-cy="destination-name"
                        v-model="name"
                        :disabled="editing"
                        :rules="alphanumericCharactersRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">AE Title</span>
                    <v-text-field
                        outlined
                        dense
                        label="AE Title"
                        data-cy="destination-ae-title"
                        v-model="aeTitle"
                        :rules="alphanumericCharactersRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">Address</span>
                    <v-text-field
                        outlined
                        dense
                        label="Address"
                        data-cy="destination-ip-address"
                        v-model="hostIp"
                        :rules="ipAddressRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">Port</span>
                    <v-text-field
                        outlined
                        dense
                        type="number"
                        label="Port"
                        data-cy="destination-port"
                        v-model="port"
                        :rules="portRules"
                    ></v-text-field>
                </div>
                <div v-if="hasErrorMessage">
                    <ErrorMessageContainer :errorMessages="[errorMessage]" />
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn
                text
                class="secondary-button"
                data-cy="destination-create-cancel"
                @click="discard"
            >
                Cancel
                <v-icon right> mdi-close </v-icon>
            </v-btn>
            <v-btn
                text
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                data-cy="destination-create-save"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                Save
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
import { IExportDestination } from "@/models/export-destinations/ExportDestination";
import ErrorMessageContainer from "@/components/Shared/ErrorMessageContainer.vue";

@Component({
    components: {
        ErrorMessageContainer,
    },
    computed: {
        editing(): boolean {
            return !!this.$props.destination?.name;
        },
        name: {
            get() {
                return this.$props.destination?.name;
            },
            set(value: string) {
                this.$data.destinationDetails.name = value;
            },
        },
        aeTitle: {
            get() {
                return this.$props.destination?.aeTitle;
            },
            set(value: string) {
                this.$data.destinationDetails.aeTitle = value;
            },
        },
        hostIp: {
            get() {
                return this.$props.destination?.hostIp;
            },
            set(value: string) {
                this.$data.destinationDetails.hostIp = value;
            },
        },
        port: {
            get() {
                return this.$props.destination?.port;
            },
            set(value: string) {
                this.$data.destinationDetails.port = value;
            },
        },
    },
})
export default class ConfigurationModal extends Vue {
    @Prop()
    destination?: IExportDestination;

    @Prop({ default: "" })
    errorMessage: string | undefined;

    get hasErrorMessage() {
        return !!this.errorMessage || this.errorMessage?.trim() !== "";
    }

    requiredFieldsFilled = false;
    destinationDetails = {} as IExportDestination;

    requiredTextRules: InputValidationRules = [(value: string) => !!value || "Required"];

    // https://stackoverflow.com/a/106223
    ipAddressRules: InputValidationRules = [
        ...this.requiredTextRules,
        (value: string) =>
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
                value,
            ) ||
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/.test(
                value,
            ) ||
            "Invalid address",
    ];
    portRules: InputValidationRules = [
        ...this.requiredTextRules,
        (value: string) =>
            /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
                value,
            ) || "Invalid port. Must be between 1 and 65535",
    ];
    alphanumericCharactersRules: InputValidationRules = [
        ...this.requiredTextRules,
        (value: string) =>
            /^[a-zA-Z0-9]*$/.test(value) || "No spaces or special characters allowed",
    ];

    private resetForm() {
        (this.$refs.form as any).reset();
        (this.$refs.form as any).resetValidation();
    }

    discard() {
        this.resetForm();
        this.$emit("discard");
    }

    save() {
        const dest = { ...(this.destination || {}), ...this.destinationDetails };
        this.$emit("save", dest);
    }
}
</script>
