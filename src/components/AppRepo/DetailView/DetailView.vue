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
    <v-container style="max-width: 100%; background: #fff" v-if="application != null">
        <AppRepoHeader :application="application"></AppRepoHeader>
        <v-row v-if="loading">
            <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <DetailActionBar
            :application="application"
            :version="version"
            :versionDetails="version_details"
        ></DetailActionBar>
        <v-container
            style="max-width: 100%; height: calc(100vh - 210px); overflow: auto"
            data-cy="detail-sub-module"
        >
            <v-container style="max-width: 75%">
                <DetailHeader :versionDetails="version_details"></DetailHeader>
                <v-tabs v-model="tab" color="#222129">
                    <v-tab color="#222129">{{ application.name }} Overview</v-tab>
                    <!-- <v-tab>Model Card</v-tab> -->
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <IntendedUse :versionDetails="version_details"></IntendedUse>
                        <ModelDetails :versionDetails="version_details"></ModelDetails>
                        <Certification :versionDetails="version_details"></Certification>
                        <SystemRequirements :versionDetails="version_details"></SystemRequirements>
                        <Files :versionDetails="version_details"></Files>
                        <VersionHistory :application="application"></VersionHistory>
                        <AboutTheDeveloper :versionDetails="version_details"></AboutTheDeveloper>
                    </v-tab-item>
                    <!-- <v-tab-item>No Data</v-tab-item> -->
                </v-tabs-items>
            </v-container>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import AppRepoHeader from "../Shared/AppRepoHeader.vue";
import DetailActionBar from "../DetailView/DetailActionBar.vue";
import DetailHeader from "../DetailView/DetailHeader.vue";
import IntendedUse from "../DetailView/IntendedUse.vue";
import ModelDetails from "../DetailView/ModelDetails.vue";
import Certification from "../DetailView/Certification.vue";
import SystemRequirements from "../DetailView/SystemRequirements.vue";
import Files from "../DetailView/Files.vue";
import VersionHistory from "../DetailView/VersionHistory.vue";
import AboutTheDeveloper from "../DetailView/AboutTheDeveloper.vue";

import { getApplicationFilteredByStatus } from "../../../api/AppRepo/ApplicationService";
import { Application, Version, VersionDetails } from "@/models/AppRepo/Application";

@Component({
    components: {
        AppRepoHeader,
        DetailActionBar,
        DetailHeader,
        IntendedUse,
        ModelDetails,
        Certification,
        SystemRequirements,
        Files,
        VersionHistory,
        AboutTheDeveloper,
    },
})
export default class DetailView extends Vue {
    loading = true;
    application: Application | null = null;
    version: Version | null = null;
    version_details: VersionDetails | null = null;
    tab = null;

    async created(): Promise<void> {
        const application_id = this.$route.params.application_id;
        const application_version_id = this.$route.query.application_version_id;
        this.updateSelectedVersion(application_id, application_version_id);

        EventBus.$on("selectVersion", (application_id: string, application_version_id: string) => {
            this.updateSelectedVersion(application_id, application_version_id);
        });
    }

    async updateSelectedVersion(
        application_id: string,
        application_version_id: string | (string | null)[],
    ): Promise<void> {
        this.loading = true;
        await getApplicationFilteredByStatus(application_id, "Live")
            .then((application: Application) => {
                this.loading = false;
                this.application = application;
                this.version = application.versions.filter((version) => {
                    return version.id == application_version_id;
                })[0];
                this.version_details = this.version.version_details[0];
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });
    }
}
</script>
<style>
.custom-card {
    height: 130px;
    width: 130px;
    background-color: #f5f5f5 !important;
}
.custom-card .v-card__title {
    font-size: 0.9rem;
    line-height: 1rem;
}
</style>
