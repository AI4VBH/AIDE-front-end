<template>
    <v-row class="toolbar">
        <v-col cols="3">
            <v-layout justify-start>
                <v-btn dark text @click="toggleSeriesPanel">
                    <v-icon v-if="showSeries">mdi-chevron-left</v-icon>

                    <span v-if="showSeries">Hide</span>
                    <span v-else>Show</span>
                    &nbsp;Series

                    <v-icon v-if="!showSeries">mdi-chevron-right</v-icon>
                </v-btn>
            </v-layout>
        </v-col>
        <v-col cols="6">
            <v-layout justify-center>
                <!-- tools -->
                <v-btn-toggle dark dense mandatory v-model="activeTool">
                    <v-tooltip v-for="tool of tools" bottom open-delay="500" :key="tool.name">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on">
                                <v-icon>{{ tool.icon }}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ tool.title }}</span>
                    </v-tooltip>
                </v-btn-toggle>

                <v-btn dark class="ml-4" @click="resetView">Reset View</v-btn>
            </v-layout>
        </v-col>
        <v-col cols="3" style="">
            <v-layout justify-end>
                <v-btn dark text @click="toggleMetadataPanel">
                    <v-icon v-if="!showMetadata">mdi-chevron-left</v-icon>

                    <span v-if="showMetadata">Hide</span>
                    <span v-else>Show</span>
                    &nbsp;Metadata

                    <v-icon v-if="showMetadata">mdi-chevron-right</v-icon>
                </v-btn>
            </v-layout>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { WindowLevelTool, ZoomTool, PanTool, TrackballRotateTool } from "@cornerstonejs/tools";

type DicomToolItem = {
    name: string;
    icon: string;
    title: string;
};

type DicomToolsData = {
    activeTool: number;
    tools: DicomToolItem[];
};

export default defineComponent({
    data(): DicomToolsData {
        return {
            activeTool: 2,
            tools: [
                {
                    name: WindowLevelTool.toolName,
                    icon: "mdi-contrast-circle",
                    title: "Change Windowing",
                },
                {
                    name: TrackballRotateTool.toolName,
                    icon: "mdi-rotate-right",
                    title: "Rotate",
                },
                {
                    name: PanTool.toolName,
                    icon: "mdi-pan",
                    title: "Pan",
                },
                {
                    name: ZoomTool.toolName,
                    icon: "mdi-magnify-plus-outline",
                    title: "Zoom",
                },
            ],
        };
    },
    emits: ["set-active-tool", "reset-view", "toggle-metadata-panel", "toggle-series-panel"],
    props: {
        showMetadata: { default: false, type: Boolean },
        showSeries: { default: false, type: Boolean },
    },
    watch: {
        activeTool(toolIndex: number) {
            this.$emit("set-active-tool", this.tools[toolIndex].name);
        },
    },
    methods: {
        resetView() {
            this.activeTool = 2;
            this.$emit("set-active-tool", PanTool.toolName);
            this.$emit("reset-view");
        },
        toggleMetadataPanel() {
            this.$emit("toggle-metadata-panel");
        },
        toggleSeriesPanel() {
            this.$emit("toggle-series-panel");
        },
    },
});
</script>

<style lang="scss" scoped>
.toolbar {
    position: absolute;
    top: 0;
    width: 100%;

    &.row {
        margin: 0;
    }
}
</style>