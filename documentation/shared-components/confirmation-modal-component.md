<!--
  ~ Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
-->

# Table of Contents
1. [Overview](#overview)
2. [Component props](#component-props)

# Overview
Modal used for confirming user actions such as deleting or updating items.
&nbsp;
![image](../static/confirmation-modal.png)

# Component props
- `dataCyPrefix: string` - string to be aded to the `data-cy` tag of the modal elements for Cypress tests.
- `persistent: boolean` - if set to true - dialog is not dismissed when clicking outside the modal or pressing `esc` key.
- `title: string` - descriptive title of the modal.
- `cancelBtnText: string` - text to be displayed on the button that cancels the action.
- `continueBtnText: string` - text to be displayed on the button that confirms the action.
- `value: boolean` - used to display/hide the modal.
