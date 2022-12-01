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
    <div data-cy="editor" class="json-editor" ref="editor" />
</template>

<script>
import { JSONEditor } from "vanilla-jsoneditor";

// JSONEditor properties as of version 0.3.60
const propNames = [
    "content",
    "mode",
    "mainMenuBar",
    "navigationBar",
    "statusBar",
    "readOnly",
    "indentation",
    "tabSize",
    "escapeControlCharacters",
    "escapeUnicodeCharacters",
    "validator",
    "onError",
    "onChange",
    "onChangeMode",
    "onClassName",
    "onRenderValue",
    "onRenderMenu",
    "queryLanguages",
    "queryLanguageId",
    "onChangeQueryLanguage",
    "onFocus",
    "onBlur",
];

function pickDefinedProps(object, propNames) {
    const props = {};
    for (const propName of propNames) {
        if (object[propName] !== undefined) {
            props[propName] = object[propName];
        }
    }
    return props;
}

export default {
    name: "VueJSONEditor",
    props: propNames,
    watch: {
        content: function (content) {
            this.editor.set(content);
        },
    },
    mounted() {
        this.editor = new JSONEditor({
            target: this.$refs["editor"],
            props: pickDefinedProps(this, propNames),
        });
    },
    updated() {
        const props = pickDefinedProps(this, propNames);
        this.editor.updateProps(props);
    },
    beforeUnmount() {
        this.editor.destroy();
        this.editor = null;
    },
};
</script>
