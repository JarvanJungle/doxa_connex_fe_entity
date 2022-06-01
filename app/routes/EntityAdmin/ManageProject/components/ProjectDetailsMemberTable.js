import React, { useEffect, useState } from "react";
import {
    Table,
    CardBody,
    Card,
    CardHeader
} from "components";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Field, ErrorMessage } from "formik";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
// import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Select from "react-select";
import InputRemarks from "./InputRemarks";

const useStyles = makeStyles({
    form: {
        maxWidth: 300,
        minWidth: "100%"
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const ProjectDetailsMemberTable = (props) => {
    const theme = useTheme();
    const classes = useStyles();
    const {
        t, values, errors, touched, users, isDetail, isEdit, setFieldValue, showValidate
    } = props;

    const getNameUser = (uuid) => users.find((user) => user.userUuid === uuid)?.userName;
    const getNamesProjectMember = () => {
        const namesProjectMember = values.projectTeamMember.map((user) => user.userName);
        return namesProjectMember.join(", ");
    };
    const [personName, setPersonName] = useState([]);
    const [userList, setUserList] = useState([]);

    const checkDuplicate = (list, item) => {
        let isDuplicate = false;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.userName === item.userName && element.userUuid === item.userUuid) {
                isDuplicate = true;
                break;
            }
        }
        return isDuplicate;
    };
    const handleChange = (event) => {
        const listUser = [];
        users.forEach((item) => {
            event.forEach((value) => {
                if (item.userUuid === value.value) {
                    listUser.push(item);
                }
            });
        });
        setFieldValue("projectTeamMember", listUser);
    };
    const handleChangeInCharge = (event) => {
        setFieldValue("projectInCharge", event.value);
    };
    const handleChangeAdmin = (event) => {
        setFieldValue("projectAdmin", event.value);
    };
    const getStyles = (name, person, themes) => ({
        fontWeight:
            person.indexOf(name) === -1
                ? themes.typography.fontWeightRegular
                : themes.typography.fontWeightMedium
    });
    useEffect(() => {
        setPersonName(values.projectTeamMember.map((item) => item.userName));
    }, [values.projectTeamMember]);
    const SingleValue = ({ data, ...props }) => {
        if (data.value === "") return <div style={{ opacity: "0.4" }}>{data.label}</div>;
        return (<div>{data.label}</div>);
    };
    return (
        <Card>
            <CardHeader tag="h6">
                {t("ProjectMembers")}
            </CardHeader>
            <CardBody>
                <Table className="mb-0" bordered responsive>
                    <thead>
                        <tr>
                            <td style={{ width: "25%" }} className="align-middle">{t("ProjectForecastRole")}</td>
                            <td style={{ width: "25%" }} className="align-middle">{t("ProjectForecastSelectUser")}</td>
                            <td style={{ width: "25%" }} className="align-middle">{t("ProjectForecastSelectedUsers")}</td>
                            <td style={{ width: "25%" }} className="align-middle">{t("ProjectForecastRemarks")}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-middle label-required">
                                <span className="text-inverse">
                                    {t("ProjectForecastOverallInCharge")}
                                </span>
                            </td>
                            <td className="align-middle">
                                <Select
                                    menuPlacement="top"
                                    isDisabled={isDetail && !isEdit}
                                    components={{ SingleValue }}
                                    options={users.map((user) => ({
                                        label: user.userName,
                                        value: user.userUuid
                                    }))}
                                    isSearchable
                                    onChange={handleChangeInCharge}
                                    value={{
                                        value: values.projectInCharge,
                                        label: getNameUser(values.projectInCharge) || "Please select user"
                                    }}
                                    className={
                                        classNames("form-validate", {
                                            "is-invalid": !values.projectInCharge && showValidate
                                        })
                                    }
                                />
                                <ErrorMessage name="projectInCharge" component="div" className="invalid-feedback" />
                            </td>
                            <td className="align-middle" style={{ color: "#5D636D" }}>
                                {getNameUser(values.projectInCharge)}
                            </td>
                            <td className="align-middle">
                                <InputRemarks
                                    name="projectInChargeRemarks"
                                    component="textarea"
                                    placeholder={t("EnterRemarks")}
                                    errors={errors.projectInChargeRemarks}
                                    touched={touched.projectInChargeRemarks}
                                    disabled={isDetail && !isEdit}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td className="align-middle label-required">
                                <span className="text-inverse">
                                    {t("ProjectForecastProjectAdmin")}
                                </span>
                            </td>
                            <td className="align-middle">
                                <Select
                                    menuPlacement="top"
                                    isDisabled={isDetail && !isEdit}
                                    components={{ SingleValue }}
                                    options={users
                                        .sort((a, b) => a?.userName?.localeCompare(b?.userName))
                                        .map((user) => ({
                                            label: user.userName,
                                            value: user.userUuid
                                        }))}
                                    onChange={handleChangeAdmin}
                                    isSearchable
                                    value={{
                                        value: values.projectAdmin,
                                        label: getNameUser(values.projectAdmin) || "Please select user"
                                    }}
                                    className={
                                        classNames("form-validate", {
                                            "is-invalid": !values.projectAdmin && showValidate
                                        })
                                    }
                                />
                                <ErrorMessage name="projectAdmin" component="div" className="invalid-feedback" />
                            </td>
                            <td className="align-middle" style={{ color: "#5D636D" }}>
                                {getNameUser(values.projectAdmin)}
                            </td>
                            <td className="align-middle">
                                <InputRemarks
                                    name="projectAdminRemarks"
                                    component="textarea"
                                    placeholder={t("EnterRemarks")}
                                    errors={errors.projectAdminRemarks}
                                    touched={touched.projectAdminRemarks}
                                    disabled={isDetail && !isEdit}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td className="align-middle">
                                <span className="text-inverse">
                                    {t("ProjectForecastTeamMembers")}
                                </span>
                            </td>
                            <td className="align-middle">
                                <Select
                                    menuPlacement="top"
                                    isDisabled={isDetail && !isEdit}
                                    components={{ SingleValue }}
                                    options={users
                                        .sort((a, b) => a?.userName?.localeCompare(b?.userName))
                                        .map((user) => ({
                                            label: user.userName,
                                            value: user.userUuid
                                        }))}
                                    isSearchable
                                    isMulti
                                    value={values.projectTeamMember.map((item) => ({
                                        label: item.userName,
                                        value: item.userUuid
                                    }))}
                                    onChange={handleChange}
                                />
                            </td>
                            <td className="align-middle" style={{ color: "#5D636D" }}>
                                {getNamesProjectMember()}
                            </td>
                            <td className="align-middle">
                                <InputRemarks
                                    name="projectTeamMemberRemarks"
                                    component="textarea"
                                    placeholder={t("EnterRemarks")}
                                    errors={errors.projectTeamMemberRemarks}
                                    touched={touched.projectTeamMemberRemarks}
                                    disabled={isDetail && !isEdit}
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default ProjectDetailsMemberTable;
