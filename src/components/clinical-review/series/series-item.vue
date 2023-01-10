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
    <v-list-item
        :value="series.series_uid"
        class="mb-2"
        data-cy="series-item"
        @click="selectItem"
        role="listitem"
    >
        <v-list-item-content>
            <v-list-item-title data-cy="series-title" style="margin-bottom: 5px">
                {{ series.modality }} ({{ series.files.length }})
            </v-list-item-title>
            <div v-if="series.modality === 'DOC'" class="pdf-thumbnail-container">
                <pdf v-if="document" class="pdf-thumbnail" :src="document" :text="false" />
            </div>
            <DicomThumbnail
                v-else-if="series.modality !== 'DOC' && series.modality !== 'SEG'"
                :image-id="imageId"
                :series-uid="series.series_uid"
            />
            <DicomUnsupportedThumbnail
                v-else-if="series.modality !== 'DOC' && series.modality === 'SEG'"
                :modality="series.modality"
            />
        </v-list-item-content>
    </v-list-item>
</template>

<script lang="ts">
import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import { defineComponent, PropType } from "vue";
import pdf from "pdfvuer";
import DicomThumbnail from "./series-dicom-thumbnail.vue";
import DicomUnsupportedThumbnail from "./series-unsupported-thumbnail.vue";
import { getDicomFile } from "@/api/ClinicalReview/ClinicalReviewService";
import { parseEncapsulatedPdf } from "@/utils/dicom-metadata-parser";

export default defineComponent({
    components: {
        pdf,
        DicomThumbnail,
        DicomUnsupportedThumbnail,
    },
    props: {
        series: {
            type: Object as PropType<ClinicalReviewSeries>,
        },
    },
    watch: {
        series() {
            this.getDicomFile();
        },
    },
    computed: {
        imageId(): string | undefined {
            const file = this.series?.files[0];

            return file
                ? `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${file}`
                : undefined;
        },
    },
    emits: ["item-selected"],
    data() {
        return {
            document: undefined as any,
        };
    },
    methods: {
        async getDicomFile() {
            if (!this.series) {
                return;
            }

            if (this.series.modality === "DOC") {
                const buffer = await getDicomFile(this.series!.files[0]);

                const data = parseEncapsulatedPdf(new Uint8Array(buffer));

                if (!data) {
                    return;
                }

                this.document = { data };
            }
        },
        selectItem() {
            this.$emit("item-selected", {
                document: this.document,
                modality: this.series?.modality,
            });
        },
    },
    mounted() {
        this.getDicomFile();
    },
});
</script>

<style lang="scss" scoped>
.pdf-thumbnail-container,
.slice-thumbnail,
.pdf-thumbnail {
    width: 200px;
    height: 200px;
    overflow: hidden;
}

.pdf-thumbnail-container {
    background-color: white;
}

::v-deep #viewerContainer {
    .page,
    canvas {
        width: 200px !important;
        height: auto !important;
    }
}
</style>
