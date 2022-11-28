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

import { UserRoleListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class RolePostData implements UserRoleListItem {
    id: string;
    name: string;
    editable?: boolean;

    constructor(role: UserRoleListItem) {
        this.id = role.id;
        this.name = role.name;
        this.editable = role.editable;
    }

    public static ROLE_POST_DATA: RolePostData = new RolePostData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES,
    );
}
