import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import {
    Sidebar,
    UncontrolledButtonDropdown,
    Avatar,
    AvatarAddOn,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "components";
import UserService from "services/UserService";
import { FEATURE_ROUTE_BASED } from "helper/constantsDefined";
import { useDispatch } from "react-redux";
import { updateFeatureBased, updateCurrentCategoryMenu } from "actions/permissionActions";
import { setToLS } from "helper/utilities";
import { useAuthenticated } from "routes/hooks";

const avatarImg = "/static/nobody.jpeg";

const SidebarTopA = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [finalText, setFinalText] = useState("");
    const authReducer = useSelector((state) => state.authReducer);
    const { userDetails } = authReducer;
    const permissionReducer = useSelector((state) => state.permissionReducer);

    const [avatar, setAvatar] = useState();
    const [microFELinks, setMicroFeLinks] = useState([]);

    function featureCheck() {
        return finalText !== "" ? (
            <div onClick={() => updateFeatureBasedOn(finalText)}>
                <DropdownItem header tag={Link} to="dashboard">
                    { finalText }
                </DropdownItem>
                <DropdownItem divider />
            </div>
        ) : <></>;
    }

    useEffect(() => {
        setAvatar(userDetails?.avatarUrl);
    }, [userDetails]);

    useEffect(() => {
        if (authReducer && authReducer?.userDetails?.companies
            && permissionReducer && permissionReducer?.currentCompany?.companyUuid !== "") {
            if (permissionReducer.featureBasedOn === FEATURE_ROUTE_BASED.USER
                && permissionReducer
                    ?.userPermission[FEATURE_ROUTE_BASED.ADMIN]
                    ?.features?.length > 0) {
                setFinalText(FEATURE_ROUTE_BASED.ADMIN);
            }

            if (permissionReducer.featureBasedOn === FEATURE_ROUTE_BASED.ADMIN
                && permissionReducer
                    ?.userPermission[FEATURE_ROUTE_BASED.USER]
                    ?.features?.length > 0) {
                setFinalText(FEATURE_ROUTE_BASED.USER);
            }
        } else {
            setFinalText("");
        }
    }, [authReducer, permissionReducer]);

    useEffect(() => {
        UserService.getMicroFE().then((res) => {
            setMicroFeLinks(res.data.data);
        });
    }, []);

    function updateFeatureBasedOn(val) {
        setToLS(FEATURE_ROUTE_BASED.LS_FEATURE_BASED_ON, val);
        setToLS(FEATURE_ROUTE_BASED.CURRENT_CATEGORY, "Dashboard");
        dispatch(updateFeatureBased(val));
        dispatch(updateCurrentCategoryMenu("Dashboard"));
        history.push("/dashboard");
        window.location.reload();
    }

    const isAuthenticated = useAuthenticated();

    return (
        <>
            { /* START: Sidebar Default */ }
            <Sidebar.HideSlim>
                <Sidebar.Section className="pt-100">
                    <div className="d-flex justify-content-between align-items-start">
                        {isAuthenticated && (
                            <UncontrolledButtonDropdown className="button-group-change-module">
                                <DropdownToggle color="link" className="btn-profile sidebar__link shadow-none" style={{ color: "white" }}>
                                    <i className="fa fa-bars" />
                                </DropdownToggle>
                                <DropdownMenu persist>
                                    {
                                        microFELinks.map((link, index) => (
                                            <React.Fragment key={link.moduleCode}>
                                                <DropdownItem onClick={
                                                    () => {
                                                        window.location.href = link.host;
                                                    }
                                                }
                                                >
                                                    <i className="fa fa-fw fa-link mr-2" />
                                                    {link.moduleName}
                                                </DropdownItem>
                                                {index !== microFELinks.length - 1 && <DropdownItem divider />}
                                            </React.Fragment>

                                        ))
                                    }
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        )}
                        <Link to="/" className="d-block">
                            <Sidebar.HideSlim>
                                <Avatar.Image
                                    className="pt-3"
                                    size="lg"
                                    src={avatar || avatarImg}
                                    addOns={[
                                        <AvatarAddOn.Icon
                                            className="fa fa-circle"
                                            color="white"
                                            key="avatar-icon-bg"
                                        />,
                                        <AvatarAddOn.Icon
                                            className="fa fa-circle"
                                            color="success"
                                            key="avatar-icon-fg"
                                        />
                                    ]}
                                />
                            </Sidebar.HideSlim>
                        </Link>
                        {isAuthenticated && (
                            <UncontrolledButtonDropdown>
                                <DropdownToggle color="link" className="btn-profile sidebar__link shadow-none" style={{ color: "white" }}>
                                    {permissionReducer.featureBasedOn}
                                    {" "}
                                    PROFILE
                                    <i className="fa fa-angle-down ml-2" />
                                </DropdownToggle>
                                <DropdownMenu persist>
                                    {featureCheck()}
                                    {/* <DropdownItem tag={ Link } to="/apps/profile-details">
                                        My Profile
                                    </DropdownItem> */}
                                    <DropdownItem tag={Link} to="/me/settings">
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem tag={Link} to="/login" onClick={UserService.logout}>
                                        <i className="fa fa-fw fa-sign-out mr-2" />
                                        Sign Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        )}
                    </div>
                    <div style={{ color: "white", fontSize: "1.1em", fontWeight: 600 }} className="w-100">
                        { authReducer.userDetails?.name }
                    </div>
                    <div style={{ color: "white", fontSize: "1em" }} className="w-100">
                        { authReducer.userDetails?.designation}
                    </div>
                </Sidebar.Section>
            </Sidebar.HideSlim>
            { /* END: Sidebar Default */ }

            { /* START: Sidebar Slim */ }
            <Sidebar.ShowSlim>
                <Sidebar.Section>
                    <Avatar.Image
                        size="sm"
                        src={avatarImg}
                        addOns={[
                            <AvatarAddOn.Icon
                                className="fa fa-circle"
                                color="white"
                                key="avatar-icon-bg"
                            />,
                            <AvatarAddOn.Icon
                                className="fa fa-circle"
                                color="success"
                                key="avatar-icon-fg"
                            />
                        ]}
                    />
                </Sidebar.Section>
            </Sidebar.ShowSlim>
            { /* END: Sidebar Slim */ }
        </>
    );
};

export default SidebarTopA;
