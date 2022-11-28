<!--
  ~ Copyright 2022 Crown Copyright
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

# aide-frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

create a .env file in the projects root directory and add/configure the following

```
VUE_APP_KEYCLOAK_REALM=aide
VUE_APP_KEYCLOAK_CLIENT_ID=aide-app
VUE_APP_KEYCLOAK_ON_LOAD=login-required
VUE_APP_AUTH_ENABLED=false
```

To modify the Backend API host or the Keycloak url, you must update the env-config.js within the public/ directory

```
window.FRONTEND_API_HOST = "http://localhost:5000";
window.KEYCLOAK_URL = "https://localhost:8443/auth";
