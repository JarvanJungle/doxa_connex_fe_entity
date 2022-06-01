/* eslint-disable max-len */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/extensions */
import React, { useState, useEffect } from "react";
import {
    Row,
    Card,
    CardBody,
    CardHeader,
    Col,
    Label,
    HorizontalInput
} from "components";
import { Checkbox } from "primereact/checkbox";
import { v4 as uuidv4 } from "uuid";
import Countries from "/public/assets/Countries.jsx";
import {
    Field, ErrorMessage
} from "formik";
import classNames from "classnames";
import TaxRecordDataService from "services/TaxRecordService";
import useToast from "routes/hooks/useToast";
import Select from "react-select";

const CompanyProfileCard = (props) => {
    const showToast = useToast();
    const {
        t,
        onCompanyProfileCBChange,
        onCountryOfOriginChange,
        onPaymentTermChange,
        onTaxCodeChange,
        onGstRegChange,
        paymentTerms,
        bankAccounts,
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        isEdit,
        isCreate,
        onBankChange,
        showValidate
    } = props;

    const [listStates, setListStates] = useState({
        taxRecords: [],
        companyUuid: null
    });
    const SingleValue = ({ data, ...props }) => {
        if (data.value === "") return <div style={{ opacity: "0.4" }}>{data.label}</div>;
        return (<div>{data.label}</div>);
    };

    const getCompanyRole = () => {
        const companyRole = JSON.parse(localStorage.getItem("companyRole"));
        setListStates((prevStates) => ({
            ...prevStates,
            companyUuid: companyRole.companyUuid
        }));
        return companyRole;
    };

    const retrieveTaxRecords = async () => {
        try {
            const companyRole = getCompanyRole();
            const response = await TaxRecordDataService.getTaxRecords(
                companyRole.companyUuid
            );
            const taxRecords = response.data.data;
            if (taxRecords.length > 0) {
                setListStates((prevStates) => ({
                    ...prevStates,
                    taxRecords
                }));
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            showToast("error", error.response.data.message);
        }
    };

    const disabled = !isEdit && !isCreate;

    useEffect(() => {
        retrieveTaxRecords();
    }, []);

    return (
        <Card className="mb-4">
            <CardHeader tag="h6">
                {`${t("CompanyProfile")}`}
            </CardHeader>
            <CardBody>
                <Col lg={12}>
                    <Row className="d-lg-flex align-items-center">
                        <Col lg={6}>
                            <Row>
                                <Col md={4} lg={4}>
                                    <Label className="p-0">{t("BusinessRole")}</Label>
                                </Col>
                                <Col md={8} lg={8}>
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <div className="p-field-checkbox">
                                                <Checkbox
                                                    name="buyer"
                                                    inputId="buyer"
                                                    checked={values.buyer}
                                                    onChange={(e) => onCompanyProfileCBChange("buyer", e.checked, values, setFieldValue)}
                                                    disabled={disabled}
                                                />
                                                <label htmlFor="buyer" className="mb-0">{t("MyBuyer")}</label>
                                            </div>
                                        </Col>
                                        <Col md={6} lg={6}>
                                            <div className="p-field-checkbox">
                                                <Checkbox
                                                    name="seller"
                                                    inputId="seller"
                                                    checked={values.seller}
                                                    onChange={(e) => onCompanyProfileCBChange("seller", e.checked, values, setFieldValue)}
                                                    disabled={disabled}
                                                />
                                                <label htmlFor="seller" className="mb-0">{t("MySupplier")}</label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6} />
                    </Row>
                    <Row className="d-lg-flex">
                        <Col lg={6}>
                            <HorizontalInput
                                name="companyCode"
                                label={t("CompanyCode")}
                                type="text"
                                placeholder={t("EnterCompanyCode")}
                                className="label-required"
                                upperCase
                                errors={errors.companyCode}
                                touched={touched.companyCode}
                                value={values.companyCode}
                                disabled={!isCreate}
                            />
                        </Col>
                        <Col lg={6}>
                            <HorizontalInput
                                name="companyName"
                                label={t("CompanyName")}
                                type="text"
                                placeholder={t("EnterCompanyName")}
                                className="label-required"
                                upperCase
                                errors={errors.companyName}
                                touched={touched.companyName}
                                value={values.companyName}
                                disabled={disabled}
                            />
                        </Col>
                    </Row>
                    <Row className="d-lg-flex">
                        <Col lg={6}>
                            <HorizontalInput
                                name="uen"
                                type="text"
                                label={t("CompanyRegNo")}
                                placeholder={t("EnterCompanyRegNo")}
                                className="label-required"
                                upperCase
                                errors={errors.uen}
                                touched={touched.uen}
                                value={values.uen}
                                disabled={disabled}
                            />
                        </Col>
                        <Col lg={6}>
                            <Row className="form-group">
                                <Col md={4} lg={4} className="label-required">
                                    <Label className="p-0">{t("CountryOfOrigin")}</Label>
                                </Col>
                                <Col md={8} lg={8}>
                                    <Select
                                        components={{ SingleValue }}
                                        options={Countries.countries
                                            .map((country) => (
                                                {
                                                    label: country.name,
                                                    value: country.name
                                                }
                                            ))}
                                        isSearchable
                                        isDisabled={disabled}
                                        value={{ value: values.countryOfOrigin, label: values.countryOfOrigin || "Please select Country" }}
                                        onChange={(e) => {
                                            onCountryOfOriginChange(e.value, values, setFieldValue);
                                        }}
                                        className={
                                            classNames("form-validate", {
                                                "is-invalid": !values.countryOfOrigin && showValidate
                                            })
                                        }
                                    />
                                    {
                                        !values.countryOfOrigin && showValidate
                                        && (<div className="invalid-feedback">{t("Please select valid Country")}</div>)
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="d-lg-flex">
                        <Col lg={6}>
                            <Row className="form-group ">
                                <Col md={4} lg={4} className="label-required">
                                    <Label className="p-0">{t("PaymentTerm")}</Label>
                                </Col>
                                <Col md={8} lg={8}>
                                    {/* <Field name="paymentTerm"> */}
                                    <Select
                                        components={{ SingleValue }}
                                        options={paymentTerms.slice().sort((a, b) => a.ptDays - b.ptDays)
                                            .map((paymentTerm) => ({
                                                label: paymentTerm.ptName,
                                                value: paymentTerm.ptUuid
                                            }))}
                                        isSearchable
                                        isDisabled={disabled}
                                        value={{ value: values.paymentTerm, label: paymentTerms.find((item) => item.ptUuid === values.paymentTerm)?.ptName || "Please select Payment Term" }}
                                        onChange={(e) => onPaymentTermChange(e.value, values, setFieldValue)}
                                        className={
                                            classNames("form-validate", {
                                                "is-invalid": !values.paymentTerm && showValidate
                                            })
                                        }
                                    />
                                    {
                                        !values.paymentTerm && showValidate
                                        && (<div className="invalid-feedback">{t("Please select valid Payment Term")}</div>)
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            {
                                (values.buyer && values.seller)
                                    || (values.buyer && !values.seller)
                                    ? (
                                        <Row className="form-group">
                                            <Col md={4} lg={4}>
                                                <Label className="p-0">{t("BankAccToReceivePay")}</Label>
                                            </Col>
                                            <Col md={8} lg={8}>
                                                <Select
                                                    components={{ SingleValue }}
                                                    options={bankAccounts.map((bankAccount) => ({
                                                        label: `${bankAccount.bankLabel} (${bankAccount.bankAccountNo})`,
                                                        value: bankAccount.uuid
                                                    }))}
                                                    isSearchable
                                                    isDisabled={disabled}
                                                    value={{
                                                        value: values.bankAccToReceivePayment,
                                                        label: values.bankAccToReceivePayment
                                                            ? `${bankAccounts.find((item) => item.uuid === values.bankAccToReceivePayment)?.bankLabel} 
                                                            (${bankAccounts.find((item) => item.uuid === values.bankAccToReceivePayment)?.bankAccountNo})`
                                                            : "Please select Bank Account"
                                                    }}
                                                    onChange={(e) => onBankChange(e.value, values, setFieldValue)}
                                                    className={
                                                        classNames("form-validate", {
                                                            "is-invalid": !values.bankAccToReceivePayment && showValidate
                                                        })
                                                    }
                                                />
                                                {
                                                    !values.bankAccToReceivePayment && showValidate
                                                    && (<div className="invalid-feedback">{t("Please select valid Bank Account")}</div>)
                                                }
                                            </Col>
                                        </Row>
                                    ) : (
                                        <></>
                                    )
                            }
                        </Col>
                    </Row>
                    {
                        // eslint-disable-next-line no-nested-ternary
                        (((values.buyer && values.seller) || !values.buyer && values.seller) && values.gstRegBusiness) ? (
                            <div>
                                <Row className="d-lg-flex">
                                    <Col lg={6}>
                                        <div className="p-field-checkbox">
                                            <Checkbox
                                                name="gstRegBusiness"
                                                inputId="taxRegisteredBusiness"
                                                checked={values.gstRegBusiness}
                                                onChange={(e) => onGstRegChange(e.checked, values, setFieldValue)}
                                                disabled={disabled}
                                            />
                                            <label htmlFor="taxRegisteredBusiness" className="mb-0">{t("TaxRegisteredBusiness")}</label>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <HorizontalInput
                                            name="gstRegNo"
                                            label={t("TaxRegNo")}
                                            type="text"
                                            className="label-required"
                                            placeholder={t("EnterTaxRegNo")}
                                            errors={errors.gstRegNo}
                                            touched={touched.gstRegNo}
                                            value={values.gstRegNo}
                                            disabled={disabled}
                                        />
                                    </Col>
                                </Row>
                                <Row className="d-lg-flex">
                                    <Col lg={6}>
                                        <Row className="form-group">
                                            <Col md={4} lg={4} className="label-required">
                                                <Label className="p-0">{t("TaxCode")}</Label>
                                            </Col>
                                            <Col md={8} lg={8}>
                                                <Select
                                                    components={{ SingleValue }}
                                                    options={listStates.taxRecords.filter((taxRecord) => taxRecord.active)
                                                        .map((tax) => (
                                                            {
                                                                label: tax.taxCode,
                                                                value: tax.uuid
                                                            }
                                                        ))}
                                                    isSearchable
                                                    isDisabled={disabled}
                                                    value={{
                                                        value: values.taxUuid,
                                                        label: values.taxUuid ? listStates.taxRecords?.find((item) => item.uuid === values.taxUuid)?.taxCode : "Please select Tax Code"
                                                    }}
                                                    onChange={(e) => {
                                                        onTaxCodeChange(e.value, values, setFieldValue, listStates.taxRecords);
                                                    }}
                                                    className={
                                                        classNames("form-validate", {
                                                            "is-invalid": !values.taxUuid && showValidate
                                                        })
                                                    }
                                                />
                                                <ErrorMessage name="taxUuid" component="div" className="invalid-feedback" />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={6}>
                                        <HorizontalInput
                                            name="taxPercentage"
                                            label={t("TaxPercentage")}
                                            type="text"
                                            placeholder={t("TaxPercentage")}
                                            className="label-required"
                                            upperCase
                                            value={values.taxPercentage}
                                            errors={errors.taxPercentage}
                                            touched={touched.taxPercentage}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )
                            : (<></>)
                    }

                    {
                        // eslint-disable-next-line no-nested-ternary
                        (((values.buyer && values.seller) || !values.buyer && values.seller) && !values.gstRegBusiness) ? (

                            <Row className="d-lg-flex">
                                <Col lg={6}>
                                    <div className="p-field-checkbox">
                                        <Checkbox
                                            name="gstRegBusiness"
                                            inputId="taxRegisteredBusiness"
                                            checked={values.gstRegBusiness}
                                            onChange={handleChange}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="taxRegisteredBusiness" className="mb-0">{t("TaxRegisteredBusiness")}</label>
                                    </div>
                                </Col>
                            </Row>
                        )
                            : (<></>)
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default CompanyProfileCard;
