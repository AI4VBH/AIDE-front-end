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
    <v-col cols="12">
        <v-row><h2>Certification</h2></v-row>
        <v-row
            ><p data-cy="certification-details">
                {{ versionDetails.certification_details }}
            </p></v-row
        >
        <v-row justify="left" data-cy="specification-table">
            <v-col md="auto">
                <v-hover v-slot="{ hover }">
                    <!-- CE -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 0 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="ce-certification"
                        v-if="versionDetails.ce_certified"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/CE.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="ce-title">CE</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col md="auto">
                <v-hover v-slot="{ hover }">
                    <!-- UKCA -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 0 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="ukca-certification"
                        v-if="certification.ukca_certified"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/UKCA.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="ukca-title">UKCA</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col md="auto">
                <v-hover v-slot="{ hover }">
                    <!-- FDA -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 0 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="fda-certification"
                        v-if="certification.fda_certified"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/FDA.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="fda-title">FDA</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VersionDetails } from "@/models/AppRepo/Application";

@Component({
    components: {},
})
export default class Certification extends Vue {
    @Prop() versionDetails!: VersionDetails;
}
</script>
