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

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Vue from "vue";

export interface ErrorMessageMap {
    get?: string;
    post?: string;
    put?: string;
    patch?: string;
    delete?: string;
}

export function isResultOk({ status }: AxiosResponse): boolean {
    return status >= 200 && status <= 299;
}

export function provideDefaultResult<T>(response: AxiosResponse<T>, defaultResult: T): T {
    return isResultOk(response) ? response.data : defaultResult;
}

export function authenticationEnabledInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    if (process.env.VUE_APP_AUTH_ENABLED === "true") {
        Vue.prototype.$keycloak?.keycloak.updateToken(70);
    }

    return config;
}

export function attachBearerTokenInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config.headers && Vue.prototype.$keycloak?.token) {
        config.headers["Authorization"] = `Bearer ${Vue.prototype.$keycloak.token}`;
    }

    return config;
}

export function onRequestErrorInterceptor(
    error: AxiosError,
    messageMap: ErrorMessageMap,
    conflictToastHidden?: boolean,
): Promise<AxiosError> {
    if (error.code === "ERR_NETWORK") {
        Vue.$toast?.error("Connection error. Please check your internet connection.");

        return Promise.reject(error);
    } else if (error.response?.status === 401) {
        Vue.$toast?.error("Unauthorised.");
        Vue.prototype.$keycloak?.logout({ redirectUri: `${window.location.origin}` });

        return Promise.reject(error);
    } else if (error.response?.status === 409 && conflictToastHidden) {
        return Promise.reject(error);
    }

    const messageKey = `${
        error.request?.method || error.config?.method
    }`.toLowerCase() as keyof ErrorMessageMap;
    const message = messageMap[messageKey] ?? "Something unexpected went wrong.";

    Vue.$toast?.error(message);

    return Promise.reject(error);
}

export function createAxiosInstance(
    errorMessages?: ErrorMessageMap,
    conflictToastHidden?: boolean,
): AxiosInstance {
    const http = axios.create({
        baseURL: window.FRONTEND_API_HOST,
        headers: {
            "Content-Type": "application/json",
        },
    });

    http.interceptors.request.use((config) => authenticationEnabledInterceptor(config));
    http.interceptors.request.use((config) => attachBearerTokenInterceptor(config));
    http.interceptors.response.use(
        (response) => response,
        (error) => onRequestErrorInterceptor(error, errorMessages ?? {}, conflictToastHidden),
    );

    return http;
}
