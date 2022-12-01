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
        <v-row><h2 data-cy="versions-title">Version History</h2></v-row>
        <v-row>
            <v-col md="12">
                <v-simple-table data-cy="versions">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th width="33%" class="text-left">Version</th>
                                <th class="text-left">Created</th>
                                <th class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="version in sortedVersions" :key="version">
                                <td data-cy="history-version">{{ version.version_string }}</td>
                                <td data-cy="version-date">
                                    {{ version.createdAt | formatDate }}
                                </td>
                                <td>
                                    <v-btn
                                        data-cy="goto-version"
                                        small
                                        color="primary"
                                        @click="viewDetails(application.application_id, version.id)"
                                        >Go to version</v-btn
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import moment from "moment";
import { EventBus } from "@/event-bus";
import { Prop } from "vue-property-decorator";
import { Application } from "@/models/AppRepo/Application";

@Component({
    components: {},
})
export default class VersionHistory extends Vue {
    @Prop() application!: Application;

    get sortedVersions() {
        return this.application.versions.sort((a, b) => {
            return moment(b.createdAt).unix() - moment(a.createdAt).unix();
        });
    }

    viewDetails(id: string, application_version_id: string): void {
        EventBus.$emit("selectVersion", id, application_version_id);
        this.$router.push({
            name: "ApplicationRepositoryDetail",
            params: { application_id: id },
            query: { application_version_id: application_version_id },
        });
    }
}
</script>
