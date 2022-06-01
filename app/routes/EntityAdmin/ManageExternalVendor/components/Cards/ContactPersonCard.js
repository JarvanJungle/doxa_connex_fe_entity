/* eslint-disable import/extensions */
/* eslint-disable import/no-absolute-path */
import React from "react";
import {
    Row,
    Card,
    CardBody,
    CardHeader,
    Col,
    Label
} from "components";
import {
    Field, ErrorMessage
} from "formik";
import DialCodes from "/public/assets/DialCodes.js";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import Select from "react-select";
import HorizontalInput from "../HorizontalInput";

const SingleValue = ({ data, ...props }) => {
    if (data.value === "") return <div style={{ opacity: "0.4" }}>{data.label}</div>;
    return (<div>{data.label}</div>);
};
const ContactPersonCard = (props) => {
    const {
        t,
        values,
        errors,
        touched,
        isEdit,
        isCreate,
        setFieldValue,
        showValidate
    } = props;

    const disabled = !isEdit && !isCreate;

    const handleChangeCountryCode = (event) => {
        setFieldValue("countryCode", event.value);
    };

    return (
        <Card className="mb-4">
            <CardHeader tag="h6">
                {t("MainContactPerson")}
            </CardHeader>
            <CardBody>
                <Col lg={12}>
                    <Row>
                        <Col lg={6}>
                            <HorizontalInput
                                name="fullName"
                                label={t("FullName")}
                                type="text"
                                placeholder={t("EnterFullName")}
                                className="label-required"
                                errors={errors.fullName}
                                touched={touched.fullName}
                                disabled={disabled}
                            />
                        </Col>
                        <Col lg={6}>
                            <Row>
                                <Col md={4} lg={4} className="label-required">
                                    <Label className="p-0">{t("ContactNumber")}</Label>
                                </Col>
                                <Col md={8} lg={8}>
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <Select
                                                isDisabled={disabled}
                                                components={{ SingleValue }}
                                                options={DialCodes.dialCodes
                                                    .map((dialCode) => (
                                                        {
                                                            label: values.countryCode && values.countryCode === dialCode.value ? +dialCode.value : `${dialCode.label} (${dialCode.value})`,
                                                            value: dialCode.value
                                                        }))}
                                                isSearchable
                                                value={{ value: values.countryCode, label: values.countryCode || "Dial Code" }}
                                                onChange={handleChangeCountryCode}
                                                className={
                                                    classNames("form-validate", {
                                                        "is-invalid": !values.countryCode && showValidate
                                                    })
                                                }
                                            />
                                            <ErrorMessage name="countryCode" component="div" className="invalid-feedback" />
                                        </Col>
                                        <Col md={6} lg={6} className="pl-2">
                                            <Field
                                                type="text"
                                                name="workNumber"
                                                placeholder={t("EnterPhoneNumber")}
                                                className={classNames("form-control", {
                                                    "is-invalid": touched.workNumber
                                                        && errors.workNumber
                                                })}
                                                disabled={disabled}
                                            />
                                            <ErrorMessage name="workNumber" component="div" className="invalid-feedback" />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <HorizontalInput
                                name="emailAddress"
                                label={t("Email")}
                                type="text"
                                placeholder={t("EnterEmail")}
                                className="label-required"
                                errors={errors.emailAddress}
                                touched={touched.emailAddress}
                                disabled={disabled}
                            />
                        </Col>
                        <Col lg={6} />
                    </Row>
                </Col>
            </CardBody>
        </Card>
    );
};

export default ContactPersonCard;
