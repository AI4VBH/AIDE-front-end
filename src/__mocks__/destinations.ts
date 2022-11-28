import { IExportDestination } from "@/models/export-destinations/ExportDestination";
import { rest } from "msw";

const destinations = [
    {
        name: "SOMENAME",
        aeTitle: "AETITLEA",
        port: 5000,
        hostIp: "0.0.0.0",
    },
    {
        name: "FAILECHO",
        aeTitle: "AETITLEA",
        port: 5000,
        hostIp: "0.0.0.0",
    },
];

export const destinationHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/destinations`, (_req, res, ctx) => {
        return res(ctx.json<IExportDestination[]>(destinations));
    }),
    rest.post(`${window.FRONTEND_API_HOST}/destinations`, async (req, res, ctx) => {
        const body = await req.json<IExportDestination>();

        if (body.name === "CONFLICT") {
            return res(
                ctx.status(409),
                ctx.json({ statusCode: 409, message: "Server returned with status code 409" }),
            );
        }

        return res(
            ctx.json<IExportDestination>({
                name: "SOME_NAME",
                aeTitle: "AE_TITLE_A",
                port: 5000,
                hostIp: "0.0.0.0",
            }),
        );
    }),
    rest.put(`${window.FRONTEND_API_HOST}/destinations/:name`, (_req, res, ctx) => {
        return res(
            ctx.json<IExportDestination>({
                name: "SOME_NAME",
                aeTitle: "AE_TITLE_A",
                port: 5000,
                hostIp: "0.0.0.0",
            }),
        );
    }),
    rest.get(`${window.FRONTEND_API_HOST}/destinations/echo/:name`, (req, res, ctx) => {
        if (req.params.name === "FAIL_ECHO") {
            return res(ctx.delay(1000), ctx.status(400));
        }

        return res(ctx.delay(), ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/destinations/:name`, (_req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
