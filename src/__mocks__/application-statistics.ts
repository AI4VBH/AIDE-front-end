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

import { IModelDetails, IModelSummary } from "@/models/Admin/IModel";
import { rest } from "msw";

const models = [
    {
        model_id: 2,
        model_name: "Asda",
    },
    {
        model_id: 4,
        model_name: "Banana",
    },
    {
        model_id: 100,
        model_name: "Crayon",
    },
];

const modelStats = {
    model_id: 2,
    model_name: "Asda",
    total_executions: 500,
    total_failures: 25,
    status: "Active",
    days: [
        {
            date: "20220516",
            total_executions: 200,
            total_failures: 10,
        },
        {
            date: "20220517",
            total_executions: 100,
            total_failures: 5,
        },
        {
            date: "20220518",
            total_executions: 200,
            total_failures: 10,
        },
    ],
};

export const applicationsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/models`, (_req, res, ctx) => {
        return res(ctx.json<IModelSummary[]>(models));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/models/:model_id`, (_req, res, ctx) => {
        return res(ctx.json<IModelDetails>(modelStats));
    }),
];
