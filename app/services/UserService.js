import axios from "axios";
import { Cookies } from "react-cookie";
import store from "store";
import * as actionTypes from "actions/types/authTypes";
import CONFIG from "./urlConfig";

const OAUTH_URL = process.env.OAUTH_URL || "http://localhost:8031/";
const CLIENT_ID = process.env.CLIENT_ID || "6a9b4a56-a375-4343-aa69-b78fc93bd3fe";

class UserService {
    authentication(user) {
        return axios.post(CONFIG.LOGIN_PATH, user);
    }

    getPermission(companyId, userId) {
        return axios.get(`${CONFIG.ROOT_AUTH_URL}/${companyId}/${userId}/authorities`);
    }

    getMicroFE() {
        return axios.get(`${CONFIG.ROOT_AUTH_URL}/micro-fe`);
    }

    ssoLogin() {
        const redirectUri = `${window.location.origin}/sso_redirect`;
        window.location.href = `${OAUTH_URL}authorize?redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&response_type=code&scope=openid`;
    }

    getOauth2Token(code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        return axios.post(CONFIG.SSO_GET_TOKEN, params, config);
    }

    setupPassword(payload) {
        return axios.post(CONFIG.SETUP_PASSWORD, payload);
    }

    getLocalUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    logout() {
        // const dispatch = useDispatch();
        store.dispatch({
            type: actionTypes.CHANGE_LOGOUT,
            logout: true
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mustSetPassword");
        localStorage.removeItem("company");
        localStorage.removeItem("companyRole");
        localStorage.removeItem("currentCompanyUUID");
        const cookies = new Cookies();
        cookies.remove(process.env.SHARE_COOKIES_NAME, { domain: `${process.env.SHARE_COOKIES_DOMAIN}` });
        this.ssoLogin();
    }

    signupTwoFA() {
        return axios.get(CONFIG.TWOFA_SIGNUP);
    }

    isSupperAdmin(role) {
        return role.includes("DOXA_ADMIN");
    }

    isEntityAdmin(role) {
        return role.includes("ENTITY_ADMIN");
    }

    isCompanyAdmin(role) {
        return role.includes("COMPANY_ADMIN");
    }

    verifyTwoFA(pincodes) {
        return axios.post(CONFIG.TWOFA_VERIFICATION, pincodes);
    }

    loginTwoFA(pincode) {
        return axios.post(CONFIG.TWOFA_LOGIN, pincode);
    }

    resetPassword(inputs) {
        return axios.post(CONFIG.PASSWORD_RESET, inputs);
    }

    resetOwnPassword(inputs) {
        return axios.post(CONFIG.PASSWORD_OWN_RESET, inputs);
    }

    resetTwoFA(uuid) {
        return axios.post(CONFIG.TWOFA_RESET, uuid);
    }

    resetOwnTwoFA() {
        return axios.put(CONFIG.TWOFA_OWN_RESET);
    }

    getOwnUserDetails() {
        return axios.get(CONFIG.GET_OWN_DETAILS);
    }

    getUserDetails(userId) {
        return axios.get(CONFIG.GET_USER_DETAILS + userId);
    }

    getCurrentCompanyUuid() {
        const companyRole = JSON.parse(localStorage.getItem("companyRole"));
        return companyRole?.companyUuid;
    }

    isAuthenticated() {
        const cookies = new Cookies();
        return cookies.get(process.env.SHARE_COOKIES_NAME);
    }

    isMustSetupPassword() {
        return localStorage.getItem("mustSetPassword") === "true";
    }

    getEntityUsers() {
        return axios.get(CONFIG.GET_ENTITY_USERS.replace("{companyUuid}", this.getCurrentCompanyUuid()));
    }

    getCompanyUsers(companyUuid) {
        return axios.get(CONFIG.GET_COMPANY_USERS + companyUuid);
    }

    updateUser(user) {
        return axios.put(CONFIG.UPDATE_USER, user);
    }

    deactivateUser(id) {
        return axios.put(CONFIG.DEACTIVATE_USER + id);
    }

    activateUser(uuid) {
        return axios.put(CONFIG.ACTIVATE_USER + uuid);
    }

    deactivateCompanyUser(id, companyUuid) {
        const url = CONFIG.DEACTIVATE_COMPANY_USER.replace("{companyUuid}", companyUuid);
        return axios.put(url + id);
    }

    activateCompanyUser(uuid, companyUuid) {
        const url = CONFIG.ACTIVATE_COMPANY_USER.replace("{companyUuid}", companyUuid);
        return axios.put(url + uuid);
    }

    deleteUser(id) {
        return axios.put(CONFIG.DELETE_USER + id);
    }

    createUser(user) {
        return axios.post(CONFIG.CREATE_USER, user);
    }

    getCompanies() {
        return axios.get(CONFIG.GET_ALL_COMPANIES_LIST);
    }

    getEntityAdminFromEntityUuid(entityUuid) {
        return axios.get(CONFIG.GET_ENTITY_ENTITYADMIN + entityUuid);
    }

    updateUserAvatar(user) {
        return axios.post(CONFIG.UPDATE_USER_AVATAR, user);
    }
}

export default new UserService();
