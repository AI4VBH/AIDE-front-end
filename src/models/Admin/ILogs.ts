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

export interface ILogs {
    json: ILog;
}

export interface ILog {
    execution_id: string;
    level: string;
    line_no: number;
    logger: string;
    model_name: string;
    model_version: string;
    module: string;
    msg: string;
    thread: string;
    type: string;
    written_at: string;
    written_ts: number;
}
