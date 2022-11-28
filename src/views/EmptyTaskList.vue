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
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="5">
                <v-card dark color="green">
                    <v-card-title><v-icon>mdi-information-outline</v-icon> Info </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>There are no tasks for review</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class EmptyTaskList extends Vue {
    // Declared as component data
}
</script>

<style scoped></style>
