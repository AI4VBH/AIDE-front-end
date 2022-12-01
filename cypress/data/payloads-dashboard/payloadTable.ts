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

import { IPagedResponse, IPayload } from "../../../src/models/Admin/IPayload";
import ApiMocks from "../../fixtures/mockIndex";

export class PayloadData implements IPagedResponse<IPayload> {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: string;
    previousPage: string;
    data: IPayload[];

    constructor(payload: IPagedResponse<IPayload>) {
        this.pageNumber = payload.pageNumber;
        this.pageSize = payload.pageSize;
        this.firstPage = payload.firstPage;
        this.lastPage = payload.lastPage;
        this.totalPages = payload.totalPages;
        this.totalRecords = payload.totalRecords;
        this.nextPage = payload.nextPage;
        this.previousPage = payload.previousPage;
        this.data = payload.data;
    }

    public static PAYLOAD_TABLE_DATA: PayloadData = new PayloadData(
        <IPagedResponse<IPayload>>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE,
    );
    public static PAYLOAD_SEARCH: PayloadData = new PayloadData(
        <IPagedResponse<IPayload>>ApiMocks.PAYLOAD_SEARCH,
    );
}
