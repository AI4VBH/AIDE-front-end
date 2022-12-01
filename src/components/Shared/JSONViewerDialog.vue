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
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <div v-show="loading" class="pa-1 pb-2">
                    Please Wait...
                    <v-progress-linear indeterminate color="blue" class=""></v-progress-linear>
                </div>
                <div v-show="!loading" class="modal-content">
                    <v-toolbar color="#61366e" class="pl-5" dark>{{ modalType }} Viewer</v-toolbar>
                    <v-card-text style="height: 60vh; overflow-y: scroll !important" data-cy="logs">
                        <JSONViewer
                            mode="text"
                            readOnly="true"
                            :content="{ json: data }"
                            :mainMenuBar="false"
                        />
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn
                            v-if="modalType === 'Logs'"
                            class="my-2 primary-button"
                            text
                            @click="downloadFile"
                        >
                            Download Logs
                        </v-btn>
                        <v-btn
                            text
                            class="my-2 mr-3 ml-2 secondary-button"
                            @click="dialog2.value = false"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import JSONViewer from "./JSONViewer.vue";
import { getLogs, getTaskLogs } from "@/api/LogService";
import { getPayloadExecutionMetadata } from "@/api/Admin/payloads/PayloadService";

export enum JSONViewerModalType {
    logs = "Logs",
    metadata = "Metadata",
}

@Component({
    components: { JSONViewer },
})
export default class JSONViewerDialog extends Vue {
    dialog2 = false;
    loading = true;
    executionId: string | undefined = "";
    data: unknown;
    modalType = "";

    created(): void {
        EventBus.$on(
            "openJSONViewerDialog",
            async (
                dialog2: boolean,
                modalType: JSONViewerModalType,
                task_id?: number,
                executionUid?: string,
                workflowId?: string,
            ) => {
                this.loading = true;
                this.data = "";
                this.dialog2 = dialog2;
                this.modalType = modalType;

                if (executionUid && workflowId) {
                    this.executionId = executionUid;

                    if (modalType === JSONViewerModalType.metadata) {
                        await getPayloadExecutionMetadata(workflowId, executionUid)
                            .then((metadata) => {
                                this.data = metadata;
                            })
                            .catch((err) => {
                                this.dialog2 = false;
                                this.loading = false;
                            });
                    } else if (modalType === JSONViewerModalType.logs) {
                        await getLogs(executionUid)
                            .then((log) => {
                                this.data = log;
                            })
                            .catch((err) => {
                                this.dialog2 = false;
                                this.loading = false;
                            });
                    }
                    this.loading = false;
                    return;
                }
                if (task_id) {
                    await getTaskLogs(task_id)
                        .then((log) => {
                            this.data = log;
                        })
                        .catch((err) => {
                            this.dialog2 = false;
                            this.loading = false;
                        });
                    this.loading = false;
                    return;
                }
            },
        );
    }

    downloadFile(): void {
        const data = JSON.stringify(this.data);

        const blob = new Blob([data], { type: "text/plain" });
        const e = document.createEvent("MouseEvents"),
            a = document.createElement("a");
        a.download = `${this.executionId}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initEvent("click", true, false);
        a.dispatchEvent(e);
        a.remove();
    }

    customKeyFormatter(key: any) {
        return `<span style="color: #00AA00">${key}<span>`;
    }
}
</script>

<style>
.v-toast__text {
    font-family: "Open Sans", sans-serif !important;
}
</style>
