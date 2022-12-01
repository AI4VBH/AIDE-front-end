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
    <v-row style="border: 1px solid #eeeeee; margin-bottom: 0px">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-col cols="2" class="app-name" data-cy="name" v-bind="attrs" v-on="on"
                    >{{ application.name }}
                </v-col>
            </template>
            <span>{{ application.name }}</span>
        </v-tooltip>
        <v-divider vertical></v-divider>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-col
                    cols="2"
                    class="app-developers"
                    data-cy="developers"
                    v-bind="attrs"
                    v-on="on"
                    >{{ versionDetails.developer_name }}</v-col
                >
            </template>
            <span>{{ versionDetails.developer_name }}</span>
        </v-tooltip>
        <v-divider vertical></v-divider>
        <v-col cols="2" data-cy="version-selector"
            ><v-select
                dense
                hide-details
                v-model="selected_version"
                :items="application.versions"
                @change="selectVersion()"
                item-text="version_string"
                return-object
                label="Version"
                outlined
                data-cy="version-filter"
            ></v-select
        ></v-col>
        <v-divider vertical></v-divider>
        <v-col cols="2" align="center"
            ><v-chip
                class="my-2"
                small
                dark
                color="#615F69"
                data-cy="deployed-version"
                v-bind:key="speciality"
                >Not Deployed</v-chip
            ></v-col
        >
        <v-divider vertical></v-divider>
        <!-- <v-spacer></v-spacer> -->
        <v-col cols="2" align="center"
            ><v-img
                v-if="versionDetails.ce_certified"
                data-cy="ce-logo"
                style="float: left"
                contain
                class="mx-auto"
                src="@/assets/CE.png"
                height="40px" />
            <v-img
                v-if="versionDetails.ukca_certified"
                data-cy="ukca-logo"
                style="float: left"
                contain
                class="mx-auto"
                src="@/assets/UKCA.png"
                height="40px" />
            <v-img
                v-if="versionDetails.fda_certified"
                data-cy="fda-logo"
                style="float: left"
                contain
                class="mx-auto"
                src="@/assets/FDA.png"
                height="40px"
        /></v-col>
        <v-divider vertical></v-divider>
        <v-col cols="2" align="center"
            ><v-btn disabled color="#2196F3">Configure & Deploy</v-btn></v-col
        >
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { Application, Version, VersionDetails } from "@/models/AppRepo/Application";

@Component({
    components: {},
})
export default class DetailActionBar extends Vue {
    @Prop() application!: Application;
    @Prop() version!: Version;
    @Prop() versionDetails!: VersionDetails;
    selected_version: Version = {} as Version;

    mounted() {
        this.selected_version = this.version;

        EventBus.$on(
            "selectVersion",
            (
                application_id: string,
                application_version_id: string,
                application_version_details_id: string,
            ) => {
                this.selected_version = this.application.versions.filter((version) => {
                    return version.id == application_version_id;
                })[0];
            },
        );
    }

    selectVersion(): void {
        EventBus.$emit("selectVersion", this.application.application_id, this.selected_version.id);
        this.$router.push({
            name: "ApplicationRepositoryDetail",
            params: { application_id: this.application.application_id },
            query: { application_version_id: this.selected_version.id },
        });
    }
}
</script>

<style>
.app-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
    color: #23212a;
    font-weight: bold;
    font-size: 24px;
    height: 50px;
}

.app-developers {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
    color: #615f69;
    font-weight: bold;
    font-size: 24px;
    height: 50px;
}
</style>
