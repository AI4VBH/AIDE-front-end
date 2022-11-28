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
        <v-row><h2>Files</h2></v-row>
        <v-row justify="start" data-cy="specification-table" v-if="checkStandardFiles()">
            <template v-for="file in versionDetails.application_version_files">
                <v-col :key="file.label" md="auto" v-if="checkValidFileType(file.label)">
                    <v-hover v-slot="{ hover }">
                        <v-card
                            class="custom-card mx-auto my-0"
                            :elevation="hover ? 2 : 0"
                            :class="{ 'on-hover': hover }"
                            data-cy="file-card"
                            @click="$window.open(file.url)"
                        >
                            <v-row
                                justify="center"
                                class="px-0 py-0 mx-0 my-0"
                                data-cy="input-types-icon"
                            >
                                <v-icon size="60" class="my-2">{{ getIcon(file.label) }}</v-icon>
                            </v-row>
                            <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                                <v-card-title
                                    class="px-3 py-0 mx-0 my-0 fileTitle"
                                    data-cy="input-types-title"
                                    >{{ file.label | formatFileTitle }}</v-card-title
                                >
                            </v-row>
                        </v-card>
                    </v-hover>
                </v-col>
            </template>
        </v-row>
        <v-row v-else><p>No Standard files uploaded</p></v-row>
        <v-row><h2>Custom Files</h2></v-row>
        <v-row v-if="checkAdditionalFiles()">
            <v-col cols="12">
                <v-simple-table data-cy="custom-files">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th width="33%" class="text-left">Label</th>
                                <th class="text-left">Created</th>
                                <th class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="file in versionDetails.application_version_files">
                                <tr :key="file.label" v-if="!checkValidFileType(file.label)">
                                    <td
                                        data-cy="custom-file-label"
                                        style="text-transform: capitalize"
                                    >
                                        {{ file.label | formatFileTitle }}
                                    </td>
                                    <td data-cy="custom-file-date">
                                        {{ file.createdAt | formatDate }}
                                    </td>
                                    <td>
                                        <v-btn
                                            data-cy="custom-file-download"
                                            small
                                            color="primary"
                                            @click="$window.open(file.url)"
                                            >Download File</v-btn
                                        >
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row v-else><p>No files uploaded</p></v-row>
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
export default class Files extends Vue {
    @Prop() versionDetails!: VersionDetails;
    fileTypes = [
        { name: "clinical-safety-case", icon: "mdi-briefcase" },
        { name: "datasheet-for-datasets", icon: "mdi-book-open-page-variant" },
        { name: "declaration-of-conformity", icon: "mdi-marker-check" },
        { name: "instructions-for-use", icon: "mdi-alert-circle" },
        { name: "model-card", icon: "mdi-card-text" },
        { name: "research-protocol", icon: "mdi-magnify" },
        { name: "technical-file", icon: "mdi-cog" },
    ];

    getIcon(label: string) {
        return this.fileTypes.find((fileType) => fileType.name.includes(label))?.icon;
    }

    checkValidFileType(label: string) {
        if (this.fileTypes.some((fileType) => fileType.name.includes(label))) {
            return true;
        } else {
            return false;
        }
    }

    checkStandardFiles() {
        for (const file of this.versionDetails.application_version_files) {
            if (this.fileTypes.some((fileType) => fileType.name.includes(file.label))) {
                return true;
            }
        }
        return false;
    }

    checkAdditionalFiles() {
        for (const file of this.versionDetails.application_version_files) {
            if (!this.fileTypes.some((fileType) => fileType.name.includes(file.label))) {
                return true;
            }
        }
        return false;
    }
}
</script>
<style>
.fileTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    text-transform: capitalize;
    word-break: break-word;
}
</style>
