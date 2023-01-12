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
    <div class="dicom-thumbnail-canvas-container">
        <div class="dicom-thumbnail-canvas">
            <span>{{ modality }}</span>
        </div>
        <div class="dicom-thumbnail-overlay"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        modality: { type: String },
    },
});
</script>

<style lang="scss" scoped>
.dicom-thumbnail-canvas-container {
    position: relative;
    height: 200px;
    width: 200px;
}

.dicom-thumbnail-overlay,
.dicom-thumbnail-canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.dicom-thumbnail-canvas {
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;

    > span {
        font-size: 30px;
        border: 3px solid rgba($color: #fff, $alpha: 0.5);
        padding: 5px 10px;
        border-radius: 10px;
    }
}
</style>
