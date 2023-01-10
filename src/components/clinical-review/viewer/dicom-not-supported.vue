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
    <div class="dicom-not-supported">
        <div>
            <p>
                The <strong>{{ modality }}</strong> modality is not supported by this viewer.
                Download the series to view in an external viewer.
            </p>
            <v-btn dark :disabled="downloading" @click="downloadSeries">
                Download Series
                <v-progress-circular v-if="downloading" class="ml-2" indeterminate size="15" />
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getDicomFile } from "@/api/ClinicalReview/ClinicalReviewService";
import { PropType } from "vue/types/v3-component-props";

export default defineComponent({
    props: {
        modality: { type: String },
        files: { default: () => [], type: Array as PropType<string[]> },
    },
    data() {
        return {
            downloading: false,
        };
    },
    methods: {
        async downloadSeries() {
            this.downloading = true;

            const file = await getDicomFile(this.files[0]);

            console.log(file);

            this.downloading = false;
        },
    },
});
</script>

<style lang="scss" scoped>
.dicom-not-supported {
    color: #fff;
    background: #000;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    > div {
        text-align: center;
        width: 50%;
    }

    p {
        font-size: 20px;
    }
}
</style>
