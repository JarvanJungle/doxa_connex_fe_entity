import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sidebar, SidebarTrigger } from "components";
import SidebarTopA from "routes/components/Sidebar/SidebarTopA";
import { SidebarBottomA } from "routes/components/Sidebar/SidebarBottomA";
import RouteService from "services/routes";
import { StyledContainer } from "theme/StyledComponent/StyledContainer";
import { setToLS } from "helper/utilities";
import { FEATURE_ROUTE_BASED, ROLES } from "helper/constantsDefined";
import { getUserPermission } from "actions/permissionActions";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { SidebarCompany } from "./SidebarCompany";
import SidebarMiddleNav from "./SidebarMiddleNav";

const DefaultSidebar = () => {
    const [data, setData] = useState({
        items: [], companies: []
    });

    const DOXA_COLORS = {
        PEACH: "#F8A186"
    };

    const history = useHistory();
    const dispatch = useDispatch();
    const authReducer = useSelector((state) => state.authReducer);
    const { userDetails } = authReducer;
    const permissionReducer = useSelector((state) => state.permissionReducer);
    const { currentCompany } = permissionReducer;

    const [companyLogo, setCompanyLogo] = useState();

    const getItems = () => {
        if (permissionReducer.currentCategory === "Dashboard") {
            setData((prevStates) => ({
                ...prevStates,
                items: authReducer?.userDetails?.roles?.includes(ROLES.DOXA_ADMIN)
                    ? RouteService.getRouteForDOXAAdmin()
                    : null
            }));
        } else {
            const rawRoot = permissionReducer.userPermission.ADMIN.routes[permissionReducer.currentCategory];
            const flexibleRoute = RouteService.getRoutes(rawRoot);
            setData((prevStates) => ({
                ...prevStates,
                items: flexibleRoute
            }));
        }
    };

    const getCompanies = () => {
        setData((prevStates) => ({
            ...prevStates,
            companies: authReducer.userDetails.companies
        }));
    };

    useEffect(() => {
        if (authReducer && authReducer?.userDetails?.companies?.length > 0
            && permissionReducer && permissionReducer?.currentCompany
        ) {
            getCompanies();
            getItems();
        }
    }, [authReducer, permissionReducer]);

    useEffect(() => {
        if (!_.isEmpty(currentCompany)) {
            setCompanyLogo(currentCompany.logoUrl);
        }
    }, [currentCompany]);

    const onChangeCompany = (companyUuid) => {
        setToLS(FEATURE_ROUTE_BASED.CURRENT_COMPANY, companyUuid);
        const { companies, uuid } = authReducer.userDetails;
        const currentCompanyObj = companies.find((x) => x.companyUuid === companyUuid);
        setToLS("companyRole", currentCompanyObj);
        setCompanyLogo(currentCompanyObj.logoUrl);
        dispatch(getUserPermission(currentCompanyObj, uuid));
        localStorage.setItem("companyRole", JSON.stringify(currentCompanyObj));
        history.push("/dashboard");
    };

    return (
        <Sidebar>
            { /* START SIDEBAR-OVERLAY: Close (x) */}
            <Sidebar.Close>
                <SidebarTrigger tag="a" href="#">
                    <i className="fa fa-times-circle fa-fw" />
                </SidebarTrigger>
            </Sidebar.Close>
            { /* START SIDEBAR-OVERLAY: Close (x) */}

            { /* START SIDEBAR: Only for Mobile */}
            <Sidebar.MobileFluid>
                <StyledContainer backgroundColor={DOXA_COLORS.PEACH}>
                    <SidebarTopA />
                </StyledContainer>
                <SidebarCompany
                    onChangeCompany={onChangeCompany}
                    companies={data.companies}
                    companyLogo={companyLogo}
                />
                <Sidebar.Section fluid cover>
                    { /* SIDEBAR: Menu */}
                    <SidebarMiddleNav
                        items={data.items}
                        userDetails={userDetails}
                        permissionReducer={permissionReducer}
                    />
                </Sidebar.Section>
                <SidebarBottomA />
            </Sidebar.MobileFluid>
            { /* END SIDEBAR: Only for Mobile */}
        </Sidebar>
    );
};

export default DefaultSidebar;
