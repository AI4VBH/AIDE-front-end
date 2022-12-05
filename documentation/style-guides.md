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
- [Style guides](#style-guides)
    - [Colour palette](#colour-palette)
    - [Typography](#typography)
    - [Iconography](#iconography)
    - [Main components](#main-components)

# Style-guides
### Colour-palette
- Primary colour: `#61366E`
- Secondary colour: `#F7F3F9`

### Typography
- Headings use [Bai Jamjuree](https://fonts.google.com/specimen/Bai+Jamjuree) font style.
- Main font style is [Open Sans](https://fonts.google.com/specimen/Open+Sans).

### Iconography
The application uses [Material Design Icons](https://materialdesignicons.com/) library for iconography.

### Main-components

- Buttons - [Vuetify `v-btn` component](https://vuetifyjs.com/en/components/buttons/)
&nbsp;
    - **Primary button:**
    Background colour: `#61366E`
    Text colour: `#FFFFFF`
    &nbsp;
    ![image](./static/primary-button.PNG)
    &nbsp;
    - **Secondary button:**
    Background colour: `#F7F3F9`
    Text colour: `#61366E`
    &nbsp;
    ![image](./static/secondary-button.PNG)
---
- Tables - [Vuetify `v-data-table` component](https://vuetifyjs.com/en/components/data-tables/). Tables use inbuilt pagination and searching/filtering/checkbox components (if applicable).
&nbsp;
    ![image](./static/table-issues.PNG)
---
- Modals - [Vuetify `v-dialog` component](https://vuetifyjs.com/en/components/dialogs/)
&nbsp;
    - **Confirmation modals**
    &nbsp;
    ![image](./static/confirmation-modal.PNG)
    &nbsp;
    - **Form modals** - combines `v-dialog` and [Vuetify form `v-form`](https://vuetifyjs.com/en/components/forms/) UI components.
    &nbsp;
    ![image](./static/form-modal.PNG)
---
- Toast notifications (used to inform the user if API requests are successful) implemented using `vue-toast-notification` package (https://www.npmjs.com/package/vue-toast-notification).
&nbsp;
    - **Successful toast notification:**
    &nbsp;
    ![image](./static/success-toast.PNG)
    &nbsp;
    - **Error toast notification:**
    &nbsp;
    ![image](./static/error-toast.PNG)
