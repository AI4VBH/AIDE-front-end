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
    <v-navigation-drawer
        absolute
        temporary
        left
        hide-overlay
        dark
        floating
        :value="showSeries"
        :stateless="true"
        data-cy="series-list"
    >
        <v-list>
            <v-list-item-group v-model="activeSeries" mandatory role="group">
                <series-item
                    v-for="item of study"
                    :key="item.series_uid"
                    :series="item"
                    @item-selected="selectItem"
                />
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import SeriesItem from "./series-item.vue";

export default defineComponent({
    components: {
        SeriesItem,
    },
    props: {
        showSeries: { default: false, type: Boolean },
        selectedSeries: { type: String },
        study: { default: () => [], type: Array as PropType<ClinicalReviewSeries[]> },
    },
    emits: ["series-selected", "item-selected"],
    computed: {
        activeSeries: {
            get(): string | undefined {
                return this.selectedSeries;
            },
            set(newValue: string) {
                this.$emit("series-selected", newValue);
            },
        },
    },
    watch: {
        selectedSeries() {
            this.$emit("series-selected", this.selectedSeries);
        },
    },
    methods: {
        selectItem(item: { modality: string; document?: { data: Uint8Array } }) {
            this.$emit("item-selected", item);
        },
    },
});
</script>

<style lang="scss" scoped>
.theme--dark.v-navigation-drawer {
    background: rgba($color: #000000, $alpha: 0.5);
    z-index: 1;
}

.v-navigation-drawer--is-mobile,
.v-navigation-drawer--temporary {
    box-shadow: none;
    top: 60px !important;
    bottom: 0;
    height: initial !important;
}

.v-list {
    padding-right: 12px;
    padding-left: 12px;

    .v-list-item,
    .v-list-item::before,
    .v-list-item > .v-ripple__container {
        border-radius: 12px !important;
    }
}
</style>
