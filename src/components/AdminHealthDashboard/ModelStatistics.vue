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
            <v-col cols="12">
                <h2 class="mx-auto section-title">Applications</h2>
            </v-col>
        </v-row>
        <v-row v-if="!loading">
            <v-col cols="12">
                <v-card class="px-5 py-2 rounded-lg" height="100%" elevation="1" shaped tile>
                    <v-row>
                        <v-col cols="8">
                            <v-col cols="5" class="header py-2">
                                <v-autocomplete
                                    :items="modelNames"
                                    v-model="selectedModel.model_name"
                                    v-on:change="changeSelectedModel"
                                    :menu-props="{ contentClass: 'model-names' }"
                                    label="Select a model"
                                    data-cy="dropdown"
                                />
                            </v-col>
                            <v-divider />
                            <div v-if="!loadingStats" class="ma-3">
                                <LineChart
                                    :chart-data="chartData"
                                    :chart-options="options"
                                    :height="200"
                                    data-cy="graph"
                                />
                            </div>
                            <div v-else class="text-center my-3">
                                <v-progress-circular
                                    indeterminate
                                    color="grey"
                                    data-cy="progress"
                                />
                            </div>
                        </v-col>
                        <v-divider class="my-1" vertical />
                        <v-col cols="4">
                            <div class="header d-flex flex-no-wrap">
                                <v-menu
                                    v-model="startDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto"
                                    data-cy="start-date"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="startDate"
                                            label="Start Date"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            data-cy="start-date-text"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="startDate"
                                        no-title
                                        @input="startDateMenu = false"
                                        v-on:change="changeSelectedModel"
                                    ></v-date-picker>
                                </v-menu>
                                <p class="my-auto mx-4 mx-sm-2">to</p>
                                <v-menu
                                    v-model="endDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto"
                                    data-cy="end-date"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="endDate"
                                            label="End Date"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            data-cy="end-date-text"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="endDate"
                                        no-title
                                        @input="endDateMenu = false"
                                        v-on:change="changeSelectedModel"
                                    ></v-date-picker>
                                </v-menu>
                            </div>
                            <v-divider />
                            <v-card-text v-if="!loadingStats">
                                <h2 class="mb-7 mt-4">Performance Stats</h2>
                                <div class="my-3 d-flex flex-no-wrap">
                                    <strong class="pt-1 pb-2">Status:</strong>
                                    <v-chip
                                        class="mx-2"
                                        color="light-green lighten-4"
                                        text-color="light-green darken-4"
                                        data-cy="status2"
                                    >
                                        <strong>{{ modelDetails.status }}</strong>
                                    </v-chip>
                                </div>
                                <div class="my-3 d-flex flex-no-wrap">
                                    <strong>Failure Rate:&nbsp;</strong>
                                    <span data-cy="failure-rate">{{ totalFailureRate }}</span>
                                    <span>%</span>
                                </div>
                                <div class="my-3 d-flex flex-no-wrap">
                                    <strong>Executions:&nbsp;</strong>
                                    <span data-cy="executions">{{ totalExecutions }}</span>
                                </div>
                                <div class="my-3 d-flex flex-no-wrap">
                                    <strong>Failures:&nbsp;</strong>
                                    <span data-cy="failures">{{ totalFailures }}</span>
                                </div>
                            </v-card-text>
                            <div v-else class="text-center my-3">
                                <v-progress-circular
                                    indeterminate
                                    color="grey"
                                    data-cy="progress"
                                />
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="8">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { getModels, getModelStatsForGraphs } from "@/api/Admin/AdminStatisticsService";
import { IModelDetails, IModelSummary, IModelStatistics } from "@/models/Admin/IModel";
import Vue from "vue";
import Component from "vue-class-component";
import LineChart from "../Charts/LineChart.vue";

@Component({
    components: {
        LineChart,
    },
})
export default class ModelStatistics extends Vue {
    loading = false;
    loadingStats = false;
    startDateMenu = false;
    endDateMenu = false;
    startDate = this.formatDate(new Date(Date.now() - 604800000));
    endDate = this.formatDate(new Date());
    modelDetails: IModelDetails | undefined;
    models: IModelSummary[] = [];
    modelNames: string[] = [];
    selectedModel = { model_id: 0, model_name: "" };
    totalExecutions = 0;
    totalFailures = 0;
    totalFailureRate = 0;

    chartData = {
        labels: [] as string[],
        datasets: [
            {
                label: "Executions",
                data: [] as number[],
                fill: false,
                borderColor: "#1F78B4",
                backgroundColor: "#1F78B4",
                borderWidth: 1,
            },
            {
                label: "Failures",
                data: [] as number[],
                fill: false,
                borderColor: "#A6CEE3",
                backgroundColor: "#A6CEE3",
                borderWidth: 1,
            },
        ],
    };

    async created(): Promise<void> {
        this.getAllModels();
    }

    async getAllModels(): Promise<void> {
        this.loading = true;
        await getModels()
            .then((response) => {
                this.models = response;
                this.selectedModel = response[0];

                response.forEach((model: IModelSummary) => {
                    this.modelNames.push(model.model_name);
                });

                this.selectedModel = this.models[0];
                this.getModelStatistics(this.selectedModel?.model_id);
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loading = false;
    }

    async getModelStatistics(model_id: number): Promise<void> {
        this.loadingStats = true;
        this.chartData.datasets[0].data = [];
        this.chartData.datasets[1].data = [];
        this.chartData.labels = [];
        await getModelStatsForGraphs(model_id, this.startDate, this.endDate)
            .then((response) => {
                this.modelDetails = response;
                response.days.forEach((stat: IModelStatistics) => {
                    this.chartData.datasets[0].data.push(stat.total_executions);
                    this.chartData.datasets[1].data.push(stat.total_failures);
                    this.chartData.labels.push(this.formatDateStringForLabel(stat.date));
                });

                this.calculateTotalValues();
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loadingStats = false;
    }

    calculateTotalValues() {
        const executions: number[] = [];
        const failures: number[] = [];

        if (this.modelDetails) {
            this.modelDetails.days.forEach((stat: IModelStatistics) => {
                executions.push(stat.total_executions);
                failures.push(stat.total_failures);
            });
        }

        this.totalExecutions = executions.reduce((partialSum, a) => partialSum + a, 0);
        this.totalFailures = failures.reduce((partialSum, a) => partialSum + a, 0);
        this.totalFailureRate = Number(
            ((this.totalFailures / this.totalExecutions) * 100).toFixed(2),
        );
    }

    calculateFailureRate() {
        const failures: number[] = [];

        if (this.modelDetails) {
            this.modelDetails.days.forEach((stat: IModelStatistics) => {
                failures.push(stat.total_failures);
            });
        }

        const sumOfFailures = failures.reduce((partialSum, a) => partialSum + a, 0);

        this.totalFailureRate = Number(((sumOfFailures / this.totalExecutions) * 100).toFixed(2));
        return this.totalFailureRate;
    }

    calculateTotalExecutions() {
        const executions: number[] = [];

        if (this.modelDetails) {
            this.modelDetails.days.forEach((stat: IModelStatistics) => {
                executions.push(stat.total_executions);
            });
        }

        this.totalExecutions = executions.reduce((partialSum, a) => partialSum + a, 0);
        return this.totalExecutions;
    }

    changeSelectedModel() {
        const modelIndex = this.modelNames.findIndex(
            (model: string) => model === this.selectedModel?.model_name,
        );
        if (this.selectedModel) {
            this.getModelStatistics(this.models[modelIndex].model_id);
        }
    }

    formatDate(date: Date) {
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        const year = date.getFullYear();
        return year + "-" + month + "-" + day;
    }

    formatDateStringForLabel(date: string) {
        date = date.replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        return date;
    }
}
</script>

<style scoped>
.header {
    height: 4rem;
}
</style>
