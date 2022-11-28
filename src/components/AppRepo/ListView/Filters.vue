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
    <v-row class="my-2">
        <v-spacer></v-spacer>
        <v-col class="d-flex" cols="3" data-cy="medical-speciality-filter">
            <v-select
                dense
                hide-details
                clearable
                v-model="selected_speciality"
                :items="medical_specialties"
                item-text="name"
                return-object
                @change="toggleSelectedSpeciality()"
                label="Medical Speciality"
                placeholder="Medical Speciality"
                solo
            ></v-select>
        </v-col>
        <v-col class="d-flex" cols="3" data-cy="sort-by">
            <v-select
                dense
                hide-details
                clearable
                v-model="selected_sort"
                :items="sorts"
                @change="toggleSelectedSort()"
                label="Sort by"
                placeholder="Sort by"
                solo
            ></v-select>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { getAllMedicalSpeciality } from "../../../api/AppRepo/MedicalSpecialityService";
import { MedicalSpeciality } from "@/models/AppRepo/Application";
import { EventBus } from "@/event-bus";

@Component({
    components: {},
})
export default class Filters extends Vue {
    @Prop() selected_speciality!: MedicalSpeciality | null;
    medical_specialties: MedicalSpeciality[] = [];
    sorts = ["Ascending (A to Z)", "Descending (Z to A)"];
    selected_sort = "";

    async mounted(): Promise<void> {
        await getAllMedicalSpeciality()
            .then((medical_specialties: MedicalSpeciality[]) => {
                this.medical_specialties = medical_specialties;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleSelectedSpeciality(): void {
        EventBus.$emit("toggleSelectedSpeciality", this.selected_speciality);
    }

    toggleSelectedSort(): void {
        EventBus.$emit("toggleSelectedSort", this.selected_sort);
    }
}
</script>
