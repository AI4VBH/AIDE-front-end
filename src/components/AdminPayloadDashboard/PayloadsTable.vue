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
    <v-container class="mt-3 mb-7">
        <v-row class="mb-5">
            <v-col class="col-sm-8 col-xl-9">
                <h2 class="mx-auto section-title">Payloads/Inputs</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-layout v-show="!loading" child-flex>
                <v-card>
                    <v-card-title>
                        <v-spacer />
                        <v-radio-group row v-model="searchParameter" label="Search by" class="mr-4">
                            <v-radio
                                label="Patient ID"
                                data-cy="patient-id-radio-btn"
                                value="patientId"
                            />
                            <v-radio
                                label="Patient Name"
                                data-cy="patient-name-radio-btn"
                                value="patientName"
                            />
                        </v-radio-group>
                        <v-text-field
                            v-model="tableSearch"
                            append-icon="mdi-magnify"
                            style="max-width: 30%"
                            label="Search"
                            single-line
                            outlined
                            dense
                            hide-details
                            data-cy="search-payloads-table"
                        />
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="paginatedPayloads.data"
                        :search="tableSearch"
                        :server-items-length="paginatedPayloads.totalRecords"
                        :footer-props="{ itemsPerPageOptions: [5, 10] }"
                        :options.sync="tableOptions"
                        show-expand
                        expand-icon="mdi-menu-down"
                        @item-expanded="onExpand"
                        single-expand
                        :expanded.sync="expanded"
                        item-key="payload_id"
                        class="elevation-1"
                        data-cy="payload"
                        @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
                    >
                        <template v-slot:no-data>
                            <span class="grey--text text--darken-3">No data available</span>
                        </template>
                        <template v-slot:no-results>
                            <span class="grey--text text--darken-3">No results found</span>
                        </template>
                        <template v-slot:[`item.patient_name`]="{ item, index }">
                            <strong :data-cy="`patient-name-payload-${index}`">
                                {{ item.patient_name }}
                            </strong>
                        </template>
                        <template v-slot:[`item.patient_id`]="{ item, index }">
                            <span :data-cy="`patient-id-payload-${index}`">
                                {{ item.patient_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.payload_id`]="{ item, index }">
                            <span :data-cy="`payload-id-${index}`">
                                {{ item.payload_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.payload_received`]="{ item, index }">
                            <span :data-cy="`payload-received-${index}`">
                                {{ item.payload_received }}
                            </span>
                        </template>
                        <template v-slot:[`expanded-item`]="{ item }">
                            <td :colspan="5">
                                <ExecutionTree
                                    :key="renderKey"
                                    :payload-id="item.payload_id"
                                    :selectedExecutionId="selectedExecutionID"
                                />
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-layout>
            <v-col v-if="loading" cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getPayloadById, getPayloads } from "@/api/Admin/payloads/PayloadService";
import { IPayload } from "@/models/Admin/IPayload";
import ExecutionTree from "@/components/AdminPayloadDashboard/ExecutionTree.vue";
import { formatDateAndTimeOfArray } from "@/utils/date-utilities";
import { DataOptions } from "vuetify";
import { Watch } from "vue-property-decorator";
import { throttle } from "underscore";
import { IPagedResponse } from "@/models/common/IPagedResponse";

@Component({
    components: {
        ExecutionTree,
    },
})
export default class PayloadsTable extends Vue {
    loading = false;
    paginatedPayloads: IPagedResponse<IPayload> = {} as IPagedResponse<IPayload>;
    renderKey = 0;
    searchParameter = "patientId";
    tableSearch = "";
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
    } as DataOptions;
    selectedPayloadID = "";
    selectedExecutionID = "";
    expanded: unknown[] = [];

    headers = [
        { text: "Patient Name", value: "patient_name", sortable: false },
        { text: "Patient ID", value: "patient_id", sortable: false },
        { text: "Payload ID", value: "payload_id", sortable: false },
        { text: "Payload Received", value: "payload_received", sortable: false },
        { text: "", value: "data-table-expand" },
    ];

    onExpand() {
        this.renderKey++;
    }

    mounted() {
        this.selectedPayloadID = this.$route.query.payload_id as string;
        this.selectedExecutionID = this.$route.query.execution_id as string;
    }

    private throttledGetPaginatedPayloads = throttle(() => {
        this.getPaginatedPayloads();
    }, 500);

    @Watch("tableOptions")
    async tableOptionsChanged() {
        this.loading = true;
        this.throttledGetPaginatedPayloads();
        this.loading = false;
    }

    @Watch("searchParameter")
    async tableSearchParameterChanged() {
        this.throttledGetPaginatedPayloads();
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        this.throttledGetPaginatedPayloads();
    }

    private async getPaginatedPayloads(): Promise<void> {
        this.paginatedPayloads = await getPayloads({
            patientName: this.searchParameter === "patientName" ? this.tableSearch : "",
            patientId: this.searchParameter === "patientId" ? this.tableSearch : "",
            ...this.tableOptions,
        });
        formatDateAndTimeOfArray(this.paginatedPayloads.data, "payload_received");

        if (this.selectedPayloadID) {
            let selectedPayload = this.paginatedPayloads.data.find(
                (p) => p.payload_id === this.selectedPayloadID,
            );

            if (!selectedPayload) {
                const payload = await getPayloadById(this.selectedPayloadID);

                if (payload) {
                    this.paginatedPayloads.data.push(payload);
                    selectedPayload = payload;
                }
            }

            this.expanded = [selectedPayload];
        }
    }
}
</script>

<style scoped>
.v-data-table >>> .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
}

.v-data-table >>> .v-data-table__wrapper tbody tr.v-data-table__expanded__content td {
    padding: 0;
}

.v-data-table >>> .v-data-table__expand-icon {
    color: #61366e !important;
}
</style>
