<!--
  Copyright 2022 Crown Copyright

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
        <v-row><h2 data-cy="system-requirements">System Requirements</h2></v-row>
        <v-row justify="left" data-cy="system-requirements-icons"
            ><template>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <!-- GPU memory -->
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="min-gpu-memory-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="min-gpu-memory-icon"
                                    >mdi-expansion-card</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-gpu-memory-value"
                                    >{{
                                        versionDetails.min_gpu_memory | formatNumber
                                    }}
                                    GB</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-gpu-memory-title"
                                    >GPU memory</v-card-title
                                >
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <!-- Number of Cores -->
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="min-cpu-cores-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="min-cpu-cores-icon"
                                    >mdi-cpu-64-bit</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-cpu-cores-value"
                                    >{{ versionDetails.min_cpu_cores | formatNumber }}</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-cpu-cores-title"
                                    >Number of Cores</v-card-title
                                >
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <!-- Disk spaces -->
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="min-disk-space-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="min-disk-space-icon"
                                    >mdi-harddisk</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-disk-space-value"
                                    >{{
                                        versionDetails.min_disk_space | formatNumber
                                    }}
                                    GB</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="min-disk-space-title"
                                    >Disk space</v-card-title
                                >
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <!-- Ram -->
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="min-ram-mb-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="min-ram-mb-icon"
                                    >mdi-memory</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-ram-mb-value"
                                    >{{ versionDetails.min_ram | formatNumber }} GB</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-ram-mb-title"
                                    >Ram</v-card-title
                                >
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
            </template></v-row
        >
        <v-row><h2 data-cy="input-output-types">Input and Output Types</h2></v-row>
        <v-row justify="left" data-cy="input-output-icons"
            ><template>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="input-types-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="input-types-icon"
                                    >mdi-import</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="input-types-title"
                                    >Input Types</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-chip-group data-cy="input-types-values" column>
                                    <v-chip
                                        x-small
                                        color="#615F69"
                                        disabled
                                        dark
                                        data-cy="input-types-value"
                                        v-for="type in versionDetails.input_types"
                                        v-bind:key="type"
                                        >{{ type.name }}</v-chip
                                    >
                                </v-chip-group>
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
                <v-col md="auto">
                    <v-hover v-slot="{ hover }">
                        <v-card
                            class="custom-card mx-auto my-5"
                            :elevation="hover ? 0 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="application-card"
                        >
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-icon size="60" class="my-2" data-cy="output-types-icon"
                                    >mdi-export</v-icon
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-0 py-0 mx-0 my-0"
                                    data-cy="output-types-title"
                                    >Output Types</v-card-title
                                >
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-chip-group column data-cy="output-types-values">
                                    <v-chip
                                        x-small
                                        color="#615F69"
                                        disabled
                                        dark
                                        data-cy="output-types-value"
                                        v-for="type in versionDetails.output_types"
                                        v-bind:key="type"
                                        >{{ type.name }}</v-chip
                                    >
                                </v-chip-group>
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
            </template></v-row
        >
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
export default class SystemRequirements extends Vue {
    @Prop() versionDetails!: VersionDetails;
}
</script>
