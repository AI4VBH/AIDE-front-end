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
        <div class="d-flex mb-4 justify-space-between">
            <h2 class="section-title mb-4">Workflow Editor</h2>
            <v-btn
                class="secondary-button"
                data-cy="view-workflow-spec"
                link="true"
                :href="workflowSpecUrl"
                target="_blank"
            >
                View Specification on GitHub
            </v-btn>
        </div>
        <div v-if="workflowErrors.length > 0">
            <ErrorMessageContainer
                title="Workflow validation failed because of the following reasons:"
                :errorMessages="workflowErrors"
            />
        </div>
        <div v-show="!loading">
            <JSONViewer
                mode="text"
                :content="content"
                :onChange="onChange"
                :readOnly="readOnly"
                :mainMenuBar="false"
            />
        </div>
        <v-col v-show="!loading" class="text-right">
            <v-btn
                class="mx-1 secondary-button"
                data-cy="discard-workflow-changes"
                @click="discardChangesConfirm = true"
            >
                Discard
                <v-icon class="ml-1">mdi-delete</v-icon>
            </v-btn>
            <v-btn
                :disabled="!changed || !validJSON"
                class="mx-1 primary-button"
                data-cy="save-workflow-changes"
                @click="editConfirm = true"
            >
                Save changes
                <v-icon class="ml-1">mdi-floppy</v-icon>
            </v-btn>
        </v-col>

        <v-col v-if="loading" cols="12">
            <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </v-col>

        <confirmation-modal
            :persistent="true"
            v-model="editConfirm"
            title="Confirm changes"
            continue-btn-text="Confirm"
            data-cy-prefix="workflow-edit-confirm"
            @cancel="editConfirm = false"
            @continue="saveWorkflowChanges"
        >
            Are you sure you wish to make these changes to the workflow?
        </confirmation-modal>

        <confirmation-modal
            :persistent="true"
            v-model="discardChangesConfirm"
            title="Discard changes"
            continue-btn-text="Confirm"
            data-cy-prefix="workflow-discard-confirm"
            :deletionModal="true"
            @cancel="discardChangesConfirm = false"
            @continue="routeBackToWorkflows"
        >
            Are you sure you wish to discard the changes to the workflow?
        </confirmation-modal>
    </v-container>
</template>

<script lang="ts">
import { createWorkflow, getWorkflow, updateWorkflow } from "@/api/workflows/WorkflowService";
import ConfirmationModal from "@/components/Shared/ConfirmationModal.vue";
import ErrorMessageContainer from "@/components/Shared/ErrorMessageContainer.vue";
import { MonaiWorkflow, WorkflowError } from "@/models/workflows/Workflow";
import { isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";
import { ContentParseError, ContentValidationErrors, OnChangeStatus } from "vanilla-jsoneditor";
import Vue from "vue";
import Component from "vue-class-component";
import { Dictionary } from "vue-router/types/router";
import JSONViewer from "../components/Shared/JSONViewer.vue";

@Component({
    metaInfo: {
        title: "Workflow Editor",
    },
    components: {
        JSONViewer,
        ErrorMessageContainer,
        ConfirmationModal,
    },
    computed: {
        content() {
            const workflow = this.$data.workflow?.workflow;

            if (workflow) {
                return { json: workflow };
            }

            return { json: {} };
        },
    },
})
export default class WorkflowEditor extends Vue {
    workflow: MonaiWorkflow = {} as MonaiWorkflow;
    workflowToSave = {};
    workflowErrors: string[] = [];

    loading = false;

    readOnly = false;
    validJSON = true;

    editConfirm = false;
    discardChangesConfirm = false;
    changed = false;

    workflowSpecUrl = process.env.VUE_APP_WORKFLOW_SPEC_URL;

    async mounted() {
        const { workflow_id } = this.$route.params as Dictionary<string>;
        const { original_workflow_name } = this.$route.query as Dictionary<string>;

        if (workflow_id && original_workflow_name) {
            this.loading = true;
            this.workflow = await getWorkflow(workflow_id);
            this.loading = false;
        }
    }

    onChange(
        { text }: { text: string },
        _previousContent: { text: string },
        { contentErrors }: OnChangeStatus,
    ) {
        this.changed = true;
        this.validJSON =
            !(contentErrors as ContentParseError).parseError &&
            !((contentErrors as ContentValidationErrors)?.validationErrors ?? []).length;

        if (this.validJSON) {
            this.workflowToSave = JSON.parse(text);
        }
    }

    async saveWorkflowChanges() {
        const { workflow_id } = this.$route.params as Dictionary<string>;
        const { original_workflow_name } = this.$route.query as Dictionary<string>;

        const workflowObject = { workflow: this.workflowToSave };

        if (workflow_id && original_workflow_name) {
            const workflowUpdatedResponse = await updateWorkflow(
                workflow_id,
                workflowObject,
                original_workflow_name,
            );
            const workflowUpdateSuccess = "Workflow updated successfully";
            this.handleWorkflowSaving(workflowUpdatedResponse, workflowUpdateSuccess);
            return;
        }

        const workflowCreatedResponse = await createWorkflow(workflowObject);
        const workflowCreationSuccess = "Workflow created successfully";
        this.handleWorkflowSaving(workflowCreatedResponse, workflowCreationSuccess);
    }

    handleWorkflowSaving(result: AxiosResponse | AxiosError, toastSuccess: string) {
        if (isResultOk(result as AxiosResponse)) {
            this.routeBackToWorkflows();
            Vue.$toast.success(toastSuccess);
            return;
        } else if ((result as AxiosError).response?.status === 400) {
            this.editConfirm = false;
            this.workflowErrors = this.formatErrorMessages(
                ((result as AxiosError).response?.data as WorkflowError).detail,
            );
            return;
        } else {
            this.editConfirm = false;
            return;
        }
    }

    routeBackToWorkflows() {
        this.$router.push({
            name: "Workflows",
        });
    }

    formatErrorMessages(workflowError: string): string[] {
        return workflowError.split(",");
    }
}
</script>

<style scoped>
.json-editor {
    height: 730px;
}
</style>

<style>
.jse-contents {
    height: inherit;
    overflow-y: scroll;
}

.jse-status-bar-info.svelte-1oo7hnc:nth-child(1),
.jse-status-bar-info.svelte-1oo7hnc:nth-child(2),
.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement,
div.cm-line,
div.cm-gutterElement {
    color: black;
}

span[title] {
    font-weight: bold;
}

div.jse-message.jse-error.svelte-kvi5ls,
div.jse-button.jse-action.jse-primary.svelte-kvi5ls {
    background: #b51c1c !important;
}

.ͼq {
    color: #a14600 !important;
}

.ͼp {
    color: #ab2415 !important;
}
</style>
