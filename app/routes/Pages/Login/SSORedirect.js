import UserDataService from "services/UserService";
import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";
import {
    EmptyLayout
} from "components";

import { getUserDetails, changeLogout } from "actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { setToLS } from "helper/utilities";
import { FEATURE_ROUTE_BASED } from "helper/constantsDefined";
import { useCookies } from "react-cookie";

const SSORedirectPage = (props) => {
    const dispatch = useDispatch();
    const authReducer = useSelector((state) => state.authReducer);
    const [cookies, setCookie] = useCookies([process.env.SHARE_COOKIES_NAME]);
    useEffect(() => {
        // reset LS
        setToLS(FEATURE_ROUTE_BASED.LS_FEATURE_BASED_ON, "");
        setToLS(FEATURE_ROUTE_BASED.CURRENT_CATEGORY, "Dashboard");
        setToLS(FEATURE_ROUTE_BASED.CURRENT_COMPANY, "");

        const query = new URLSearchParams(props.location.search);
        const code = query.get("code");
        UserDataService.getOauth2Token(code).then((resp) => {
            const { access_token } = resp.data;
            localStorage.setItem("token", access_token);
            setCookie(process.env.SHARE_COOKIES_NAME, access_token, { domain: `${process.env.SHARE_COOKIES_DOMAIN}` });
            dispatch(getUserDetails());
            dispatch(changeLogout(false));
        });
    }, []);

    return (
        authReducer.redirectTo !== ""
            ? <Redirect to={authReducer.redirectTo} />
            : (
                <EmptyLayout>
                    <></>
                </EmptyLayout>
            )
    );
};

export default SSORedirectPage;
