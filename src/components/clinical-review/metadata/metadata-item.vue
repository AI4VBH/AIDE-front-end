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
        inactive
        role=""
        data-cy="metadata-item"
        :class="{ outlined: pinned }"
        class="mb-2"
    >
        <v-list-item-content>
            <v-tooltip bottom open-delay="250">
                <template v-slot:activator="{ on }">
                    <v-list-item-title v-on="on" data-cy="metadata-name">
                        {{ name }}
                    </v-list-item-title>
                </template>
                <span>{{ name }}</span>
            </v-tooltip>

            <v-tooltip bottom open-delay="250">
                <template v-slot:activator="{ on }">
                    <v-list-item-subtitle v-on="on" data-cy="metadata-value">
                        {{ value }}
                    </v-list-item-subtitle>
                </template>
                <span>{{ value }}</span>
            </v-tooltip>
        </v-list-item-content>
        <v-list-item-action>
            <v-btn icon data-cy="pin-metadata" @click="pinItem">
                <template v-if="!pinned">
                    <v-icon color="grey lighten-2">mdi-pin</v-icon>
                    <span class="d-sr-only">Pin</span>
                </template>
                <template v-else>
                    <v-icon color="grey lighten-2">mdi-pin-off</v-icon>
                    <span class="d-sr-only">Unpin</span>
                </template>
            </v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        name: { default: "", type: String },
        value: { default: "", type: String },
        pinned: { default: false, type: Boolean },
    },
    emits: ["pin-item"],
    methods: {
        pinItem() {
            this.$emit("pin-item", this.name);
        },
    },
});
</script>

<style lang="scss" scoped>
.v-list-item.outlined {
    border: solid 1px rgba($color: #ffffff, $alpha: 0.3);
}

.v-list-item__title {
    font-weight: bold !important;
}

.v-list-item__content,
.v-list-item__subtitle {
    color: #fff !important;
}
</style>
