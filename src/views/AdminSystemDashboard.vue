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
        <!-- Overview -->
        <!-- <DashboardOverview /> -->

        <!-- <v-divider /> -->

        <!-- Issues -->
        <IssuesTable />

        <!-- <v-divider /> -->

        <!-- Models -->
        <!-- <ModelStatistics /> -->
    </v-container>
</template>

<script lang="ts">
import DashboardOverview from "../components/AdminHealthDashboard/DashboardOverview.vue";
import IssuesTable from "@/components/AdminHealthDashboard/IssuesTable.vue";
import ModelStatistics from "@/components/AdminHealthDashboard/ModelStatistics.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    metaInfo: {
        title: "System Dashboard",
    },
    components: {
        DashboardOverview,
        IssuesTable,
        ModelStatistics,
    },
})
export default class AdminHealthDashboard extends Vue {}
</script>
