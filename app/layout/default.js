import React from "react";
import PropTypes from "prop-types";

import {
    Layout,
    ThemeProvider
} from "../components";

import {
    RoutedNavbars,
    RoutedSidebars
} from "../routes";

import "../styles/bootstrap.scss";
import "../styles/main.scss";
import "../styles/plugins/plugins.scss";
import "../styles/plugins/plugins.css";
import appleTouchIcon from "../images/favicons/apple-touch-icon.png";

const isDevMode = process.env.REACT_APP_CURRENT_MODE;
const favImage = (isDevMode === "dev" ? require("../images/favicons/grey-png.png") : require("../images/favicons/green-png.png"));

const favIcons = [
    { rel: "icon", type: "image/x-icon", href: favImage },
    { rel: "apple-touch-icon", sizes: "180x180", href: appleTouchIcon },
    {
        rel: "icon", type: "image/png", sizes: "32x32", href: favImage
    },
    {
        rel: "icon", type: "image/png", sizes: "16x16", href: favImage
    }
];

const AppLayout = (props) => {
    const { children, crumbs } = props;

    return (
        <ThemeProvider initialStyle="light">
            <Layout sidebarSlim favIcons={favIcons}>
                { /* --------- Navbar ----------- */ }
                <Layout.Navbar>
                    <RoutedNavbars crumbs={crumbs} />
                </Layout.Navbar>
                { /* -------- Sidebar ------------*/ }
                <Layout.Sidebar>
                    <RoutedSidebars />
                </Layout.Sidebar>
                { /* -------- Content ------------*/ }
                <Layout.Content>
                    { children }
                </Layout.Content>
            </Layout>
        </ThemeProvider>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppLayout;
