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
    <v-container fluid class="mt-3 mb-7 px-7">
        <v-row>
            <v-col class="col-sm-8 col-xl-9">
                <h2 class="mx-auto section-title">Issues</h2>
            </v-col>
        </v-row>
        <v-row v-if="!loading && issues !== undefined">
            <v-layout child-flex column>
                <v-btn
                    elevation="0"
                    class="my-3 secondary-button"
                    color="white"
                    width="150px"
                    @click="deleteItem(undefined)"
                    :disabled="selectedIssues.length === 0"
                    data-cy="dismiss-selected"
                >
                    Dismiss selected
                </v-btn>
                <v-card>
                    <v-card-title class="d-none">
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                            data-cy="search-issues-table"
                            class="d-none"
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="issues"
                        :search="search"
                        :items-per-page="5"
                        v-model="selectedIssues"
                        show-select
                        item-key="execution_id"
                        class="elevation-1"
                        data-cy="task"
                    >
                        <template v-slot:no-data>
                            <span class="grey--text text--darken-3">No data available</span>
                        </template>
                        <template v-slot:no-results>
                            <span class="grey--text text--darken-3">No results found</span>
                        </template>
                        <template v-slot:[`item.task_id`]="{ item }">
                            <strong data-cy="task-id">
                                {{ item.task_id }}
                            </strong>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip
                                class="my-2"
                                color="red lighten-5"
                                text-color="red darken-3"
                                data-cy="status"
                            >
                                <strong v-if="item.failure_reason === 'rejected'">
                                    Rejected
                                </strong>
                                <strong v-else>{{ item.status }}</strong>
                            </v-chip>
                        </template>
                        <template v-slot:[`item.patient_name`]="{ item }">
                            <span data-cy="patient-name">
                                {{ item.patient_name }}
                            </span>
                        </template>
                        <template v-slot:[`item.patient_id`]="{ item }">
                            <span data-cy="patient-id">
                                {{ item.patient_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.execution_time`]="{ item }">
                            <span data-cy="execution-date-time">
                                {{ item.execution_time }}
                            </span>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn
                                elevation="0"
                                small
                                class="my-1 mr-1"
                                :class="
                                    item.failure_reason === 'rejected'
                                        ? 'primary-button'
                                        : 'secondary-button'
                                "
                                @click.stop="viewIssueDetails(item.payload_id, item.execution_id)"
                                data-cy="view-logs-button"
                                width="110px"
                            >
                                {{
                                    item.failure_reason === "rejected"
                                        ? "View rejection"
                                        : "View logs"
                                }}
                            </v-btn>
                            <v-btn
                                elevation="0"
                                small
                                class="my-1 ml-md-0 ml-1 outlined-button"
                                @click="deleteItem(item)"
                                data-cy="dismiss-button"
                            >
                                Dismiss
                                <v-icon right> mdi-close </v-icon>
                            </v-btn>

                            <confirmation-modal
                                v-model="dialogDelete"
                                :persistent="true"
                                title="Confirm dismiss"
                                continue-btn-text="Confirm"
                                data-cy-prefix="validation"
                                :deletionModal="true"
                                @cancel="closeDelete"
                                @continue="deleteItemConfirm"
                            >
                                Are you sure you want to dismiss?
                            </confirmation-modal>
                        </template>
                    </v-data-table>
                </v-card>
            </v-layout>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { dismissIssue, getIssues } from "@/api/Admin/AdminStatisticsService";
import { Watch } from "vue-property-decorator";
import { formatDateAndTimeOfArray } from "@/utils/date-utilities";
import { IIndexedIssue, IIssue } from "@/models/Admin/IIssue";
import ConfirmationModal from "../Shared/ConfirmationModal.vue";

@Component({
    components: { ConfirmationModal },
})
export default class IssuesTable extends Vue {
    loading = false;
    search = "";
    selectedIssues: IIssue[] = [];
    itemsToDismiss: IIndexedIssue[] = [];
    issues: IIssue[] = [];
    dialogDelete = false;
    headers = [
        { text: "Payload ID", value: "payload_id" },
        { text: "Task ID", value: "task_id" },
        { text: "Status", value: "status" },
        { text: "Patient", value: "patient_name" },
        { text: "Patient ID", value: "patient_id" },
        { text: "Time", value: "execution_time" },
        { text: "Actions", value: "actions", width: "250px" },
    ];

    async created(): Promise<void> {
        this.getExecutionIssues();
    }

    @Watch("dialogDelete", { immediate: true }) onDialogDeleteChanged(value: boolean) {
        value || this.closeDelete();
    }

    async getExecutionIssues(): Promise<void> {
        this.loading = true;

        const executionIssues = await getIssues();
        formatDateAndTimeOfArray(executionIssues, "execution_time", false);
        this.issues = executionIssues;

        this.loading = false;
    }

    async dismissItems(dismissedItems: IIndexedIssue[]): Promise<void> {
        const results = [];
        for (const issue of dismissedItems) {
            const result = await dismissIssue(issue).catch((err) => {
                console.log(err);
            });
            results.push(result);
            if (result) {
                const _issue = this.selectedIssues.filter(
                    (si) => si.execution_id == issue.issue.execution_id,
                )[0];
                const index = this.selectedIssues.indexOf(_issue);
                if (index != -1) {
                    this.selectedIssues.splice(index, 1);
                }
            }
        }

        if (results.some((r) => r === true)) {
            const resultsCount = results.filter((r) => r === true).length;
            const s = resultsCount == 1 ? `` : `s`;
            Vue.$toast.success(`You have successfully dismissed ${resultsCount} task${s}.`);
            await this.getExecutionIssues();
        }

        this.loading = false;
    }

    deleteItem(item?: IIssue): void {
        if (typeof item !== "undefined") {
            const indexedIssue: IIndexedIssue = { index: this.issues.indexOf(item), issue: item };
            this.itemsToDismiss.push(indexedIssue);
        } else {
            this.selectedIssues.forEach((selectedItem: IIssue) => {
                const indexedIssue: IIndexedIssue = {
                    index: this.issues.indexOf(selectedItem),
                    issue: selectedItem,
                };
                this.itemsToDismiss.push(indexedIssue);
            });
        }
        this.dialogDelete = true;
    }

    deleteItemConfirm(): void {
        this.dismissItems(this.itemsToDismiss);

        this.closeDelete();
    }

    closeDelete(): void {
        this.dialogDelete = false;

        this.$nextTick(() => {
            this.itemsToDismiss = [];
        });
    }

    viewIssueDetails(payload_id: string, execution_id: string): void {
        this.$router.push({
            name: "AdminPayloadDashboard",
            query: { payload_id: payload_id, execution_id: execution_id },
        });
    }
}
</script>
