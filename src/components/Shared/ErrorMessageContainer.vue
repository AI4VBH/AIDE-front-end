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
    <v-alert color="#C62828" text type="error" icon="mdi-alert" data-cy="error-container">
        <p v-if="title" class="red--text text--accent-4 mb-1 body-2 font-weight-bold">
            {{ title }}
        </p>
        <div v-if="errorMessages.length > 1">
            <li
                class="red--text text--accent-4 mb-1 body-2 font-weight-bold"
                :data-cy="error"
                v-for="error in errorMessages"
                :key="error"
            >
                {{ error }}
            </li>
        </div>
        <div v-else>
            <p class="red--text text--accent-4 my-auto body-2">
                {{ errorMessages[0] }}
            </p>
        </div>
    </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class ErrorMessageContainer extends Vue {
    @Prop() errorMessages!: string[];
    @Prop() title?: string;
}
</script>

<style scoped>
.v-alert {
    color: #ffffff !important;
    background-color: #ffebee !important;
}
</style>
