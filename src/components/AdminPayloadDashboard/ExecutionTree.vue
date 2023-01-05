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
    <div class="container ma-0">
        <v-row v-if="!loading">
            <div style="width: 75%">
                <vue-tree
                    ref="tree"
                    style="width: 100%; height: 400px"
                    :dataset="payloadExecutions"
                    :config="treeConfig"
                    direction="horizontal"
                    :collapse-enabled="false"
                    link-style="straight"
                >
                    <template v-slot:node="{ node }">
                        <div
                            class="rich-media-node"
                            :style="{ cursor: !node.execution_id ? 'not-allowed' : 'pointer' }"
                            @click="setSelectedNode(node)"
                        >
                            <span
                                :class="`tree-node d-flex flex-column ${node.status} ${
                                    selectedNode?.id === node.id ? 'selected' : ''
                                }`"
                                :data-cy="
                                    node.workflow_name
                                        ? `node-${node.workflow_name}`
                                        : `node-${node.name}`
                                "
                            >
                                <span class="tree-node-title mt-3">
                                    <span
                                        :data-cy="`node-name-${node.workflow_name}`"
                                        v-if="node.id === 'workflow-instance'"
                                        >{{ node.workflow_name }}</span
                                    >
                                    <span :data-cy="`node-name-${node.name}`" v-else>{{
                                        node.name
                                    }}</span>
                                </span>
                                <span v-if="node.id === 'workflow-instance'" class="tree-node-text">
                                    Workflow
                                </span>
                                <span
                                    v-else-if="node.id === 'no-workflow-instance'"
                                    class="tree-node-text"
                                >
                                </span>
                                <span v-else-if="node.id !== 'root-node'" class="tree-node-text">
                                    Task
                                </span>
                                <span
                                    v-if="node.id !== 'root-node'"
                                    class="tree-node-text"
                                    :data-cy="
                                        node.workflow_name
                                            ? `node-date-${node.workflow_name}`
                                            : `node-date-${node.name}`
                                    "
                                >
                                    {{ node.start_date | formatDateAndTimeOfString }}
                                </span>
                            </span>
                        </div>
                    </template>
                </vue-tree>
                <v-btn elevation="2" fab class="tree-button ml-5" @click="resetExecutionTree">
                    <v-icon color="black" data-cy="reset"> mdi-arrow-u-left-bottom </v-icon>
                </v-btn>
                <v-btn elevation="2" fab class="tree-button" @click="zoomInExecutionTree">
                    <v-icon color="black" data-cy="zoom-in"> mdi-magnify-plus-outline </v-icon>
                </v-btn>
                <v-btn elevation="2" fab class="tree-button" @click="zoomOutExecutionTree">
                    <v-icon color="black" data-cy="zoom-out"> mdi-magnify-minus-outline </v-icon>
                </v-btn>
            </div>
            <ModelDetailsSection v-if="selectedNode" :selected-node="selectedNode" />
        </v-row>
        <div v-else class="text-center my-3">
            <v-progress-circular indeterminate color="grey" data-cy="progress" />
        </div>
    </div>
</template>

<script lang="ts">
import VueTree from "@ssthouse/vue-tree-chart";
import Component from "vue-class-component";
import Vue from "vue";
import { getPayloadExecutions } from "@/api/Admin/payloads/PayloadService";
import { formatDateAndTimeOfString } from "@/utils/date-utilities";
import ModelDetailsSection from "./ModelDetailsSection.vue";
import { Prop } from "vue-property-decorator";
import {
    ExecutionTreeFirstNode,
    ExecutionTreeNode,
    mapToExecutionTree,
    RootNode,
} from "@/utils/workflow-instance-mapper";
import { TaskExecution, WorkflowInstance } from "@/models/Admin/IPayload";

Vue.component("vue-tree", VueTree);

@Component({
    components: {
        "vue-tree": VueTree,
        ModelDetailsSection,
    },
    filters: {
        formatDateAndTimeOfString,
    },
})
export default class ExecutionTree extends Vue {
    @Prop({ required: true })
    payloadId!: string;

    @Prop()
    selectedExecutionId?: string;

    loading = false;
    selectedNode: ExecutionTreeNode | null = null;
    payloadExecutions = {} as RootNode;
    workflowInstances: WorkflowInstance[] = [];
    treeConfig = { nodeWidth: 115, nodeHeight: 70, levelHeight: 200 };

    async mounted() {
        await this.getPayloadExecutionsForTree();

        if (this.selectedExecutionId) {
            for (const workflowInstance of this.workflowInstances) {
                for (const task of workflowInstance.tasks) {
                    if (task.execution_id === this.selectedExecutionId) {
                        this.selectNodeByTaskExecution(task);
                        return;
                    } else {
                        this.checkNextTaskForExecution(task);
                    }
                }
            }
        }
    }

    private findNode(
        nodes: (ExecutionTreeNode | ExecutionTreeFirstNode)[],
        execution_id: string,
    ): ExecutionTreeNode | undefined {
        for (const node of nodes) {
            if (node.id == "workflow-instance" || node.id == "root-node") {
                const executionNode = this.findNode(node.children, execution_id);

                if (executionNode) {
                    return executionNode;
                }
            }
            const etnNode = node as ExecutionTreeNode;
            if (etnNode.execution_id === execution_id) {
                return etnNode;
            } else {
                const executionNode = this.findNode(etnNode.children, execution_id);

                if (executionNode) {
                    return executionNode;
                }
            }
        }
    }

    private selectNodeByTaskExecution(task: TaskExecution) {
        const node = this.findNode(this.payloadExecutions.children, task.execution_id);
        if (node && task.execution_id === node.execution_id) {
            this.setSelectedNode(node);
            return;
        }
    }

    private checkNextTaskForExecution(task: TaskExecution) {
        if (task.execution_id === this.selectedExecutionId) {
            this.selectNodeByTaskExecution(task);
            return;
        }
        for (const nextTask of task.next_task) {
            if (nextTask.execution_id === this.selectedExecutionId) {
                this.selectNodeByTaskExecution(nextTask);
                return;
            } else {
                for (const nextNextTask of nextTask.next_task) {
                    this.checkNextTaskForExecution(nextNextTask);
                }
            }
        }
    }

    private async getPayloadExecutionsForTree(): Promise<void> {
        this.loading = true;

        this.workflowInstances = await getPayloadExecutions(this.payloadId);
        this.payloadExecutions = mapToExecutionTree(this.workflowInstances);

        this.loading = false;
    }

    setSelectedNode(node: ExecutionTreeNode): void {
        if (node.id === "root-node" || node.id === "workflow-instance") {
            return;
        }

        if (this.selectedNode?.id === node.id) {
            this.selectedNode = null;
            return;
        }

        this.selectedNode = node;
    }

    zoomInExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.zoomIn();
        }
    }

    zoomOutExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.zoomOut();
        }
    }

    resetExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.restoreScale();
        }

        const tree = document.querySelector(".dom-container") as HTMLElement;
        const treeLink = document.querySelector(".vue-tree") as HTMLElement;
        if (tree && treeLink) {
            tree.style.transform = "translate(" + -100 + "px," + 190 + "px)";
            treeLink.style.transform = "translate(" + -100 + "px," + 190 + "px)";
        }
    }
}
</script>

<style>
.node-slot {
    cursor: initial !important;
}
</style>

<style lang="scss" scoped>
.tree-node {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    background-color: orange;

    &.Failed,
    &.failed,
    &.PartialFail,
    &.partialFail {
        background-color: red;
    }

    &.Succeeded,
    &.succeeded {
        background-color: green;
    }

    &.selected {
        border: 2px solid black;
    }
}

.tree-node-title {
    font-weight: bold;
    font-size: 14px;
}

.tree-node-text {
    font-size: 12px;
}

.tree-node-title,
.tree-node-text {
    width: 8rem;
    text-align: left;
}

.tree-button {
    width: 30px;
    height: 30px;
    margin: 10px 3px;
}
</style>
