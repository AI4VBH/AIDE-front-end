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
    <v-row class="patient-header">
        <v-col data-cy="patient-name">
            <span class="header-label">Patient</span>
            <span v-if="!tasksLoading">{{ patientMetadata.patient_name }}</span>
            <v-skeleton-loader v-else class="mx-auto" max-width="300" type="text" />
        </v-col>
        <v-col data-cy="patient-dob">
            <span class="header-label">DoB</span>
            <span v-if="!tasksLoading">{{ patientMetadata.patient_dob | formatDate }}</span>
            <v-skeleton-loader v-else class="mx-auto" max-width="300" type="text" />
        </v-col>
        <v-col data-cy="patient-id">
            <span class="header-label">Patient ID</span>
            <span v-if="!tasksLoading">{{ patientMetadata.patient_id }}</span>
            <v-skeleton-loader v-else class="mx-auto" max-width="300" type="text" />
        </v-col>
        <v-col data-cy="patient-sex" class="narrow-column">
            <span class="header-label">Sex</span>
            <span v-if="!tasksLoading">{{ patientMetadata.patient_sex }}</span>
            <v-skeleton-loader v-else class="mx-auto" max-width="300" type="text" />
        </v-col>
        <v-col data-cy="study-date">
            <span class="header-label">Study Date</span>
            <span v-if="!tasksLoading">{{ studyDate | formatDate }}</span>
            <v-skeleton-loader v-else class="mx-auto" max-width="300" type="text" />
        </v-col>
        <v-col data-cy="task-actions" class="task-actions">
            <v-btn data-cy="accept-task" color="primary" :disabled="!studyDate" @click="acceptTask">
                Accept
            </v-btn>
            <v-btn data-cy="reject-task" :disabled="!studyDate" @click="rejectTask">Reject</v-btn>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { PatientMetadata } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDateTime, formatDate } from "@/utils/date-utilities";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    filters: {
        formatDate,
        formatDateTime,
    },
    emits: ["task-accepted", "task-rejected"],
    props: {
        patientMetadata: { type: Object as PropType<PatientMetadata> },
        studyDate: { type: String },
        tasksLoading: { type: Boolean },
    },
    methods: {
        acceptTask() {
            this.$emit("task-accepted");
        },
        rejectTask() {
            this.$emit("task-rejected");
        },
    },
});
</script>

<style lang="scss" scoped>
.patient-header {
    color: #000;

    > div {
        background-color: #fff;
        border-right: 1px solid rgba(0, 0, 0, 0.12);

        &:last-of-type {
            border: none;
        }
    }

    .narrow-column {
        width: 100px;
        flex: initial;
    }

    .task-actions {
        width: 250px;
        flex: initial;
        justify-content: center;
        align-items: center;
        display: flex;

        .v-btn:first-of-type {
            margin-right: 10px;
        }
    }
}

.header-label {
    font-weight: bold;
    display: block;
}
</style>
