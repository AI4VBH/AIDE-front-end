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
        right
        hide-overlay
        dark
        floating
        :value="displayMetadata"
        :stateless="true"
        data-cy="metadata-list"
        role="none"
    >
        <v-list role="none">
            <v-list-item-group
                data-cy="metadata-list-pinned"
                v-show="pinned.length"
                style="margin-bottom: 12px"
                role="group"
            >
                <v-subheader>PINNED</v-subheader>
                <metadata-item
                    v-for="item of pinned"
                    :key="item.name"
                    :name="item.name"
                    :value="item.value"
                    pinned
                    @pin-item="unpinItem"
                />
            </v-list-item-group>
            <v-list-item-group data-cy="metadata-list-not-pinned" role="group">
                <v-subheader v-show="pinned.length">METADATA</v-subheader>
                <metadata-item
                    v-for="item of metadata"
                    :key="item.name"
                    :name="item.name"
                    :value="item.value"
                    @pin-item="pinItem"
                />
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import MetadataItem from "./metadata-item.vue";
import { getDicomFile } from "@/api/ClinicalReview/ClinicalReviewService";
import { DicomMetadata, parseMetadata } from "@/utils/dicom-metadata-parser";

type MetadataListData = {
    pinnedItemNames: string[];
    pinned: DicomMetadata[];
    metadata: DicomMetadata[];
    allMetadata: DicomMetadata[];
};

export default defineComponent({
    components: {
        MetadataItem,
    },
    props: {
        showMetadata: { default: false, type: Boolean },
        currentImageIndex: { default: -1, type: Number },
        imageSlices: { default: () => [], type: Array as PropType<string[]> },
    },
    computed: {
        displayMetadata(): boolean {
            return this.showMetadata;
        },
    },
    watch: {
        async currentImageIndex() {
            if (this.currentImageIndex >= 0) {
                await this.getDicomFile(this.currentImageIndex);
            }
        },
        async imageSlices() {
            if (this.currentImageIndex >= 0) {
                await this.getDicomFile(this.currentImageIndex);
            }
        },
        pinnedItemNames() {
            this.filterMetadata();
        },
    },
    methods: {
        pinItem(name: string) {
            this.pinnedItemNames.push(name);
        },
        unpinItem(name: string) {
            this.pinnedItemNames = this.pinnedItemNames.filter((n) => n !== name);
        },
        async getDicomFile(index: number) {
            if (!this.imageSlices.length || !this.imageSlices[index]) {
                this.allMetadata = [];
                this.pinned = [];
                this.metadata = [];
                return;
            }

            const buffer = await getDicomFile(this.imageSlices[index]);
            this.allMetadata = parseMetadata(new Uint8Array(buffer));
            this.filterMetadata();
        },
        filterMetadata() {
            this.pinned = this.allMetadata.filter((m) => this.pinnedItemNames.includes(m.name));
            this.metadata = this.allMetadata.filter((m) => !this.pinnedItemNames.includes(m.name));
        },
    },
    mounted() {
        if (this.imageSlices.length && this.currentImageIndex >= 0) {
            this.getDicomFile(0);
        }
    },
    data(): MetadataListData {
        return {
            pinnedItemNames: [],
            pinned: [],
            metadata: [],
            allMetadata: [],
        };
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
