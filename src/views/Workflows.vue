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
            <div class="d-flex mb-4 justify-space-between">
                <h2 class="section-title mb-4">Workflows</h2>
                <v-btn
                    v-show="!loading"
                    class="primary-button"
                    data-cy="add-workflow"
                    @click="navigateToWorkflowEditorCreate"
                >
                    Create new workflow
                    <v-icon small class="ml-1">mdi-plus</v-icon>
                </v-btn>
            </div>
            <div v-if="!loading && workflowPage !== undefined">
                <v-card elevation="1">
                    <v-data-table
                        :headers="workflowHeaders"
                        :items="workflowPage.data"
                        :server-items-length="workflowPage.totalRecords"
                        :options.sync="tableOptions"
                        :footer-props="{ itemsPerPageOptions: [5, 10] }"
                    >
                        <template v-slot:item="{ item, index }">
                            <tr :data-cy="`workflow-table-row-${index}`">
                                <!-- name -->
                                <td
                                    class="text-start font-weight-bold"
                                    :data-cy="`workflow-table-row-name-${index}`"
                                >
                                    {{ item.name }}
                                </td>
                                <!-- AeTitle -->
                                <td
                                    class="text-start"
                                    :data-cy="`workflow-table-row-aetitle-${index}`"
                                >
                                    {{ item.ae_title }}
                                </td>
                                <!-- Data Origins -->
                                <td
                                    class="text-start"
                                    :data-cy="`workflow-table-row-data-${index}`"
                                >
                                    {{ item.data_origins.join(", ") }}
                                </td>
                                <!-- version -->
                                <td
                                    class="text-start"
                                    :data-cy="`workflow-table-row-version-${index}`"
                                >
                                    {{ item.version }}
                                </td>
                                <!-- description -->
                                <td
                                    class="text-start"
                                    :data-cy="`workflow-table-row-description-${index}`"
                                >
                                    {{ item.description }}
                                </td>
                                <!-- actions -->
                                <td
                                    class="text-start"
                                    :data-cy="`workflow-table-row-actions-${index}`"
                                >
                                    <v-btn
                                        small
                                        elevation="0"
                                        class="mr-2 secondary-button"
                                        aria-label="edit workflow"
                                        data-cy="workflow-edit"
                                        @click.stop="
                                            () =>
                                                navigateToWorkflowEditor(
                                                    item.workflow_id,
                                                    item.name,
                                                )
                                        "
                                    >
                                        Edit
                                    </v-btn>
                                    <v-btn
                                        small
                                        elevation="0"
                                        class="outlined-button"
                                        aria-label="delete workflow"
                                        data-cy="workflow-delete"
                                        @click.stop="() => confirmDeletion(item)"
                                    >
                                        Delete
                                        <v-icon small right> mdi-close </v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>

                        <template v-slot:no-data>
                            <span class="grey--text text--darken-2"> No workflows found </span>
                        </template>
                        <template v-slot:no-results>
                            <span class="grey--text text--darken-2"> No workflows found </span>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
            <div v-else>
                <v-col v-if="loading" cols="12">
                    <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
                </v-col>
            </div>

            <confirmation-modal
                :persistent="true"
                v-model="deleteConfirm"
                title="Delete workflow"
                continue-btn-text="Confirm"
                data-cy-prefix="workflow-delete"
                :deletionModal="true"
                @cancel="cancelWorkflowDeletion"
                @continue="deleteWorkflow"
            >
                Are you sure you would like to delete
                <strong> {{ workflowToDelete?.name }} </strong>?
            </confirmation-modal>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions, DataTableHeader } from "vuetify";
import { getAllWorkflows, deleteWorkflow } from "@/api/workflows/WorkflowService";
import { PaginatedWorkflowsResponse, WorkflowListItem } from "@/models/workflows/Workflow";
import { throttle } from "underscore";
import ConfirmationModal from "@/components/Shared/ConfirmationModal.vue";

@Component({
    metaInfo: {
        title: "Workflows",
    },
    components: {
        ConfirmationModal,
    },
})
export default class Workflows extends Vue {
    workflowHeaders: DataTableHeader[] = [
        { text: "Name", value: "name", sortable: false, width: "20%" },
        { text: "AE Title", value: "ae_title", sortable: false, width: "20%" },
        { text: "Data Origins", value: "data_origins", sortable: false, width: "20%" },
        { text: "Version", value: "version", sortable: false, width: "10%" },
        { text: "Description", value: "description", sortable: false, width: "28%" },
        { text: "Actions", value: "id", sortable: false, width: "210px" },
    ];

    loading = false;

    workflowPage: PaginatedWorkflowsResponse = {} as PaginatedWorkflowsResponse;
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
    } as DataOptions;

    deleteConfirm = false;
    workflowToDelete: WorkflowListItem | null = null;

    private throttledFetchWorkflows = throttle(() => {
        this.fetchWorkflows();
    }, 500);

    @Watch("tableOptions", { deep: true })
    tableOptionsChanged() {
        this.loading = true;
        this.throttledFetchWorkflows();
        this.loading = false;
    }

    confirmDeletion(workflow: WorkflowListItem) {
        this.workflowToDelete = workflow;
        this.deleteConfirm = true;
    }

    cancelWorkflowDeletion() {
        this.deleteConfirm = false;
        this.workflowToDelete = null;
    }

    navigateToWorkflowEditorCreate() {
        this.$router.push({
            name: "WorkflowEditor",
        });
    }

    navigateToWorkflowEditor(workflow_id: string, original_workflow_name: string) {
        this.$router.push({
            name: "WorkflowEditor",
            params: {
                workflow_id,
            },
            query: {
                original_workflow_name,
            },
        });
    }

    async deleteWorkflow() {
        if (!this.workflowToDelete) {
            return;
        }

        const responseOk = await deleteWorkflow(this.workflowToDelete.workflow_id);

        if (responseOk) {
            this.deleteConfirm = false;
            this.workflowToDelete = null;

            await this.fetchWorkflows();

            Vue.$toast.success("Workflow successfully deleted");
        }
    }

    private async fetchWorkflows(): Promise<void> {
        this.workflowPage = await getAllWorkflows({
            ...this.tableOptions,
        });
    }
}
</script>
