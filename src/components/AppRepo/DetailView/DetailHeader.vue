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
    <v-row>
        <v-col cols="12"
            ><v-row
                ><v-col
                    cols="12"
                    v-for="file in versionDetails.application_version_files"
                    :key="file.id"
                    ><v-img
                        v-if="file.label == 'hero_image'"
                        data-cy="application-image"
                        height="372"
                        width
                        style="border-radius: 10px"
                        class="ma-5"
                        :src="file.url"
                    ></v-img>
                    <v-img
                        v-if="
                            versionDetails.application_version_files == '' ||
                            versionDetails.application_version_files == null ||
                            versionDetails.application_version_files == 'None'
                        "
                        data-cy="application-image"
                        height="372"
                        width
                        style="border-radius: 10px"
                        class="ma-5"
                        src="@/assets/test-stock.jpg"
                    ></v-img></v-col
            ></v-row>
            <v-row
                ><v-col
                    cols="12"
                    style="color: #23212a; font-weight: 600; font-size: 32px; line-height: 44px"
                    data-cy="short-description"
                    >{{ versionDetails.short_desc }}</v-col
                ></v-row
            >
            <v-row
                ><v-col cols="12">
                    <v-chip-group column style="flex: 0 0 auto !important" class="mx-0 px-0">
                        <v-chip
                            small
                            dark
                            @click="toggleSelectedSpeciality(speciality)"
                            :color="hex[index]"
                            data-cy="specialty"
                            v-for="(speciality, index) in versionDetails.medical_specialities"
                            v-bind:key="speciality"
                            >{{ speciality }}</v-chip
                        >
                    </v-chip-group></v-col
                ></v-row
            ></v-col
        ></v-row
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VersionDetails } from "@/models/AppRepo/Application";

@Component({
    components: {},
})
export default class DetailHeader extends Vue {
    @Prop() versionDetails!: VersionDetails;
    hex = ["#2196F3", "#6383D2", "#797CC7", "#A66FB1", "#BC69A6", "#D2629B", "#E85C90"];

    toggleSelectedSpeciality(selected_speciality: string): void {
        this.$router.push({
            name: "ApplicationRepositoryList",
            query: { selected_speciality: selected_speciality },
        });
    }
}
</script>

<style>
.v-slide-group__content {
    justify-content: left;
}
</style>
