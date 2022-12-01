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
    <div class="dicom-canvas-wrapper">
        <div
            oncontextmenu="return false"
            unselectable="on"
            onselectstart="return false;"
            onmousedown="return false"
            class="dicom-canvas"
            ref="dicomCanvas"
            data-cy="dicom-canvas"
        />

        <slot
            name="toolbar"
            v-bind="{
                setActiveTool,
                resetView,
                toggleMetadataPanel,
                toggleSeriesPanel,
                showMetadata,
                showSeries,
            }"
        />

        <slot name="footer" v-bind="{ currentImageIndex, voiRange }" />

        <slot name="metadata" v-bind="{ currentImageIndex, showMetadata }" />

        <slot name="series" v-bind="{ showSeries }" />

        <slot name="pdf-viewer" />

        <v-overlay
            data-cy="dicom-viewer-loader"
            :value="loading"
            :absolute="true"
            color="#cecece"
            z-index="10"
        >
            <v-progress-circular size="100" color="primary" indeterminate />
        </v-overlay>

        <div data-cy="dicom-viewer-no-image" class="no-images" v-if="imageIds.length === 0"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { init, RenderingEngine, Enums, eventTarget } from "@cornerstonejs/core";
import {
    init as initTools,
    addTool,
    ToolGroupManager,
    ZoomTool,
    PanTool,
    StackScrollMouseWheelTool,
    WindowLevelTool,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/dist/esm/types";
import { MouseBindings } from "@cornerstonejs/tools/dist/esm/enums";
import { IStackViewport, EventTypes, VOIRange } from "@cornerstonejs/core/dist/esm/types";
import initCornerstoneWADOImageLoader from "@/utils/cornerstone-wado-image-loader";
import { RotateTool } from "@/utils/cornerstone-tool/rotate-tool";
import { debounce } from "underscore";

type ComponentData = {
    renderer?: RenderingEngine;
    viewport?: IStackViewport;
    tools?: IToolGroup;
    voiRange?: VOIRange;
    currentImageId?: string;
    currentImageIndex: number;
    loading: boolean;
    showMetadata: boolean;
    showSeries: boolean;
};

const viewportId = "dicom-viewport";

export default defineComponent({
    data(): ComponentData {
        return {
            renderer: undefined,
            viewport: undefined,
            tools: undefined,
            voiRange: undefined,
            loading: false,
            currentImageIndex: 0,
            showMetadata: true,
            showSeries: true,
        };
    },
    props: {
        activeTool: { default: PanTool.toolName as string },
        imageIds: { default: () => [], type: Array as PropType<string[]> },
    },
    watch: {
        imageIds: {
            handler() {
                this.loadImages().then(() => {
                    this.resetView();
                });
            },
            deep: true,
        },
    },
    methods: {
        async configureCornerstone() {
            if (!this.$refs.dicomCanvas) {
                return;
            }

            await init();
            initCornerstoneWADOImageLoader(this.$keycloak?.token);
            initTools();

            const startLoading = debounce(() => {
                this.loading = true;
            }, 250);

            const stopLoading = debounce(() => {
                this.loading = false;
            }, 250);

            const updateCurrentImage = debounce((ev: any) => {
                const { imageId, newImageIdIndex } = (ev as EventTypes.StackViewportScrollEvent)
                    .detail;
                this.currentImageId = imageId;
                this.currentImageIndex = newImageIdIndex;
            }, 250);

            const resizeCanvas = debounce(() => {
                if (!this.viewport || !this.renderer) {
                    return;
                }

                const properties = this.viewport.getProperties();
                const camera = this.viewport.getCamera();

                this.renderer.resize(true, false);
                this.viewport.resize();

                this.viewport.setProperties(properties);
                this.viewport.setCamera(camera);
            }, 100);

            eventTarget.addEventListener(Enums.Events.IMAGE_LOAD_PROGRESS, startLoading);
            eventTarget.addEventListener(Enums.Events.IMAGE_LOADED, stopLoading);

            (this.$refs.dicomCanvas as HTMLDivElement).addEventListener(
                Enums.Events.VOI_MODIFIED,
                (ev) => {
                    const { detail } = ev as EventTypes.VoiModifiedEvent;

                    this.voiRange = detail.range;
                },
            );

            (this.$refs.dicomCanvas as HTMLDivElement).addEventListener(
                Enums.Events.STACK_VIEWPORT_SCROLL,
                updateCurrentImage,
            );

            window.addEventListener("resize", resizeCanvas);

            this.tools = ToolGroupManager.createToolGroup("dicom-tools");
            this.renderer = new RenderingEngine("dicom-canvas");

            this.enableViewport();

            this.viewport = this.renderer.getViewport(viewportId) as IStackViewport;

            this.configureCornerstoneTools();
            this.tools?.addViewport(viewportId, "dicom-canvas");
            await this.loadImages();
        },
        configureCornerstoneTools() {
            try {
                addTool(ZoomTool);
                addTool(PanTool);
                addTool(StackScrollMouseWheelTool);
                addTool(WindowLevelTool);
                addTool(RotateTool);
            } catch {
                // do nothing
            }

            this.tools?.addTool(ZoomTool.toolName, {
                configuration: {
                    invert: false,
                    preventZoomOutsideImage: false,
                    minScale: 0.1,
                    maxScale: 20.0,
                },
            });
            this.tools?.addTool(PanTool.toolName);
            this.tools?.addTool(StackScrollMouseWheelTool.toolName);
            this.tools?.addTool(WindowLevelTool.toolName);
            this.tools?.addTool(RotateTool.toolName);

            this.tools?.setToolActive(WindowLevelTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary_And_Secondary,
                    },
                ],
            });
            this.tools?.setToolActive(ZoomTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Secondary,
                    },
                ],
            });
            this.tools?.setToolActive(PanTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary,
                    },
                ],
            });
            this.tools?.setToolActive(StackScrollMouseWheelTool.toolName);
            this.tools?.setToolActive(RotateTool.toolName);
        },
        setActiveTool(toolName: string) {
            const currentPrimaryTool = this.tools?.getActivePrimaryMouseButtonTool();

            if (currentPrimaryTool) {
                this.tools?.setToolDisabled(currentPrimaryTool);
            }

            this.tools?.setToolActive(toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary,
                    },
                ],
            });
        },
        resetView() {
            if (!this.imageIds.length) {
                return;
            }

            this.viewport?.resetCamera(true, true);
            this.viewport?.resetProperties();
            this.viewport?.render();
            this.setActiveTool(PanTool.toolName);
        },
        async loadImages() {
            if (!this.imageIds.length) {
                return;
            }

            this.loading = true;
            await this.viewport?.setStack(this.imageIds, 0);

            // TODO: only download other slices when users attempt to scroll through?
            this.imageIds.forEach((_, index) => this.viewport?.setImageIdIndex(index));
            await this.viewport?.setImageIdIndex(0);

            this.loading = false;
        },
        toggleMetadataPanel() {
            this.showMetadata = !this.showMetadata;
        },
        toggleSeriesPanel() {
            this.showSeries = !this.showSeries;
        },
        enableViewport() {
            this.renderer?.enableElement({
                viewportId: viewportId,
                element: this.$refs.dicomCanvas as HTMLDivElement,
                type: Enums.ViewportType.STACK,
            });
        },
    },
    mounted() {
        this.configureCornerstone();
    },
    beforeDestroy() {
        this.renderer?.disableElement(viewportId);
        this.renderer?.destroy();
        ToolGroupManager.destroy();

        this.viewport = undefined;
        this.renderer = undefined;
        this.tools = undefined;
    },
});
</script>

<style lang="scss" scoped>
.dicom-canvas-wrapper,
.dicom-canvas {
    height: 100%;
    position: relative;
    overflow: hidden;
}

.no-images,
.dicom-canvas-wrapper {
    background-color: #000;
}

.no-images {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
}
</style>
