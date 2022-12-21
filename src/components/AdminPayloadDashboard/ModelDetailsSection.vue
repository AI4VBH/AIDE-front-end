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
    <v-col style="width: 25%" class="pa-7 model-details">
        <h3 data-cy="selected-node-name">{{ selectedNode.name }}</h3>
        <v-chip
            :class="`mt-3 mb-6 mx-0 status ${selectedNode.status}`"
            :color="selectedNode.status | statusChipBg"
            :text-color="selectedNode.status | statusChipText"
            data-cy="selected-node-status"
        >
            <strong>{{ selectedNode.status | statusDisplayText }}</strong>
        </v-chip>
        <p data-cy="selected-node-started">
            <strong class="mr-sm-7 mr-lg-0">Execution started: </strong>
            {{ selectedNode.start_date | formatDateAndTimeOfString }}
        </p>
        <v-row class="pa-3">
            <v-btn
                elevation="0"
                block
                class="mb-2 ml-xl-1 no-uppercase white--text"
                color="primary"
                @click.stop="
                    openJSONViewerDialog(
                        selectedNode.execution_id,
                        selectedNode.workflow_instance_id,
                        'Logs',
                    )
                "
                data-cy="view-node-logs"
            >
                View Logs
            </v-btn>
            <v-btn
                elevation="0"
                block
                class="mb-2 ml-xl-1 no-uppercase white--text"
                color="primary"
                @click.stop="
                    openJSONViewerDialog(
                        selectedNode.execution_id,
                        selectedNode.workflow_instance_id,
                        'Metadata',
                    )
                "
                data-cy="view-node-metadata"
            >
                View Metadata
            </v-btn>
            <div class="text-center">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="0"
                            class="my-1 ml-xl-1 no-uppercase primary--text"
                            color="purple lighten-5"
                            data-cy="download-node-outputs"
                            v-on="on"
                            v-bind="attrs"
                            :disabled="loadingArtifacts"
                        >
                            Download Outputs
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-item link v-for="(value, key) in artifacts" :key="key">
                            <v-list-item-title @click="downloadArtifactByKey(value, key)">
                                {{ key }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import {
    getPayloadExecutionArtifacts,
    getPayloadExecutionOutput,
} from "@/api/Admin/payloads/PayloadService";
import { EventBus } from "@/event-bus";
import { formatDateAndTimeOfString } from "@/utils/date-utilities";
import mimeTypes from "mime-types";

@Component({
    filters: {
        formatDateAndTimeOfString,
        statusChipBg: (status: string) => {
            switch (status) {
                case "Succeeded":
                case "succeeded":
                    return "light-green lighten-4";

                case "Failed":
                case "failed":
                case "PartialFail":
                case "partialfail":
                    return "red lighten-4";

                default:
                    return "orange lighten-4";
            }
        },
        statusChipText: (status: string) => {
            switch (status) {
                case "Succeeded":
                case "succeeded":
                    return "light-green darken-4";

                case "Failed":
                case "failed":
                case "PartialFail":
                case "partialfail":
                    return "red darken-3";

                default:
                    return "orange darken-3";
            }
        },
        statusDisplayText: (status: string) => {
            switch (status) {
                case "PartialFail":
                case "partialfail":
                    return "Partial Fail";

                default:
                    return status;
            }
        },
    },
})
export default class ModelDetailsSection extends Vue {
    @Prop()
    selectedNode: any;

    loadingArtifacts = true;
    artifacts: { [key: string]: string } = {};

    openJSONViewerDialog(
        execution_id: string,
        workflow_instance_id: string,
        modalType: string,
    ): void {
        EventBus.$emit(
            "openJSONViewerDialog",
            true,
            modalType,
            undefined,
            execution_id,
            workflow_instance_id,
        );
    }

    async mounted() {
        await this.getArtifacts();
    }

    @Watch("selectedNode")
    async getArtifacts() {
        this.loadingArtifacts = true;

        this.artifacts = await getPayloadExecutionArtifacts(
            this.selectedNode.workflow_instance_id,
            this.selectedNode.execution_id,
        );

        this.loadingArtifacts = Object.keys(this.artifacts).length === 0;
    }

    async downloadArtifactByKey(objectKey: string, fileName: string) {
        const { status, data, headers } = await getPayloadExecutionOutput(objectKey);

        if (status !== 200) {
            return;
        }

        const contentType = headers["Content-Type"] || headers["content-type"];
        const file = this.createFilename(fileName, contentType);

        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();

        setTimeout(() => URL.revokeObjectURL(url));
    }

    private createFilename(fileName: string, contentType?: string): string {
        if (!contentType) {
            return fileName;
        }

        const hasExt = mimeTypes.extension(contentType);
        let ext = hasExt as string;

        if (!hasExt) {
            const map: Record<string, string> = { "application/zip": "zip" };

            ext = map[contentType];
        }

        return `${fileName}.${ext}`;
    }
}
</script>

<style scoped>
.model-details {
    background: #f7f3f8;
}
</style>
