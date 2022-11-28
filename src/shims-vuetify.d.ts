/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

declare module "vuetify/lib/framework" {
    import Vuetify from "vuetify";
    export default Vuetify;
}

declare module "vue-json-pretty" {
    function VueJsonPretty(): void;
    export = VueJsonPretty;
}

declare module "vue-pdf";
declare module "pdfvuer";
declare module "cornerstone-core";
declare module "cornerstone-web-image-loader";
declare module "cornerstone-tools";
declare module "cornerstone-math";
declare module "hammerjs";
declare module "numeral";
declare module "@ssthouse/vue-tree-chart";
declare module "cornerstone-wado-image-loader";
