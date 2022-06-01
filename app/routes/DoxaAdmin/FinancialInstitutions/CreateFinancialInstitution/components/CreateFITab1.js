import React, { useState, useContext } from "react";

import { AvForm, AvField } from "availity-reactstrap-validation";
import { AgGridReact } from "components/agGrid";
import {
  Row,
  CustomInput,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Col,
  Label,
  Input,
} from "components";
import classes from "../CreateFinancialInstitution.scss";
import CreateFIContext from "../context/CreateFIContext";
import DialCodes from "/public/assets/DialCodes";
import {v4 as uuidv4} from "uuid";

function CreateFITab1() {
  const { CreateFITab1State, t } = useContext(CreateFIContext);
  const columnDefs = [
    {
      headerName: t("Payment and Financing"),
      field: "financingType",
    },
    {
      headerName: t("Active"),
      // field: "active",
      checkboxSelection: true,
    },
  ];

  return (
    <Card className={`${classes["tabCard"]}`}>
      <Card className="m-3">
        <CardHeader tag="h6">{t("FinancialInstitution")}</CardHeader>
        <CardBody className={`${classes["mbMinus2"]}`}>
          <Row className={`${classes["rowClass"]}`}>
            <Col>
              <Row className={`label-required`}>
                <Label
                  for="FICode"
                  className={`${classes["paddingCenter"]} ${classes["fiCode"]} mr-5 ml-1`}
                >
                  {t("FICode")}
                </Label>
                <FormGroup>
                  <AvField
                    type="text"
                    name="FICode"
                    placeholder={t("EnterFICode")}
                    value={CreateFITab1State.Tab1Values?.FICode}
                    className={`${classes["inputClassNew"]}`}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: t("EnterFICode"),
                      },
                      minLength: {
                        value: 2,
                        errorMessage: t("FICodeValidation"),
                      },
                      maxLength: {
                        value: 250,
                        errorMessage: t("FICodeValidation"),
                      },
                    }}
                    required
                    onChange={(e) => {
                        CreateFITab1State.setFormValues(e);
                        CreateFITab1State.checkFormValid();
                    }}
                  />
                </FormGroup>
              </Row>
            </Col>
            <Col>
              <Row className={`label-required`}>
                <Label
                  for="FIName"
                  className={`${classes["paddingCenter"]} ${classes["fiName"]} mr-4`}
                >
                  {t("FIName")}
                </Label>
                <FormGroup>
                  <AvField
                    type="text"
                    name="FIName"
                    className={`${classes["inputClassNew"]}`}
                    placeholder={t("EnterFIName")}
                    value={CreateFITab1State.Tab1Values?.FIName}
                    onChange={(e) => {
                        CreateFITab1State.setFormValues(e);
                        CreateFITab1State.checkFormValid();
                    }}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: t("EnterFIName"),
                      },
                      minLength: {
                        value: 2,
                        errorMessage: t("FINameValidation"),
                      },
                      maxLength: {
                        value: 50,
                        errorMessage: t("FINameValidation"),
                      },
                    }}
                    required
                  />
                </FormGroup>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="m-3">
        <CardHeader tag="h6">{t("ContactInformation")}</CardHeader>
        <CardBody className={`${classes["mbMinus2"]}`}>
          <Row className={`${classes["rowClass"]}`}>
            <Col>
              <Row className={`label-required`}>
                <Label
                  for="userName"
                  className={`${classes["paddingCenter"]} mr-5 ml-1`}
                >
                  {t("UserName")}
                </Label>
                <FormGroup>
                  <AvField
                    type="text"
                    name="userName"
                    className={`${classes["inputClassNew"]}`}
                    placeholder={t("EnterUserName")}
                    value={CreateFITab1State.Tab1Values?.userName}
                    onChange={(e) => {
                        CreateFITab1State.setFormValues(e);
                        CreateFITab1State.checkFormValid();
                    }}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: t("EnterUserName"),
                      },
                      minLength: {
                        value: 2,
                        errorMessage: t("EntityRepNameValidation"),
                      },
                      maxLength: {
                        value: 250,
                        errorMessage: t("EntityRepNameValidation"),
                      },
                    }}
                    required
                  />
                </FormGroup>
              </Row>
              <Row className="label-required">
                <FormGroup>
                  <Row>
                    <Col lg={3} md={3} sm={3} className="pr-0 ml-2.5">
                      <label
                        htmlFor="workNumber"
                        className={`${classes["paddingCenter"]} mr-4 ml-1`}
                      >
                        {t("Phone")}
                      </label>
                    </Col>
                    <Col lg={3} md={3} sm={3} className={`${classes["dialCode"]} pr-0`}>
                      <AvField
                        type="select"
                        name="entityRepDialog"
                        value={CreateFITab1State.Tab1Values?.entityRepDialog}
                        className={`${classes["paddingCenterWidth"]}`}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: t("DialCodeRequired"),
                          },
                        }}
                        onChange={(e) => {
                            CreateFITab1State.setFormValues(e);
                            CreateFITab1State.checkFormValid();
                        }}
                      >
                        <option value="" hidden defaultValue>
                          {t("DialCode")}
                        </option>
                        {DialCodes.dialCodes.map((code) => (
                                  <option
                                    key={uuidv4()}
                                    value={code.value}
                                    data-subtext={code.label}
                                  >
                                      {code.label} (+{code.value})
                                  </option>
                                ))}
                      </AvField>
                    </Col>
                    <Col lg={5} md={5} sm={5}>
                      <FormGroup className="label-required">
                        <AvField
                          type="text"
                          name="entityRepPhone"
                          placeholder={t("EnterEntityRepPhone")}
                          value={CreateFITab1State.Tab1Values?.entityRepPhone}
                          className={`${classes["paddingCenterInputWidth"]}`}
                          onChange={(e) => {
                            CreateFITab1State.setFormValues(e);
                            CreateFITab1State.checkFormValid();
                        }}
                          validate={{
                            number: {
                              value: true,
                              errorMessage: t("EntityRepPhoneValidValidation"),
                            },
                            required: {
                              value: true,
                              errorMessage: t("EntityRepPhoneValidValidation"),
                            },
                            minLength: {
                              value: 8,
                              errorMessage: t("EntityRepPhoneLengthValidation"),
                            },
                            maxLength: {
                              value: 30,
                              errorMessage: t("EntityRepPhoneLengthValidation"),
                            },
                          }}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </FormGroup>
              </Row>
            </Col>
            <Col>
              <Row className={`label-required`}>
                <Label
                  for="email"
                  className={`${classes["paddingCenter"]} ${classes["email"]} mr-5`}
                >
                  {t("Email")}
                </Label>
                <FormGroup>
                  <AvField
                    type="email"
                    name="email"
                    className={`${classes["inputClassNew"]}`}
                    placeholder={t("EnterFIEntityEmail")}
                    value={CreateFITab1State.Tab1Values?.email}
                    onChange={(e) => {
                        CreateFITab1State.setFormValues(e);
                        CreateFITab1State.checkFormValid();
                    }}
                    validate={{
                      email: {
                        value: true,
                        errorMessage: t("EnterFIEntityEmailValidValidation"),
                      },
                      required: {
                        value: true,
                        errorMessage: t("EnterFIEntityEmailValidValidation"),
                      },
                      minLength: {
                        value: 2,
                        errorMessage: t("EnterFIEntityEmailLengthValidation"),
                      },
                      maxLength: {
                        value: 250,
                        errorMessage: t("EnterFIEntityEmailLengthValidation"),
                      },
                    }}
                    required
                  />
                </FormGroup>
              </Row>
              <Row className={`label`}>
                <Label
                  for="designation"
                  className={`${classes["paddingCenter"]} mr-4`}
                >
                  {t("Designation")}
                </Label>
                <FormGroup className="label-required">
                  <AvField
                    type="text"
                    name="designation"
                    value={CreateFITab1State.Tab1Values?.designation}
                    onChange={(e) => CreateFITab1State.setFormValues(e)}
                    className={`${classes["inputClassNew"]}`}
                    placeholder={t("Enter Designation")}
                  />
                </FormGroup>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="m-3">
        <CardHeader tag="h6">{t("FI Portal")}</CardHeader>

        <Col lg={12}>
          <CardBody className={`${classes["cardBody"]} mb-3`}>
            <Row>
              <Col md={10} lg={10}>
                <Label for="financingRequestType">
                  {t("Do you want to activate FI Portal for this FI ?")}
                </Label>
              </Col>
              <Col md={2} lg={2}>
                <FormGroup>
                  <div className="radioButtons">
                    <CustomInput
                      type="radio"
                      id="yesRule"
                      name="fiPortal"
                      value="yes"
                      inline
                      onChange={(e) => CreateFITab1State.setFormValues(e)}
                      className={classes["custom-control"]}
                      label="Yes"
                    ></CustomInput>
                    <CustomInput
                      type="radio"
                      className={classes["custom-control"]}
                      id="noRule"
                      name="fiPortal"
                      value="no"
                      inline
                      label="No"
                      onChange={(e) => CreateFITab1State.setFormValues(e)}
                      defaultChecked
                    ></CustomInput>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Col>
      </Card>
      <Card className="m-3">
        <CardHeader tag="h6">{t("Remarks")}</CardHeader>
        <CardBody className={`${classes["cardBody"]} mb-3`}>
          <Input
            type="textarea"
            name="remark"
            placeholder={t("Enter remarks")}
            onChange={(e) => CreateFITab1State.setFormValues(e)}
            value={CreateFITab1State.Tab1Values?.remark}
          />
        </CardBody>
      </Card>
      <Card className="m-3">
        <CardHeader tag="h6">{t("Module Subscription")}</CardHeader>
        <CardBody className={`${classes["cardBody"]} ${classes["agGridCard"]}`}>
          <div
            className="ag-theme-custom-react"
            style={{ height: "131px", width: "100%" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              defaultColDef={CreateFITab1State.defaultColDef}
              rowData={CreateFITab1State.rowData}
              rowSelection = "multiple"
              onSelectionChanged={(params) =>
                CreateFITab1State.handleCheckboxSelection(params)
              }
              onGridReady={(params) => CreateFITab1State.onGridReady(params)}
            />
          </div>
        </CardBody>
      </Card>
    </Card>
  );
}

export default React.memo(CreateFITab1);
