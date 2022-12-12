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
    <v-container fluid class="clinical-review-container">
        <patient-header
            v-if="taskCount > 0 && currentTaskClinicalReviewMessage"
            :patient-metadata="currentTaskClinicalReviewMessage.patient_metadata"
            :study-date="studyDate"
            @task-accepted="acceptTask"
            @task-rejected="rejectTask"
        />
        <v-row class="clinical-review">
            <v-col class="task-list" v-show="!tasksLoading && (taskCount > 0 || searchText !== '')">
                <clinical-review-task-list
                    @task-selected="taskSelected"
                    @tasks-count-updated="taskCountUpdated"
                    @search-text-updated="searchTextUpdated"
                    @tasks-loading-changed="tasksLoadingChanged"
                >
                    <template v-slot="{ throttledFetchTasks }">
                        <v-dialog :value="actionModal" persistent max-width="500px">
                            <accept-reject-dialog
                                v-if="currentTaskClinicalReviewMessage"
                                :open="actionModal"
                                :reject="reject"
                                :application-name="
                                    currentTaskClinicalReviewMessage.application_metadata
                                        .application_name
                                "
                                @cancel="actionModal = false"
                                @perform-action="(data) => performAction(data, throttledFetchTasks)"
                            />
                        </v-dialog>
                    </template>
                </clinical-review-task-list>
            </v-col>
            <v-col class="dicom-view">
                <dicom-view
                    v-if="currentTaskExecutionId"
                    :task-execution-id="currentTaskExecutionId"
                    @study-selected="studySelected"
                />

                <div
                    v-if="
                        !currentTaskExecutionId &&
                        !tasksLoading &&
                        taskCount === 0 &&
                        searchText === ''
                    "
                    class="no-tasks-left"
                >
                    <v-icon x-large color="success">mdi-checkbox-marked-circle-outline</v-icon>
                    <p class="mt-2" data-cy="no-tasks-message">
                        There are no application outputs left to review
                    </p>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from "vue";
import DicomView from "@/components/clinical-review/dicom-view.vue";
import ClinicalReviewTaskList from "@/components/clinical-review/tasks/task-list.vue";
import { updateClinicalReview } from "../api/ClinicalReview/ClinicalReviewService";
import PatientHeader from "@/components/clinical-review/patient-header.vue";
import AcceptRejectDialog from "@/components/clinical-review/accept-reject-dialog.vue";
import {
    ClinicalReviewRecord,
    ClinicalReviewStudyDetails,
    ClinicalReviewTaskDetails,
} from "@/models/ClinicalReview/ClinicalReviewTask";

type ClinicalReviewData = {
    currentTaskExecutionId?: string;
    currentTaskClinicalReviewMessage?: ClinicalReviewTaskDetails;
    taskCount: number;
    searchText: string;
    tasksLoading: boolean;
    actionModal: boolean;
    reject: boolean;
    studyDate?: string;
};

export default defineComponent({
    metaInfo: {
        title: "Clinical Review",
    },
    components: {
        DicomView,
        ClinicalReviewTaskList,
        PatientHeader,
        AcceptRejectDialog,
    },
    data(): ClinicalReviewData {
        return {
            currentTaskExecutionId: "",
            currentTaskClinicalReviewMessage: undefined,
            studyDate: "",
            taskCount: 0,
            searchText: "",
            tasksLoading: true,
            actionModal: false,
            reject: false,
        };
    },
    mounted() {
        const html = document.querySelector("html");
        html!.style.overflow = "hidden";
    },
    beforeDestroy() {
        const html = document.querySelector("html");
        html!.style.overflow = "";
    },
    methods: {
        taskSelected(execution_id: string, task: ClinicalReviewRecord) {
            this.currentTaskExecutionId = execution_id;
            this.currentTaskClinicalReviewMessage = task.clinical_review_message;
        },
        taskCountUpdated(count: number) {
            this.taskCount = count;
        },
        searchTextUpdated(searchText: string) {
            this.searchText = searchText;
        },
        studySelected(study: ClinicalReviewStudyDetails) {
            this.studyDate = study.study_date;
        },
        tasksLoadingChanged(loading: boolean) {
            this.tasksLoading = loading;
        },
        acceptTask() {
            this.actionModal = true;
            this.reject = false;
        },
        rejectTask() {
            this.actionModal = true;
            this.reject = true;
        },
        async performAction(
            data: { reason: string | undefined; description: string; acceptance: boolean },
            fetchTasks: () => void,
        ) {
            if (!this.currentTaskExecutionId) {
                return;
            }

            const responseOk = await updateClinicalReview(
                this.currentTaskExecutionId,
                data.acceptance,
                data.description,
                data.acceptance ? undefined : data.reason,
            );

            if (responseOk) {
                Vue.$toast.success(
                    `Clinical Review has been ${!data.acceptance ? "rejected" : "accepted"}`,
                );
                this.actionModal = false;
                fetchTasks();
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.headerLabel {
    color: #424242;
    font-weight: bold;
    line-height: 24px;
    vertical-align: middle;
}

.clinical-review-container {
    height: 100%;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > .row {
        margin: 0;
    }
}

.patient-header {
    background-color: #fff;
    height: 80px;
}

.clinical-review {
    margin: 0;
    height: 100%;
    min-width: 1000px;

    > .col {
        padding: 0;
    }

    .task-list {
        width: 350px;
        flex: initial;
        display: flex;
    }
}

.no-tasks-left {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
}
</style>
