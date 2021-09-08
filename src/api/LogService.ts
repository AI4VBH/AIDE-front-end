import Vue from "vue";
import axios from "axios";

const http = axios.create({
    baseURL: window.FRONTEND_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    Vue.$keycloak.updateToken(70);
    return config;
});

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (401 === error.response.status) {
            Vue.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });
        } else {
            return Promise.reject(error);
        }
    },
);

export async function getLogs(executionId: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/logs/${executionId}`);
    if (response.status == 404) {
        return "No Data Found";
    }

    return response.data;
}
