<template>
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <div v-show="loading" class="pa-1 pb-2">
                    Please Wait...
                    <v-progress-linear indeterminate color="blue" class=""></v-progress-linear>
                </div>
                <div v-show="!loading" class="modal-content">
                    <v-toolbar color="#61366e" dark>{{ modalType }} Viewer</v-toolbar>
                    <v-card-text style="height: 60vh; overflow-y: scroll !important" data-cy="logs">
                        <JSONViewer
                            mode="text"
                            readOnly="true"
                            :content="{ json: data }"
                            :mainMenuBar="false"
                        />
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn v-if="modalType === 'Logs'" text @click="downloadFile">
                            Download Logs
                        </v-btn>
                        <v-btn text @click="dialog2.value = false">Close</v-btn>
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
                execution_uid?: string,
            ) => {
                this.loading = true;
                this.data = "";
                this.dialog2 = dialog2;
                this.modalType = modalType;

                if (execution_uid) {
                    this.executionId = execution_uid;

                    if (modalType === JSONViewerModalType.metadata) {
                        await getPayloadExecutionMetadata(execution_uid)
                            .then((metadata) => {
                                this.data = metadata;
                            })
                            .catch((err) => {
                                this.dialog2 = false;
                                this.loading = false;
                            });
                    } else if (modalType === JSONViewerModalType.logs) {
                        await getLogs(execution_uid)
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