import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import UserService from "../../services/UserService";
import {
    NavItem,
    NavLink
} from "../../components";

export const NavbarUser = (props) => {
    const logout = () => {
        UserService.logout();
    };
    return (
        <NavItem {...props}>
            <NavLink tag={Link} to="/login" onClick={logout}>
                <i className="fa fa-power-off" />
            </NavLink>
        </NavItem>
    );
};
NavbarUser.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

export default {
    NavbarUser
};
