/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import ApiMocks from "../../fixtures/mockIndex";
import { IExportDestination } from "../../../src/models/export-destinations/ExportDestination";

export class DestinationData implements IExportDestination {
    name: string;
    port: number;
    aeTitle: string;
    hostIp: string;

    constructor(destination: IExportDestination) {
        this.name = destination.name;
        this.port = destination.port;
        this.aeTitle = destination.aeTitle;
        this.hostIp = destination.hostIp;
    }

    public static DESTINATIONS_EXAMPLE: DestinationData = new DestinationData(
        <IExportDestination>ApiMocks.DESTINATIONS_EXAMPLE[0],
    );

    public static DESTINATION_ADD: DestinationData = new DestinationData(
        <IExportDestination>ApiMocks.DESTINATION_ADD,
    );
}
