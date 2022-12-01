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

import { rest } from "msw";
import { setupServer } from "msw/node";
import { createMock } from "@golevelup/ts-jest";
import { expect, test as it } from "@jest/globals";
import Vue from "vue";
import { ToastApi } from "vue-toast-notification";

import {
    getAllUsers,
    updateUserDetails,
    deleteUser,
    createUser,
    getAllRoles,
    getPaginatedRoles,
    deleteRole,
    updateRole,
    createRole,
} from "../api/user-management/UserManagementService";
import { AxiosError } from "axios";

jest.mock("vue");

const server = setupServer();
const mockToaster = createMock<ToastApi>();
Vue.$toast = mockToaster;

describe("UserManagementService", () => {
    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(() => {
        server.resetHandlers();
        jest.resetAllMocks();
    });

    describe("getAllUsers", () => {
        it.each([
            [1, "?search=User+name&role=&first=0&max=5"],
            [2, "?search=User+name&role=&first=5&max=5"],
        ])("passes params correctly", async (page, query) => {
            server.use(
                rest.get("*/users", (req, res, ctx) => {
                    const search = req.url.search;

                    expect(search).toBe(query);

                    return res(
                        ctx.json({ totalUserCount: 0, totalFilteredUserCount: 0, users: [] }),
                    );
                }),
            );

            const result = await getAllUsers({ search: "User name", itemsPerPage: 5, page: page });

            expect(result).toMatchSnapshot();
        });

        it.each([400, 404, 500])(
            "shows toast with correct message if response is %s",
            async (status) => {
                server.use(
                    rest.get("*/users", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await getAllUsers({ search: "User name", itemsPerPage: 5, page: 1 });
                } catch {
                    // axios throws exception but do nothing
                }

                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong retrieving users",
                );
            },
        );
    });

    describe("updateUserDetails", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.put("*/users/5f446d6d-98ae-42c8-aa23-e234e8906882", async (req, res, ctx) => {
                    const body = await req.json();

                    expect(body).toMatchSnapshot();
                    return res(ctx.status(200));
                }),
            );

            const response = await updateUserDetails("5f446d6d-98ae-42c8-aa23-e234e8906882", {
                id: "5f446d6d-98ae-42c8-aa23-e234e8906882",
                firstName: "Joe",
                lastName: "Bloggs",
                enabled: true,
                email: "joe.b@email.com",
                realmRoles: [
                    {
                        id: "953bac4f-bba3-443f-b341-82a3f9ab9d85",
                        name: "Admin",
                    },
                ],
            });

            expect(response.status).toBe(200);
        });

        it.each([400, 404, 500])("returns expected result when response is %s", async (status) => {
            server.use(
                rest.put("*/users/5f446d6d-98ae-42c8-aa23-e234e8906882", (_req, res, ctx) => {
                    return res(ctx.status(status));
                }),
            );

            const response = (await updateUserDetails("5f446d6d-98ae-42c8-aa23-e234e8906882", {
                id: "5f446d6d-98ae-42c8-aa23-e234e8906882",
                firstName: "Joe",
                lastName: "Bloggs",
                enabled: true,
                email: "joe.b@email.com",
                realmRoles: [
                    {
                        id: "953bac4f-bba3-443f-b341-82a3f9ab9d85",
                        name: "Admin",
                    },
                ],
            })) as AxiosError;
            const error = response.toJSON() as { status: number };

            expect(error.status).toBe(status);
        });
    });

    describe("deleteUser", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.delete("*/users/*", (_req, res, ctx) => {
                    return res(ctx.status(200));
                }),
            );

            const result = await deleteUser("f7efb130-c1c6-4b74-b1aa-73bee50e7b6b");

            expect(result).toBe(true);
        });

        it.each([400, 404, 500])(
            "shows toast with correct message if response is %s",
            async (status) => {
                server.use(
                    rest.delete("*/users/*", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await deleteUser("6c990eb5-770f-447b-b9b6-b33404b7b856");
                } catch {
                    // axios throws exception but do nothing
                }

                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong deleting the user",
                );
            },
        );
    });

    describe("createUser", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.post("*/users", async (req, res, ctx) => {
                    const body = await req.json();

                    expect(body).toMatchSnapshot();
                    return res(ctx.status(200));
                }),
            );

            const response = await createUser({
                id: "5f446d6d-98ae-42c8-aa23-e234e8906882",
                firstName: "Joe",
                lastName: "Bloggs",
                enabled: true,
                email: "joe.b@email.com",
                realmRoles: [
                    {
                        id: "953bac4f-bba3-443f-b341-82a3f9ab9d85",
                        name: "Admin",
                    },
                ],
            });

            expect(response.status).toBe(200);
        });

        it.each([400, 404, 500])("returns expected result when response is %s", async (status) => {
            server.use(
                rest.post("*/users", (_req, res, ctx) => {
                    return res(ctx.status(status));
                }),
            );

            const response = (await createUser({
                id: "5f446d6d-98ae-42c8-aa23-e234e8906882",
                firstName: "Joe",
                lastName: "Bloggs",
                enabled: true,
                email: "joe.b@email.com",
                realmRoles: [
                    {
                        id: "953bac4f-bba3-443f-b341-82a3f9ab9d85",
                        name: "Admin",
                    },
                ],
            })) as AxiosError;
            const error = response.toJSON() as { status: number };

            expect(error.status).toBe(status);
        });
    });

    describe("getAllRoles", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.get("*/roles/list", (_req, res, ctx) => {
                    return res(
                        ctx.json([
                            {
                                id: "953bac4f-bba3-443f-b341-82a3f9ab9d85",
                                name: "Admin",
                            },
                        ]),
                    );
                }),
            );

            const result = await getAllRoles();

            expect(result).toMatchSnapshot();
        });

        it.each([400, 404, 500])(
            "shows toast with correct message if response is %s",
            async (status) => {
                server.use(
                    rest.get("*/roles/list", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await getAllRoles();
                } catch {
                    // axios throws exception but do nothing
                }

                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong retrieving roles",
                );
            },
        );
    });

    describe("getPaginatedRoles", () => {
        it.each([
            [1, "?search=some+role&first=0&max=5"],
            [2, "?search=some+role&first=5&max=5"],
        ])("passes params correctly", async (page, query) => {
            server.use(
                rest.get("*/roles", (req, res, ctx) => {
                    const search = req.url.search;
                    expect(search).toBe(query);
                    return res(
                        ctx.json({ totalUserCount: 0, totalFilteredUserCount: 0, users: [] }),
                    );
                }),
            );

            const result = await getPaginatedRoles({
                search: "some role",
                itemsPerPage: 5,
                page: page,
            });

            expect(result).toMatchSnapshot();
        });

        it.each([400, 404, 500])(
            "shows toast with correct message if response is %s",
            async (status) => {
                server.use(
                    rest.get("*/roles", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await getPaginatedRoles({ search: "some role", itemsPerPage: 5, page: 1 });
                } catch {
                    // axios throws exception but do nothing
                }

                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong retrieving roles",
                );
            },
        );
    });

    describe("deleteRole", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.delete("*/roles/*", (_req, res, ctx) => {
                    return res(ctx.status(200));
                }),
            );

            const result = await deleteRole("f7efb130-c1c6-4b74-b1aa-73bee50e7b6b");

            expect(result).toBe(true);
        });

        it.each([400, 404, 500])(
            "shows toast with correct message if response is %s",
            async (status) => {
                server.use(
                    rest.delete("*/roles/*", (_req, res, ctx) => {
                        return res(ctx.status(status));
                    }),
                );

                try {
                    await deleteRole("6c990eb5-770f-447b-b9b6-b33404b7b856");
                } catch {
                    // axios throws exception but do nothing
                }

                expect(mockToaster.error).toHaveBeenCalledWith(
                    "Something unexpected went wrong deleting the role",
                );
            },
        );
    });

    describe("updateRole", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.put("*/roles/750bbc11-ad19-4925-a640-5ed629452db5", async (req, res, ctx) => {
                    const body = await req.json();

                    expect(body).toMatchSnapshot();

                    return res(ctx.status(200));
                }),
            );

            const response = await updateRole("750bbc11-ad19-4925-a640-5ed629452db5", {
                id: "750bbc11-ad19-4925-a640-5ed629452db5",
                name: "role-edit",
            });

            expect(response.status).toBe(200);
        });

        it.each([400, 404, 500])("returns expected result when response is %s", async (status) => {
            server.use(
                rest.put("*/roles/750bbc11-ad19-4925-a640-5ed629452db5", (_req, res, ctx) => {
                    return res(ctx.status(status));
                }),
            );

            const response = (await updateRole("750bbc11-ad19-4925-a640-5ed629452db5", {
                id: "750bbc11-ad19-4925-a640-5ed629452db5",
                name: "role-edit",
            })) as AxiosError;
            const error = response.toJSON() as { status: number };

            expect(error.status).toBe(status);
        });
    });

    describe("createRole", () => {
        it("returns expected OK result", async () => {
            server.use(
                rest.post("*/roles", async (req, res, ctx) => {
                    const body = await req.json();

                    expect(body).toMatchSnapshot();

                    return res(ctx.status(201));
                }),
            );

            const response = await createRole({
                name: "new-role",
            });

            expect(response.status).toBe(201);
        });

        it.each([400, 404, 500])("returns expected result when response is %s", async (status) => {
            server.use(
                rest.post("*/roles", (_req, res, ctx) => {
                    return res(ctx.status(status));
                }),
            );

            const response = (await createRole({ name: "role-edit" })) as AxiosError;
            const error = response.toJSON() as { status: number };

            expect(error.status).toBe(status);
        });
    });
});
