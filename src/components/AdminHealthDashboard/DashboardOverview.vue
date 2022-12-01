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
            <v-col class="col-md-7 col-xl-9">
                <h2 class="mx-auto section-title">Executions</h2>
            </v-col>
            <v-col class="col-md-5 col-xl-3 pr-0">
                <v-btn text class="no-uppercase">Show</v-btn>
                <v-btn
                    elevation="0"
                    rounded
                    class="no-uppercase purple--text text--darken-4"
                    :color="selectedFilterPeriod === 'day' ? '#DBC4E2' : 'white'"
                    @click="setSelectedFilterPeriod('day')"
                    >24 Hours</v-btn
                >
                <v-btn
                    elevation="0"
                    rounded
                    class="no-uppercase purple--text text--darken-4"
                    :color="selectedFilterPeriod === 'week' ? '#DBC4E2' : 'white'"
                    @click="setSelectedFilterPeriod('week')"
                    >Weekly</v-btn
                >
                <v-btn
                    elevation="0"
                    rounded
                    class="no-uppercase purple--text text--darken-4"
                    :color="selectedFilterPeriod === 'month' ? '#DBC4E2' : 'white'"
                    @click="setSelectedFilterPeriod('month')"
                    >Monthly</v-btn
                >
            </v-col>
        </v-row>
        <v-row>
            <v-col class="col-sm-3 col-xl-2">
                <v-card
                    v-if="!loading && overview !== undefined"
                    class="stats-card mx-1 px-5 py-2 rounded-lg"
                    data-cy="model-failures-card"
                    :style="
                        overview.model_failures > 0
                            ? 'border: 1px solid #D32F2F;'
                            : 'border: 1px solid white;'
                    "
                    height="100%"
                    elevation="1"
                    shaped
                    tile
                >
                    <v-card-text>
                        <div class="d-flex">
                            <h1
                                data-cy="model-failures"
                                :class="{
                                    'red--text text--darken-2': overview.model_failures > 0,
                                }"
                            >
                                {{ overview.model_failures }} of&nbsp;
                            </h1>
                            <h1
                                data-cy="model-failures-executions"
                                :class="{
                                    'red--text text--darken-2': overview.model_failures > 0,
                                }"
                            >
                                {{ overview.model_executions }}
                            </h1>
                        </div>
                        <h2 class="pt-5">Model Failures</h2>
                    </v-card-text>
                </v-card>
                <v-skeleton-loader v-else class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col class="col-sm-3 col-xl-2">
                <v-card
                    v-if="!loading && overview !== undefined"
                    class="stats-card mx-1 px-5 py-2 rounded-lg"
                    height="100%"
                    elevation="1"
                    shaped
                    tile
                >
                    <v-card-text>
                        <h1 data-cy="model-executions">
                            {{ overview.model_executions }}
                        </h1>
                        <h2 class="pt-5">Model Executions</h2>
                    </v-card-text>
                </v-card>
                <v-skeleton-loader v-else class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col class="col-sm-3 col-xl-2">
                <v-card
                    v-if="!loading && overview !== undefined"
                    class="stats-card mx-1 px-5 py-2 rounded-lg"
                    height="100%"
                    elevation="1"
                    shaped
                    tile
                >
                    <v-card-text>
                        <h1 data-cy="model-numbers">
                            {{ overview.deployed_models }}
                        </h1>
                        <h2 class="pt-5">Number of Models</h2>
                    </v-card-text>
                </v-card>
                <v-skeleton-loader v-else class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { getOverview } from "@/api/Admin/AdminStatisticsService";
import { IOverview } from "@/models/Admin/IOverview";
import Vue from "vue";
import Component from "vue-class-component";

enum FilterPeriod {
    Day = "day",
    Week = "week",
    Month = "month",
}

@Component({
    components: {},
})
export default class DashboardOverview extends Vue {
    selectedFilterPeriod: FilterPeriod = FilterPeriod.Day;
    overview: IOverview | undefined;
    loading = false;

    async created(): Promise<void> {
        this.getExecutionStatistics(this.selectedFilterPeriod);
    }

    async getExecutionStatistics(selectedFilterPeriod: FilterPeriod): Promise<void> {
        this.loading = true;
        await getOverview(selectedFilterPeriod)
            .then((executionStats) => {
                this.overview = executionStats;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loading = false;
    }

    setSelectedFilterPeriod(selection: FilterPeriod): void {
        this.selectedFilterPeriod = selection;
        this.getExecutionStatistics(this.selectedFilterPeriod);
    }
}
</script>

<style scoped>
.stats-card {
    width: 270px;
}
</style>
