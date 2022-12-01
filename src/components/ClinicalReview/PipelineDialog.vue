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
    <v-dialog
        transition="dialog-bottom-transition"
        v-model="dialog3"
        max-width="80vw"
        style="overflow-x: hidden"
    >
        <template v-slot:default="dialog3">
            <v-card style="overflow-x: hidden">
                <div v-show="loading" class="pa-1 pb-2">
                    Please Wait...
                    <v-progress-linear indeterminate color="blue" class=""></v-progress-linear>
                </div>
                <div v-show="!loading && pipelines.length > 0" data-cy="pipeline-dialogue">
                    <v-toolbar color="#61366e" dark> Pipeline - {{ model_uid }} </v-toolbar>
                    <!-- <v-card-text> -->
                    <v-timeline align-top dense v-if="pipelines[0]" clipped>
                        <v-timeline-item small>
                            <v-row class="pt-1">
                                <v-col cols="3">
                                    <strong>Input Received</strong>
                                </v-col>
                                <v-col>
                                    <strong>Dicom Ingestor</strong>
                                    <div class="text-caption">
                                        {{ pipelines[0].timestamp.received_at | formatDate }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-timeline-item>
                        <v-timeline-item
                            v-for="pipeline in pipelines"
                            :key="pipeline.execution_uid"
                            :color="getStatusColor(pipeline.result)"
                            small
                        >
                            <v-row class="pt-1">
                                <v-col cols="3">
                                    <strong>{{ getStatus(pipeline.result) }}</strong>
                                </v-col>
                                <v-col>
                                    <strong>{{ pipeline.model.model_name }}</strong>
                                    <div class="text-caption">
                                        Inference Started :
                                        {{ pipeline.timestamp.inference_started | formatDate
                                        }}<br />
                                        Inference Finished :
                                        {{ pipeline.timestamp.inference_finished | formatDate }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-timeline-item>
                    </v-timeline>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="dialog3.value = false">Close</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { getExecutionPipelines } from "../../api/ClinicalReview/ExecutionService";
import { Execution } from "@/models/ClinicalReview/Execution";

@Component({})
export default class PipelineDialog extends Vue {
    dialog3 = false;
    pipelines: Array<Execution> = [];
    loading = true;
    model_uid = "";

    created(): void {
        EventBus.$on(
            "openPipelineDialog",
            (dialog3: boolean, correlation_id: string, model_uid: string) => {
                this.dialog3 = dialog3;
                this.pipelines = [];
                this.getPipeline(correlation_id);
                this.model_uid = model_uid ? model_uid : "";
            },
        );
    }

    async getPipeline(correlation_id: string): Promise<void> {
        this.loading = true;
        await getExecutionPipelines(correlation_id)
            .then((executions) => {
                this.pipelines = executions;
            })
            .catch((err) => {
                this.loading = false;
                this.dialog3 = false;
            });
        this.loading = false;
    }

    getStatus(result: any): string {
        if (result.status == "success") {
            return "Success";
        }

        if (result.status == "error") {
            return "Error";
        }

        if (result.status == "failed") {
            return "Failed";
        }

        return "Unknown";
    }

    getStatusColor(result: any): string {
        if (result.status == "success") {
            return "green";
        }

        if (result.status == "error") {
            return "amber";
        }

        if (result.status == "failed") {
            return "red";
        }

        return "red";
    }
}
</script>
