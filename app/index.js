import "@babel/polyfill";
import "../public/i18n";
import axios from "axios";
import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";
import { setToLS } from "helper/utilities";
import { LicenseManager } from "ag-grid-enterprise";
import UserService from "services/UserService";
import { CookiesProvider, Cookies as ReactCookies } from "react-cookie";
import store from "store";
import App from "./components/App";
import * as themes from "./theme/schema.json";
import { notification } from "./helper/utilities";
import CONFIG from "./services/urlConfig";

LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_KEY);
const cookies = new ReactCookies();
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            notification(
                "Notification",
                "Your session has ended, Please login again.",
                "error"
            ).then(() => {
                UserService.logout();
            });
        }
        throw error;
    }
);

axios.interceptors.request.use(
    (request) => {
        const freeTokenPaths = [CONFIG.SSO_GET_TOKEN];
        const token = cookies.get(process.env.SHARE_COOKIES_NAME);
        if (token && !freeTokenPaths.includes(request.url)) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);

setToLS("all-themes", themes.default);

render(
    <Provider store={store}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </Provider>,
    document.querySelector("#root")
);
