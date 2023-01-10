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
    <dicom-canvas
        :imageIds="imageIds"
        :supported-dicom="supportedDicom"
        :current-series="currentSeries"
    >
        <template
            v-slot:toolbar="{
                setActiveTool,
                resetView,
                toggleMetadataPanel,
                toggleSeriesPanel,
                showMetadata,
                showSeries,
            }"
        >
            <dicom-tools
                @set-active-tool="setActiveTool"
                @reset-view="resetView"
                @toggle-metadata-panel="toggleMetadataPanel"
                @toggle-series-panel="toggleSeriesPanel"
                :show-tools="!documentView"
                :show-metadata="showMetadata && !documentView && supportedDicom"
                :show-series="showSeries"
                :supported-dicom="supportedDicom"
            />
        </template>

        <template v-slot:footer="{ currentImageIndex, voiRange }">
            <dicom-footer
                v-show="!documentView && supportedDicom"
                :current-slice="currentImageIndex"
                :total-slices="imageIds.length"
                :voi-range="voiRange"
            />
        </template>

        <template v-slot:series="{ showSeries }">
            <series-list
                :show-series="showSeries"
                :study="study"
                :selected-series="currentSeries?.series_uid"
                @series-selected="newSeriesSelected"
                @item-selected="itemSelected"
            />
        </template>

        <template v-slot:metadata="{ currentImageIndex, showMetadata }">
            <metadata-list
                :show-metadata="showMetadata && !documentView && supportedDicom"
                :current-image-index="currentImageIndex"
                :image-slices="imageSlices"
            />
        </template>

        <template v-slot:dicom-not-supported>
            <unsupported-dicom
                v-if="!supportedDicom && currentSeries"
                :modality="currentSeries?.modality"
                :files="currentSeries?.files"
            />
        </template>

        <template v-slot:pdf-viewer>
            <pdf v-if="documentView" :src="document" :text="false" class="large-pdf-viewer" />
        </template>
    </dicom-canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getStudy } from "@/api/ClinicalReview/ClinicalReviewService";

import pdf from "pdfvuer";
import DicomCanvas from "./viewer/dicom-canvas.vue";
import DicomTools from "./viewer/dicom-tools.vue";
import DicomFooter from "./viewer/dicom-footer.vue";
import UnsupportedDicom from "./viewer/dicom-not-supported.vue";
import MetadataList from "./metadata/metadata-list.vue";
import SeriesList from "./series/series-list.vue";
import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import { getDicomFile } from "@/api/ClinicalReview/ClinicalReviewService";
import { parseMetadata } from "@/utils/dicom-metadata-parser";
import { dicomModalitySupported } from "@/utils/dicom-modality";

type DicomViewData = {
    currentSeries?: ClinicalReviewSeries;
    documentView: boolean;
    supportedDicom: boolean;
    document?: { data: Uint8Array };
    study: ClinicalReviewSeries[];
    imageSlices: string[];
};

export default defineComponent({
    components: {
        DicomCanvas,
        DicomTools,
        DicomFooter,
        UnsupportedDicom,
        MetadataList,
        SeriesList,
        pdf,
    },
    props: {
        taskExecutionId: { default: "", type: String },
    },
    emits: ["study-selected"],
    computed: {
        imageIds: function (): string[] {
            if (
                this.currentSeries &&
                this.currentSeries?.total_frames &&
                this.currentSeries?.total_frames != 0 &&
                dicomModalitySupported(this.currentSeries?.modality)
            ) {
                const newSlices = [];
                for (let index = 0; index < this.currentSeries.total_frames; index++) {
                    newSlices.push(
                        `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${this.imageSlices[0]}&frame=${index}`,
                    );
                }
                return newSlices;
            }

            if (!dicomModalitySupported(this.currentSeries?.modality)) {
                return [];
            }

            return this.imageSlices.map(
                (key) => `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${key}`,
            );
        },
    },
    watch: {
        async taskExecutionId() {
            await this.getTaskDetails(this.taskExecutionId);
        },
        currentSeries(newSeries?: ClinicalReviewSeries) {
            if (!newSeries || newSeries.modality === "DOC") {
                return;
            }

            this.supportedDicom = dicomModalitySupported(newSeries?.modality);
            this.imageSlices = newSeries.files;
        },
    },
    methods: {
        async getTaskDetails(taskExecutionId: string) {
            this.study = [];
            this.imageSlices = [];
            this.currentSeries = undefined;
            this.supportedDicom = true;
            this.$emit("study-selected", { study_date: "" });

            const study = await getStudy(taskExecutionId);

            study.study.forEach(async (series) => {
                if (
                    series.files.length === 1 &&
                    series.modality !== "DOC" &&
                    dicomModalitySupported(series.modality)
                ) {
                    series.files = await this.getNewFramesForEnhancedDicoms(series);
                }
            });

            this.study = study.study;
            this.currentSeries = study.study.find((series) => series.modality !== "DOC");
            this.$emit("study-selected", study);
        },
        newSeriesSelected(seriesId: string) {
            const series = this.study.find((series) => series.series_uid === seriesId);
            this.currentSeries = series;
            this.documentView = series?.modality === "DOC";
            this.supportedDicom = dicomModalitySupported(series?.modality);
        },
        itemSelected(item: { modality: string; document?: { data: Uint8Array } }) {
            this.documentView = item.modality === "DOC";
            this.supportedDicom = dicomModalitySupported(item.modality);
            this.document = item.document;
        },
        async getNewFramesForEnhancedDicoms(series: ClinicalReviewSeries) {
            const newSlices = [];
            const buffer = await getDicomFile(series.files[0]);
            const allMetadata = parseMetadata(new Uint8Array(buffer));
            const noOfFramesValue = allMetadata.find((obj) => obj.name === "NumberOfFrames")?.value;

            if (noOfFramesValue !== undefined) {
                series.total_frames = +noOfFramesValue;
            } else {
                series.total_frames = 0;
            }

            for (let index = 0; index < series.total_frames; index++) {
                newSlices.push(series.files[0]);
            }

            return newSlices;
        },
    },
    mounted() {
        this.getTaskDetails(this.taskExecutionId);
    },
    data(): DicomViewData {
        return {
            currentSeries: undefined,
            study: [],
            imageSlices: [],
            documentView: false,
            supportedDicom: true,
            document: undefined,
        };
    },
});
</script>

<style lang="scss" scoped>
.dicom-view,
.dicom-wrapper {
    height: 100%;
}

.large-pdf-viewer {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: auto;
}

.large-pdf-viewer ::v-deep #viewerContainer {
    padding-top: 60px;
    background-color: #000;

    .page,
    .canvasWrapper,
    canvas {
        width: 100% !important;
        height: auto !important;
    }
}
</style>
