<template>
    <v-card :loading="loading" elevation="0" class="task-list-container">
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

        <v-list dense nav class="task-list">
            <v-list-item-group mandatory v-model="currentTask">
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

        <v-pagination
            class="mt-1"
            :total-visible="5"
            :length="totalPages"
            v-model="currentPage"
            :disabled="totalPages <= 1 && currentPage == 1"
            @input="handlePageChange"
            data-cy="pagination"
        />
        <slot v-bind="{ throttledFetchTasks }" />
    </v-card>
</template>

<script lang="ts">
import { getClinicalReviewTasks } from "@/api/ClinicalReview/ClinicalReviewService";
import { ClinicalReviewTask } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDateAndTimeOfTypedArray } from "@/utils/date-utilities";
import TaskItem from "./task-item.vue";
import { debounce } from "underscore";
import { defineComponent } from "vue";

export default defineComponent({
    components: {
        TaskItem,
    },
    data() {
        return {
            search: "",
            loading: false,
            currentTask: "",
            currentPage: 1,
            totalPages: 1,
            searchParameter: "patientId",
            tasks: [] as ClinicalReviewTask[],
        };
    },
    emits: ["task-selected", "tasks-count-updated"],
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
    },
    methods: {
        async getTasks() {
            this.loading = true;

            const { data } = await getClinicalReviewTasks({
                pageNumber: this.currentPage,
                pageSize: 10,
                patientName: this.searchParameter === "patientName" ? this.search : "",
                patientId: this.searchParameter === "patientId" ? this.search : "",
                applicationName: this.searchParameter === "applicationName" ? this.search : "",
            });

            this.tasks = data;

            this.$emit("tasks-count-updated", this.tasks.length);

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
        }, 250),
    },
    mounted() {
        this.throttledFetchTasks();
    },
});
</script>

<style lang="scss" scoped>
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
    height: 100%;
}
</style>