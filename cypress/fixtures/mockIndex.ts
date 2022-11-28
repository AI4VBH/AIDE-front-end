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

export default class ApiMocks {
    //Health Dashboard
    public static ADMIN_DASHBOARD_MODELS = require("./health-dashboard/adminDashboardModels.json");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY = require("./health-dashboard/adminDashboardModelDetailsOneDay.json");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_TEN_DAYS = require("./health-dashboard/adminDashboardModelDetailsTenDays.json");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_ONE_HUNDRED_DAYS = require("./health-dashboard/adminDashboardModelDetailsOneHundredDays.json");
    public static ADMIN_DASHBOARD_EXECUTION_LOGS = require("./health-dashboard/adminDashboardExecutionLogs.json");
    public static ADMIN_DASHBOARD_NO_FAILED_MODELS = require("./health-dashboard/adminDashboardNoFailedModels.json");
    public static ADMIN_DASHBOARD_FAILED_MODELS = require("./health-dashboard/adminDashboardFailedModels.json");
    public static ADMIN_DASHBOARD_TASKS = require("./health-dashboard/adminDashboardIssues.json");
    public static ADMIN_DASHBOARD_SINGLE_TASK = require("./health-dashboard/adminDashboardSingleIssue.json");
    public static ADMIN_DASHBOARD_ISSUES_DISMISS = require("./health-dashboard/adminDashboardIssuesDismiss.json");
    //Payload Dashboard
    public static ADMIN_DASHBOARD_PAYLOAD_TABLE = require("./payload-dashboard/payloadTable.json");
    public static ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS = require("./payload-dashboard/payloadExecutions.json");
    public static PAYLOAD_SEARCH = require("./payload-dashboard/payloadSearch.json");
    public static PAYLOAD_METADATA = require("./payload-dashboard/payloadMetadata.json");
    //User Management
    public static USER_MANAGEMENT_GET_USERS = require("./user-management/userManagement.json");
    public static USER_MANAGEMENT_ROLES = require("./user-management/userManagementRoles.json");
    public static USER_MANAGEMENT_EMPTY = require("./user-management/userManagementEmpty.json");
    public static USER_MANAGEMENT_ADD_USER = require("./user-management/userManagementAddUser.json");
    public static USER_MANAGEMENT_ONE_USER = require("./user-management/userManagementOneUser.json");
    public static USER_MANAGEMENT_SEARCH = require("./user-management/userManagementSearch.json");
    public static USER_MANAGEMENT_SORT_FIRST_NAME = require("./user-management/userManagementSortFirst.json");
    public static USER_MANAGEMENT_SORT_LAST_NAME = require("./user-management/userManagementSortLast.json");
    public static USER_MANAGEMENT_SORT_EMAIL = require("./user-management/userManagementSortEmail.json");
    public static USER_MANAGEMENT_PAGINATION = require("./user-management/userManagementPagination.json");
    public static USER_MANAGEMENT_ROLES_SORTED = require("./user-management/userManagementRolesSorted.json");
    public static USER_MANAGEMENT_ROLES_SEARCH = require("./user-management/userManagementRolesSearch.json");
    public static USER_MANAGEMENT_ROLES_ADD = require("./user-management/userManagementRolesAdd.json");
    public static USER_MANAGEMENT_ONE_ROLE = require("./user-management/userManagementOneRole.json");
    public static USER_MANAGEMENT_ROLES_EDIT = require("./user-management/userManagementRolesEdit.json");
    public static USER_MANAGEMENT_ROLES_EMPTY = require("./user-management/userManagementRolesEmpty.json");
    public static USER_MANAGEMENT_ROLES_PAGINATION = require("./user-management/userManagementRolesPagination.json");
    public static USER_MANAGEMENT_ROLES_LIST = require("./user-management/userManagementRolesList.json");
    public static USER_MANAGEMENT_ONE_ROLES_LIST = require("./user-management/userManagementOneRolesList.json");
    public static USER_MANAGEMENT_ROLES_LIST_ADDED = require("./user-management/userManagementRolesListAdded.json");
    public static USER_MANAGEMENT_ROLES_EDIT_TABLE = require("./user-management/userManagementRolesEditTable.json");
    public static USER_MANAGEMENT_SORT_ADMIN_ROLE = require("./user-management/userManagementSortAdminRole.json");
    //Workflows
    public static WORKFLOWS = require("./workflows/workflows.json");
    public static WORKFLOWS_TEN = require("./workflows/workflowsTen.json");
    public static WORKFLOW_EXAMPLE = require("./workflows/workflowExample.json");
    public static WORKFLOW_EMPTY = require("./workflows/workflowEmpty.json");
    public static WORKFLOW_ERRORS = require("./workflows/workflowsErrors.json");
    //Clinical Review
    public static CLINICAL_REVIEW_ALL_EXECUTIONS = require("./clinical-review/allExecutionsForReview.json");
    public static CLINICAL_REVIEW_PAGE_1 = require("./clinical-review/clinicalReviewPage1.json");
    public static CLINICAL_REVIEW_PAGE_2 = require("./clinical-review/clinicalReviewPage2.json");
    public static CLINICAL_REVIEW_REVIEWED = require("./clinical-review/clinicalReviewed.json");
    public static CLINICAL_REVIEW_RESPONSE = require("./clinical-review/clinicalReviewResponse.json");
    public static REMOTE_DICOM_METADATA = require("./clinical-review/remoteDicomMetadata.json");
    //App Store
    public static APP_STORE_ALL_PERMUTATIONS = require("./app-store/appStoreAllPermutations.json");
    public static APP_STORE_SPECIALITY_DROP_DOWN = require("./app-store/appStoreSpecialityDropDown.json");
    //App Profile
    public static APP_PROFILE_PAGE1 = require("./app-profile/appProfilePage1.json");
    public static APP_PROFILE_PAGE2 = require("./app-profile/appProfilePage2.json");
    //Export Destinations
    public static DESTINATIONS_EXAMPLE = require("./export-Destinations/destinations.json");
    public static DESTINATION_ADD = require("./export-Destinations/newDestination.json");
    public static DESTINATIONS_ADDED = require("./export-Destinations/addedDestination.json");
}
