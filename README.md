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

<a name="readme-top"></a>

<div align="center">

[![Build](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/build.yml/badge.svg)](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/build.yml)
[![Test](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/test.yml/badge.svg)](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/test.yml)
[![Security Scanning](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/security.yml/badge.svg)](https://github.com/AI4VBH/AIDE-front-end/actions/workflows/security.yml)

</div>

<br />
<div align="center">
  <a href="https://github.com/AI4VBH/AIDE-front-end">
    <img src="aide-logo.png" alt="Logo" height="80">
  </a>

<h3 align="center">AIDE Front-End</h3>

  <p align="center">
    The AIDE Front-End is the UI component of AIDE.
    <br />
    <br />
    <a href="https://github.com/AI4VBH/AIDE-front-end/issues">Report Bug</a>
    ·
    <a href="https://github.com/AI4VBH/AIDE-front-end/issues">Request Feature</a>
  </p>
</div>

## Getting started

Start by cloning or creating a fork of this repository. See GitHub's documentation for help with this: https://docs.github.com/en/get-started/quickstart/fork-a-repo

Secondly ensure that you download and install [Node & NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Once you have installed Node and NPM, you can verify that it is correctly installed and referenced in your PATH system variables by executing the following and receiving similar output:

```bash
$ node -v
v16.14.0
$ npm -v
8.3.1
```

Following installation of Node and NPM, you should be able to run the following command to install the referenced project dependencies from the root directory of the repository:

```bash
$ npm install
```

Following installation of the project dependencies, to begin working on the application, you can execute the following commands to start the AIDE Front-End.

```bash
# Compiles and hot-reloads for development
$ npm run serve

# Compiles and minifies for production
$ npm run build
```

### Customize configuration

For the AIDE Front-End to replicate a production environment, you will need to first overide the default settings by creating a .env file in the projects root directory and add/configure the following

```
VUE_APP_KEYCLOAK_REALM=aide
VUE_APP_KEYCLOAK_CLIENT_ID=aide-app
VUE_APP_KEYCLOAK_ON_LOAD=login-required
VUE_APP_AUTH_ENABLED=false
```

The AIDE Front-End relies on the <a href="https://github.com/AI4VBH/AIDE-api" target="_blank">AIDE API</a> for data and uses <a href="https://www.keycloak.org/guides" target="_blank">Keycloak</a> for authentication. Refer to the documentation for both to run each locally. To update the address for each to point to your running services, you must update the env-config.js within the public/ directory:

```
window.FRONTEND_API_HOST = "http://localhost:5000";
window.KEYCLOAK_URL = "https://localhost:8443/auth";
```

<div align="right">(<a href="#readme-top">back to top</a>)</div>

## Test

To verify any changes you make haven't affected existing functionality, you can run the unit tests and end-to-end tests, which will be required to pass for any subsequent contribution to the code base:

```bash
# Run your unit tests
$ npm run test:unit

# Lints and fixes files
$ npm run lint
```

<div align="right">(<a href="#readme-top">back to top</a>)</div>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<div align="right">(<a href="#readme-top">back to top</a>)</div>

<!-- LICENSE -->
## License

AIDE is Apache 2.0 licensed. Please review the [LICENCE](LICENCE) for details on how the code can be used.
