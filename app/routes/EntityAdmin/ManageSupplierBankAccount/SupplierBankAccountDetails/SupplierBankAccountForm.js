import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Countries from "/public/assets/Countries.jsx";
import Currencies from "/public/assets/Currencies.jsx";
import { AvField } from "availity-reactstrap-validation";
import {
    Row, Card, CardBody, CardHeader, Col, FormGroup, Label, CustomInput
} from "components";
import Select from "react-select";
import classNames from "classnames";
import { PAGE_STAGE } from "../helper";
import { isValidSwift } from "helper/utilities";

export default function SupplierBankAccountForm(props) {
    const { t } = useTranslation();

    const {
        pageState,
        formData,
        onChange,
        listBank,
        handleChangeCountry,
        listSupplier,
        handleChangeSupplier,
        handleChangeActive,
        handleChangeCurrency,
        handleChangeBank,
        isUpdate,
        showValidate
    } = props;
    let isFormDisable = pageState !== PAGE_STAGE.CREATE;

    if (isUpdate) {
        isFormDisable = false;
    }
    let [initData, setInitData] = useState({
        companyLabel: "Please select company code",
        countryLabel: "Please select country",
        bankLabel: "Please select bank",
        currencyLabel: "Please select currency"
    })
    useEffect(() => {
        let currency = Currencies.currencies.filter(e => e.code === formData.currency)
        let currencyName = ""
        if (currency !== undefined && currency.length > 0)
            currencyName = currency[0].name
        setInitData((prevStates) => ({
            ...prevStates,
            companyLabel: formData.companyName + ' (' + formData.companyCode + ')',
            countryLabel: formData.country,
            bankLabel: formData.bankName,
            currencyLabel: currencyName + ' (' + formData.currency + ')',
        }))
    }, [formData]);
    const SingleValue = ({ data, ...props }) => {
        if (data.value === "") return <div style={{ opacity: "0.4" }}>{data.label}</div>;
        return (<div>{data.label}</div>);
    };
    return (
        <Row>
            <Col xs={6}>
                <Card className="mb-4">
                    <CardHeader tag="h6">
                        {t("Supplier Information")}
                    </CardHeader>
                    <CardBody>
                        <FormGroup>
                            <Row>
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Company Code")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            {
                                                !isFormDisable
                                                    ? (
                                                        <div className="form-group">
                                                            <Select
                                                                components={{ SingleValue }}
                                                                options={listSupplier.map((supplier) => (
                                                                    {
                                                                        label: `${supplier.companyName} (${supplier.companyCode})`,
                                                                        value: supplier.companyCode
                                                                    }
                                                                ))}
                                                                isSearchable
                                                                value={{
                                                                    value: formData.companyCode || "",
                                                                    label: formData.companyCode ? initData.companyLabel : "Select Company"
                                                                }}
                                                                onChange={handleChangeSupplier}
                                                                className={
                                                                    classNames("form-validate", {
                                                                        "is-invalid": !formData.companyCode && showValidate
                                                                    })
                                                                }
                                                            />
                                                            {
                                                                !formData.companyCode && showValidate
                                                                && (<div className="invalid-feedback">{t("Please select valid Company")}</div>)
                                                            }
                                                        </div>
                                                    ) : (
                                                        <AvField
                                                            type="text"
                                                            name="companyCode"
                                                            placeholder={t("Enter Company Name")}
                                                            value={formData.companyCode}
                                                            onBlur={() => { }}
                                                            onChange={onChange}
                                                            disabled
                                                        />
                                                    )
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Company Name")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="companyName"
                                                placeholder={t("Enter Company Name")}
                                                value={formData.companyName}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Company Reg. No.")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="companyRegNo"
                                                placeholder={t("Enter Company Reg. No.")}
                                                value={formData.companyRegNo}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Country of Origin")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="countryOfOrigin"
                                                placeholder={t("Enter Bank Country Of Origin")}
                                                value={formData.countryOfOrigin}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Payment Terms")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="paymentTerms"
                                                placeholder={t("Enter Payment Terms")}
                                                value={formData.paymentTerms}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </FormGroup>
                    </CardBody>
                </Card>
            </Col>
            <Col xs={12}>
                <Card className="mb-4">
                    <CardHeader tag="h6">
                        {t("Bank Account Information")}
                    </CardHeader>
                    <CardBody>
                        <FormGroup>
                            <Row>
                                <Col xs={6}>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Bank Label")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="bankLabel"
                                                placeholder={t("Enter Bank Label")}
                                                validate={{
                                                    required: { value: true, errorMessage: t("EnterValidBankLabel") }
                                                }}
                                                value={formData.bankLabel}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Country")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            {
                                                !isFormDisable
                                                    ? (
                                                        <div className="form-group">
                                                            <Select
                                                                components={{ SingleValue }}
                                                                options={
                                                                    Countries.countries.map(
                                                                        (country) => (
                                                                            {
                                                                                label: country.name,
                                                                                value: country.name
                                                                            }
                                                                        )
                                                                    )
                                                                }
                                                                isSearchable
                                                                onChange={handleChangeCountry}
                                                                value={{
                                                                    value: formData.country || "",
                                                                    label: formData.country ? initData.countryLabel : "Select Country"
                                                                }}
                                                                className={
                                                                    classNames("form-validate", {
                                                                        "is-invalid": !formData.country && showValidate
                                                                    })
                                                                }
                                                            />
                                                            {
                                                                !formData.country && showValidate
                                                                && (<div className="invalid-feedback">{t("Please select valid Country")}</div>)
                                                            }
                                                        </div>
                                                    ) : (
                                                        <AvField
                                                            type="text"
                                                            name="country"
                                                            placeholder={t("Enter Country")}
                                                            value={formData.country}
                                                            onBlur={() => { }}
                                                            onChange={onChange}
                                                            disabled
                                                        />
                                                    )
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Bank Name")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            {
                                                !isFormDisable
                                                    ? (
                                                        <div className="form-group">
                                                            <Select
                                                                components={{ SingleValue }}
                                                                options={
                                                                    listBank.map((bank) => (
                                                                        {
                                                                            label: bank.name,
                                                                            value: bank.name
                                                                        }
                                                                    ))
                                                                }
                                                                isSearchable
                                                                defaultValue={{
                                                                    value: formData.bankName || "",
                                                                    label: formData.bankName ? initData.bankLabel : "Select Bank Name"
                                                                }}
                                                                onChange={handleChangeBank}
                                                                className={
                                                                    classNames("form-validate", {
                                                                        "is-invalid": !formData.bankName && showValidate
                                                                    })
                                                                }
                                                            />
                                                            {
                                                                !formData.bankName && showValidate
                                                                && (<div className="invalid-feedback">{t("Please select valid Bank Name")}</div>)
                                                            }
                                                        </div>
                                                    ) : (
                                                        <AvField
                                                            type="text"
                                                            name="bankName"
                                                            placeholder={t("Enter Bank Name")}
                                                            value={formData.bankName}
                                                            onBlur={() => { }}
                                                            onChange={onChange}
                                                            disabled
                                                        />
                                                    )
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Bank Account No.")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="number"
                                                name="bankAccountNo"
                                                placeholder={t("Enter Bank Account No")}
                                                validate={{
                                                    required: { value: true, errorMessage: t("EnterValidBankAccountNo") },
                                                    maxLength: { value: 16, errorMessage: "Bank Account No. must be less than 18 characters" }
                                                }}
                                                value={formData.bankAccountNo}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Account Holder Name")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="accountHolderName"
                                                placeholder={t("Enter Full Name")}
                                                validate={{
                                                    required: { value: true, errorMessage: t("EnterValidAccountHolderName") }
                                                }}
                                                value={formData.accountHolderName}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Currency")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            {
                                                !isFormDisable
                                                    ? (
                                                        <div className="form-group">
                                                            <Select
                                                                components={{ SingleValue }}
                                                                options={
                                                                    Currencies.currencies.map((currency) => (
                                                                        {
                                                                            label: `${currency.name} (${currency.code})`,
                                                                            value: currency.code
                                                                        }
                                                                    ))
                                                                }
                                                                isSearchable
                                                                value={{
                                                                    value: formData.currency || "",
                                                                    label: formData.currency ? initData.currencyLabel : "Select Currency"
                                                                }}
                                                                onChange={handleChangeCurrency}
                                                                className={
                                                                    classNames("form-validate", {
                                                                        "is-invalid": !formData.currency && showValidate
                                                                    })
                                                                }
                                                            />
                                                            {
                                                                !formData.currency && showValidate
                                                                && (<div className="invalid-feedback">{t("Please select valid currency")}</div>)
                                                            }
                                                        </div>
                                                    ) : (
                                                        <AvField
                                                            type="text"
                                                            name="currency"
                                                            placeholder={t("Enter currency")}
                                                            value={formData.currency}
                                                            onBlur={() => { }}
                                                            onChange={onChange}
                                                            disabled
                                                        />
                                                    )
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Swift Code")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="swiftCode"
                                                value={formData.swiftCode}
                                                placeholder={t("Enter Swift Code")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                                validate={{
                                                    required: { value: true, errorMessage: t("PleaseEnterValidSwiftCode") },
                                                    isValidSwift
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} />
                                        <Col xs={6}>
                                            <FormGroup>
                                                <CustomInput
                                                    type="checkbox"
                                                    name="defaultAccountBeforeApproval"
                                                    value={formData.defaultAccountBeforeApproval}
                                                    checked={formData.defaultAccountBeforeApproval}
                                                    id="checkboxesStackedCustom1"
                                                    label="Default bank account"
                                                    onChange={handleChangeActive}
                                                    disabled={isFormDisable}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row>
                                        <Col xs={6} className="label-required">
                                            <Label>{t("Branch")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="branch"
                                                value={formData.branch}
                                                placeholder={t("Enter Branch")}
                                                validate={{
                                                    required: { value: true, errorMessage: t("EnterValidBranch") }
                                                }}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Branch Code")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="branchCode"
                                                value={formData.branchCode}
                                                placeholder={t("Enter Unique Branch Code")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Branch City")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="branchCity"
                                                value={formData.branchCity}
                                                placeholder={t("Enter Branch City")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Branch Address Line 1")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="branchAddressLine1"
                                                value={formData.branchAddressLine1}
                                                placeholder={t("Enter Address Line 1")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Branch Address Line 2")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="branchAddressLine2"
                                                value={formData.branchAddressLine2}
                                                placeholder={t("Enter Address Line 2")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("Postal Code")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                placeholder={t("Enter Postal Code")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>{t("State/ Province")}</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <AvField
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                placeholder={t("Enter State/Province")}
                                                onBlur={() => { }}
                                                onChange={onChange}
                                                disabled={isFormDisable}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </FormGroup>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}
