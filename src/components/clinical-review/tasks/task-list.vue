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
    <v-card elevation="0" class="task-list-container">
        <div class="text-h6 task-list-title">Work List</div>

        <v-radio-group
            data-cy="radio-buttons"
            column
            class="my-0 mx-4"
            v-model="searchParameter"
            label="Search by"
        >
            <v-radio
                class="radio-btn"
                label="Patient ID"
                data-cy="patient-id-radiobtn"
                value="patientId"
            />
            <v-radio
                class="radio-btn"
                label="Patient Name"
                data-cy="patient-name-radiobtn"
                value="patientName"
            />
            <v-radio
                class="radio-btn"
                label="Application Name"
                data-cy="application-name-radiobtn"
                value="applicationName"
            />
        </v-radio-group>

        <v-text-field
            outlined
            dense
            class="px-2"
            label="Search Tasks"
            placeholder="Search Tasks"
            v-model="search"
            clearable
            @click:clear="clearSearch"
            data-cy="worklist-search"
        />

        <div v-if="!loading" class="task-list">
            <div v-show="tasks.length == 0" class="empty-task-list">
                <div>
                    <v-icon x-large color="red">mdi-close-circle-outline</v-icon>
                </div>
                <p class="mt-2" data-cy="no-tasks-message">
                    Your search returned no application outputs
                </p>
            </div>
            <div v-show="tasks.length > 0" class="task-list-scroll">
                <v-list dense nav>
                    <v-list-item-group mandatory v-model="currentTask" role="group">
                        <task-item
                            v-for="task in tasks"
                            :key="task.clinical_review_message.execution_id"
                            :execution_id="task.clinical_review_message.execution_id"
                            :application="task.clinical_review_message.application_metadata"
                            :patient="task.clinical_review_message.patient_metadata"
                            :received="task.received"
                        />
                    </v-list-item-group>
                </v-list>
            </div>
        </div>

        <v-pagination
            v-if="!loading"
            class="mt-1"
            :total-visible="5"
            :length="totalPages"
            v-model="currentPage"
            :disabled="totalPages <= 1 && currentPage == 1"
            @input="handlePageChange"
            data-cy="pagination"
        />
        <slot v-bind="{ throttledFetchTasks }" />
        <v-col v-if="loading" cols="12">
            <v-skeleton-loader v-if="loading" class="mx-auto" max-width="300" type="card" />
        </v-col>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "underscore";
import TaskItem from "./task-item.vue";
import { getClinicalReviewTasks } from "@/api/ClinicalReview/ClinicalReviewService";
import { ClinicalReviewRecord } from "@/models/ClinicalReview/ClinicalReviewTask";

interface IClinicalReviewTaskListData {
    search: string;
    loading: boolean;
    currentTask: string;
    currentPage: number;
    totalPages: number;
    searchParameter: string;
    tasks: ClinicalReviewRecord[];
}

export default defineComponent({
    components: {
        TaskItem,
    },
    data(): IClinicalReviewTaskListData {
        return {
            search: "",
            loading: true,
            currentTask: "",
            currentPage: 1,
            totalPages: 1,
            searchParameter: "patientId",
            tasks: [],
        };
    },
    emits: ["task-selected", "tasks-count-updated", "tasks-loading-changed", "search-text-updated"],
    watch: {
        search() {
            this.throttledFetchTasks();
        },
        searchParameter() {
            if (this.search === "") {
                return;
            }

            this.throttledFetchTasks();
        },
        currentTask() {
            this.$emit(
                "task-selected",
                this.currentTask,
                this.tasks.find((t) => t.clinical_review_message.execution_id === this.currentTask),
            );
        },
        loading() {
            this.$emit("tasks-loading-changed", this.loading);
        },
    },
    methods: {
        async getTasks() {
            this.loading = true;

            const { data, pageNumber, totalPages } = await getClinicalReviewTasks({
                pageNumber: this.currentPage,
                pageSize: 10,
                patientName: this.searchParameter === "patientName" ? this.search : "",
                patientId: this.searchParameter === "patientId" ? this.search : "",
                applicationName: this.searchParameter === "applicationName" ? this.search : "",
            });

            this.tasks = data;
            this.currentPage = pageNumber;
            this.totalPages = totalPages;

            this.$emit("tasks-count-updated", this.tasks.length);
            this.$emit("search-text-updated", this.search);

            this.loading = false;
        },
        async handlePageChange(page: number) {
            this.currentPage = page;
            await this.getTasks();
        },
        clearSearch() {
            this.search = "";
        },
        throttledFetchTasks: debounce(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.getTasks();
        }, 500),
    },
    mounted() {
        this.throttledFetchTasks();
    },
});
</script>

<style lang="scss" scoped>
::v-deep .v-input {
    flex: initial;
}

.task-list-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.12);

    .task-list-title {
        padding: 12px 16px;
    }
}

.task-list {
    flex: 1;
    overflow: hidden;
    position: relative;

    .task-list-scroll {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
    }
}

.empty-task-list {
    padding-left: 8px;
    padding-right: 8px;

    div {
        text-align: center;
    }
}
</style>
