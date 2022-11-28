#!/bin/bash
#
# Copyright 2022 Crown Copyright
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

cat <<EOF
window.FRONTEND_API_HOST="${FRONTEND_API_HOST}"
window.ORTHANC_API_URL="${ORTHANC_API_URL}"
window.KEYCLOAK_URL="${KEYCLOAK_URL}"
window.WADO_URI_ROOT="${WADO_URI_ROOT}"
window.QIDO_ROOT="${QIDO_ROOT}"
window.WADO_ROOT="${WADO_ROOT}"
EOF
