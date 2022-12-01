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
    <v-list-item :data-cy="patient.patient_id" :value="execution_id" role="listitem">
        <v-list-item-content>
            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-title data-cy="patient-name" v-on="on">
                        {{ patient.patient_name }}
                    </v-list-item-title>
                </template>
                <span>
                    {{ patient.patient_name }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="patient-id" v-on="on">
                        <strong>Patient ID:</strong>
                        {{ patient.patient_id }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_id }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="patient-age" v-on="on">
                        <strong>Age:</strong>
                        {{ patient.patient_age }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_age }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="patient-sex" v-on="on">
                        <strong>Sex:</strong>
                        {{ patient.patient_sex }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_sex }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="application" v-on="on">
                        <strong>Application:</strong>
                        {{ application.application_name }} - {{ application.application_version }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ application.application_name }} - {{ application.application_version }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="mode" v-on="on">
                        <strong>Mode:</strong>
                        {{ application.application_mode }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ application.application_mode }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle data-cy="received" v-on="on">
                        <strong>Received:</strong>
                        {{ received | formatDateTime }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ received | formatDateTime }}
                </span>
            </v-tooltip>
        </v-list-item-content>
    </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ApplicationMetadata, PatientMetadata } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDateTime } from "@/utils/date-utilities";

export default defineComponent({
    filters: {
        formatDateTime,
    },
    props: {
        execution_id: { type: String },
        patient: { type: Object as PropType<PatientMetadata> },
        application: { type: Object as PropType<ApplicationMetadata> },
        received: { type: String },
    },
});
</script>

<style lang="scss" scoped>
.v-list-item__subtitle,
.v-list-item__title {
    color: #000 !important;
}
</style>
