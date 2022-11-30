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
    <v-app>
        <!-- Sidebar -->
        <AppSidebar />

        <!-- TopBar -->
        <AppHeader />

        <!-- Main Content -->
        <v-main>
            <transition name="fade" mode="out-in">
                <router-view />
            </transition>
        </v-main>
        <JSONViewerDialog />
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import MetaInfo from "vue-meta";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
import JSONViewerDialog from "./components/Shared/JSONViewerDialog.vue";

export default Vue.extend({
    name: "App",
    metaInfo(): MetaInfo {
        return {
            titleTemplate: "%s | AIDE",
        };
    },
    data: () => ({
        drawer: null,
        items: [
            { title: "Menu Item 1", icon: "mdi-view-dashboard" },
            { title: "Menu Item 2", icon: "mdi-image" },
            { title: "Menu Item 3", icon: "mdi-help-box" },
        ],
    }),
    components: {
        AppHeader,
        AppSidebar,
        JSONViewerDialog,
    },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,500,700,900");

html {
    overflow: auto;
    min-width: 1000px;
}

.v-application {
    font-family: "Open Sans", sans-serif !important;
}

#app {
    background: #fefbff;
}

.v-data-table {
    border: solid 1px #e0e0e0;
}

.v-data-table-header {
    background: #fafafa;
    text-transform: uppercase !important;
}

.primary-button {
    text-transform: unset !important;
    letter-spacing: normal;
    background: #61366e !important;
    border-radius: 6px !important;
    color: #ffffff !important;
}

.secondary-button {
    text-transform: unset !important;
    letter-spacing: normal;
    background: #f7f3f9 !important;
    border-radius: 6px !important;
    color: #482852 !important;
    font-weight: bold;
}

.alert-button {
    text-transform: unset !important;
    letter-spacing: normal;
    background: #e81c0d !important;
    border-radius: 6px !important;
    color: #ffffff !important;
    font-weight: bold;
}

.outlined-button {
    text-transform: unset !important;
    letter-spacing: normal;
    background: #ffffff !important;
    border: 1px solid #e0e0e0;
    border-radius: 6px !important;
    color: #424242 !important;
    font-weight: bold;
}

.section-title {
    font-family: "Bai Jamjuree", sans-serif !important;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
}

h1 {
    font-family: "Bai Jamjuree", sans-serif !important;
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
    color: #000;
}

h2,
h3 {
    font-family: "Open Sans", sans-serif !important;
}

.required::after {
    content: " *";
    color: #b51c1c;
}

.no-uppercase {
    text-transform: unset !important;
    letter-spacing: normal;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.v-toast__item.v-toast__item--error {
    background-color: #a10000;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #61366e;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #5f2e6e;
}

.v-data-table-header th {
    white-space: nowrap;
}
</style>
