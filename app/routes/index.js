import React from "react";
import {
    Route,
    Switch,
    Redirect
} from "react-router";
import { v4 as uuidv4 } from "uuid";

// ----------- Pages Imports ---------------

import ProtectedRoute from "./ProtectedRoute";

// ----------- Layout Imports ---------------
import DefaultSidebar from "../layout/components/DefaultSidebar";
import SidebarWithNavbarNavbar from "../layout/components/SidebarWithNavbarNavbar";

import routes from "./routes";
import SSORedirectPage from "./Pages/Login/SSORedirect";

// ------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = ({ setCrumbs }) => (
    <Switch>
        <Redirect from="/" to="/dashboard" exact />
        {
            routes.map(({ path, isProtected, Component }) => {
                if (isProtected === true) {
                    return (
                        <ProtectedRoute
                            exact
                            path={path}
                            component={Component}
                            key={uuidv4()}
                            setCrumbs={setCrumbs}
                        />
                    );
                }
                return (
                    <Route
                        exact
                        path={path}
                        key={uuidv4()}
                        render={(props) => {
                            const crumbs = routes
                            // Get all routes that contain the current one.
                                .filter(({ path }) => props.match.path.includes(path))
                            // Swap out any dynamic routes with their param values.
                            // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                                .map(({ path, ...rest }) => ({
                                    path: Object.keys(props.match.params).length
                                        ? Object.keys(props.match.params).reduce(
                                            (path, param) => path.replace(
                                                `:${param}`, props.match.params[param]
                                            ), path
                                        )
                                        : path,
                                    ...rest
                                }));
                            setCrumbs(crumbs);
                            return (
                                <Component {...props} />
                            );
                        }}
                    />
                );
            })
        }
        <Route path="/sso_redirect" render={(props) => <SSORedirectPage {...props} />} />
    </Switch>
);

// ------ Custom Layout Parts --------
export const RoutedNavbars = (props) => {
    const { crumbs } = props;
    return (
        <Switch>
            <Route
                render={() => <SidebarWithNavbarNavbar crumbs={crumbs} />}
            />
        </Switch>
    );
};

export const RoutedSidebars = () => (
    <Switch>
        <Route component={DefaultSidebar} />
    </Switch>
);
