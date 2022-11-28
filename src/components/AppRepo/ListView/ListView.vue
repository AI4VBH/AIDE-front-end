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
    <v-container style="max-width: 100%; min-height: calc(100vh - 64px); background: #e5e5e5">
        <AppRepoHeader></AppRepoHeader>
        <v-row v-if="loading">
            <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <Filters
            :selected_speciality="selected_speciality"
            v-if="applications.length > 0"
        ></Filters>
        <v-row justify="center" v-if="filteredApplications.length > 0" data-cy="application-table">
            <v-col v-for="application in filteredApplications" :key="application.id" md="auto">
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="mx-2 my-5"
                        width="320"
                        height="490"
                        :elevation="hover ? 12 : 2"
                        :class="{ 'on-hover': hover }"
                        data-cy="application-card"
                    >
                        <v-card-title>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }"
                                    ><div
                                        class="title"
                                        data-cy="application-name"
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        {{ application.name }}
                                    </div> </template
                                ><span>{{ application.name }}</span></v-tooltip
                            ></v-card-title
                        >
                        <v-card-subtitle>
                            <div>
                                <v-row>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-col
                                                class="py-0 my-0 text-left subTitle"
                                                cols="7"
                                                style="font-weight: bold"
                                                data-cy="developer-name"
                                                v-bind="attrs"
                                                v-on="on"
                                                >{{
                                                    application.versions[0].version_details[0]
                                                        .developer_name
                                                }}</v-col
                                            ></template
                                        ><span>{{
                                            application.versions[0].version_details[0]
                                                .developer_name
                                        }}</span></v-tooltip
                                    >
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-col
                                                class="py-0 my-0 text-right subTitle"
                                                cols="5"
                                                data-cy="version"
                                                v-bind="attrs"
                                                v-on="on"
                                                ><span style="font-weight: bold">Version: </span>
                                                <span>{{
                                                    application.versions[0].version_string
                                                }}</span></v-col
                                            > </template
                                        ><span>{{
                                            application.versions[0].version_string
                                        }}</span></v-tooltip
                                    >
                                </v-row>
                            </div>
                        </v-card-subtitle>
                        <v-card-text>
                            <div class="shortDescription" data-cy="short-description">
                                {{ application.versions[0].version_details[0].short_desc }}
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                color="#1976D2"
                                @click="
                                    viewDetails(
                                        application.application_id,
                                        application.versions[0].id,
                                        application.versions[0].version_details[0].id,
                                    )
                                "
                                dark
                                small
                                class="mx-3"
                                data-cy="view-application-button"
                            >
                                View Application
                            </v-btn>
                        </v-card-actions>
                        <template
                            v-for="file in application.versions[0].version_details[0]
                                .application_version_files"
                        >
                            <v-img
                                v-bind:key="file.id"
                                v-if="file.label == 'hero_image'"
                                data-cy="application-image"
                                height="150"
                                width
                                style="border-radius: 10px"
                                class="ma-4"
                                :src="file.url"
                            ></v-img>
                            <v-img
                                v-bind:key="file.id"
                                v-else
                                data-cy="application-image"
                                height="150"
                                width
                                style="border-radius: 10px"
                                class="ma-5"
                                src="@/assets/test-stock.jpg"
                            ></v-img>
                        </template>
                        <v-card-text class="py-0">
                            <v-chip-group active-class="deep-purple accent-4 white--text" column>
                                <v-chip
                                    x-small
                                    dark
                                    :color="hex[index]"
                                    @click="toggleSelectedSpeciality(speciality)"
                                    data-cy="speciality"
                                    v-for="(speciality, index) in application.versions[0]
                                        .version_details[0].medical_specialities"
                                    v-bind:key="speciality"
                                    >{{ speciality.name }}</v-chip
                                >
                            </v-chip-group>
                        </v-card-text>
                        <v-card-text class="py-0">
                            <v-item-group>
                                <v-container>
                                    <v-row>
                                        <v-col cols="4" md="4">
                                            <v-img
                                                v-if="
                                                    application.versions[0].version_details[0]
                                                        .ce_certified
                                                "
                                                data-cy="ce-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/CE.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                        </v-col>
                                        <v-col cols="4" md="4">
                                            <v-img
                                                v-if="
                                                    application.versions[0].version_details[0]
                                                        .ukca_certified
                                                "
                                                data-cy="ukca-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/UKCA.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                        </v-col>
                                        <v-col cols="4" md="4">
                                            <v-img
                                                v-if="
                                                    application.versions[0].version_details[0]
                                                        .fda_certified
                                                "
                                                data-cy="fda-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/FDA.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-item-group>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        <v-row
            style="padding-left: 56px"
            v-else
            class="d-flex justify-center my-12"
            data-cy="no-results-message"
            ><h2 v-if="!loading">No Results</h2></v-row
        >
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import AppRepoHeader from "../Shared/AppRepoHeader.vue";
import Filters from "../ListView/Filters.vue";
import { getAllApplicationsFilteredByStatus } from "../../../api/AppRepo/ApplicationService";
import { Application, MedicalSpeciality, Version } from "@/models/AppRepo/Application";

@Component({
    components: { AppRepoHeader, Filters },
})
export default class ListView extends Vue {
    loading = true;
    applications: Application[] = [];
    searchTerm = "";
    selected_speciality: MedicalSpeciality | null = null;
    selected_sort = "Ascending (A to Z)";
    hex = ["#2196F3", "#6383D2", "#797CC7", "#A66FB1", "#BC69A6", "#D2629B", "#E85C90"];

    async created(): Promise<void> {
        this.loading = true;
        await getAllApplicationsFilteredByStatus("Live")
            .then((applications: Application[]) => {
                this.applications = applications;
                this.loading = false;
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });

        EventBus.$on("toggleSelectedSpeciality", (selected_speciality: MedicalSpeciality) => {
            if (selected_speciality == null) {
                this.selected_speciality = null;
            } else {
                this.selected_speciality = selected_speciality;
            }
        });

        EventBus.$on("toggleSelectedSort", (selected_sort: string) => {
            if (selected_sort == null) {
                this.selected_sort = "Ascending (A to Z)";
            } else {
                this.selected_sort = selected_sort;
            }
        });

        EventBus.$on("search", (searchTerm: string) => {
            this.searchTerm = searchTerm;
        });
    }

    // @Watch("$route", { immediate: true, deep: true })
    // onUrlChange(route: Route) {
    //     console.log(route.query.selected_speciality);
    //     if (route.query.selected_speciality == null) {
    //         this.selected_speciality = null;
    //     } else {
    //         this.selected_speciality = route.query.selected_speciality as string;
    //     }
    // }

    get filteredApplications() {
        // filter the latest version
        for (const application of this.applications) {
            application.versions = [application.versions.pop()] as Version[];
        }

        return this.applications
            .filter((application) => {
                if (this.selected_speciality != null) {
                    return application.versions[0].version_details[0].medical_specialities.includes(
                        this.selected_speciality,
                    );
                } else {
                    return true;
                }
            })
            .filter((application) => {
                if (this.searchTerm != "") {
                    return application.name.toLowerCase().includes(this.searchTerm.toLowerCase());
                } else {
                    return true;
                }
            })
            .sort((a, b) => {
                if (this.selected_sort == "Ascending (A to Z)") {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                }
                if (this.selected_sort == "Descending (Z to A)") {
                    if (a.name > b.name) {
                        return -1;
                    }
                    if (a.name < b.name) {
                        return 1;
                    }
                }
                return 0;
            });
    }

    viewDetails(
        id: string,
        application_version_id: string,
        application_version_details_id: string,
    ): void {
        this.$router.push({
            name: "ApplicationRepositoryDetail",
            params: { application_id: id },
            query: {
                application_version_id: application_version_id,
                application_version_details_id: application_version_details_id,
            },
        });
    }

    toggleSelectedSpeciality(selected_speciality: MedicalSpeciality): void {
        this.selected_speciality = selected_speciality;
        EventBus.$emit("toggleSelectedSpeciality", selected_speciality);
    }
}
</script>
<style>
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
}
.subTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
}
.shortDescription {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    height: 44px;
}
.v-slide-group__content {
    justify-content: center;
    height: 48px;
}
</style>
