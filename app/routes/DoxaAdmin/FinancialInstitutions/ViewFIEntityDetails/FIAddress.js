import React from "react";
import { withTranslation } from "react-i18next";
import {
    Row,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Col, Label
} from 'components';
import classes from './ViewFIEntityDetails.scss';
import { AvField } from 'availity-reactstrap-validation';

function FIAddress(props) {
    const { t, isEdit, countryList, addressLine1, addressLine2, changeAddressHandler, changeCountryHandler, country, changePostalCodeHandler, postalCode } = props;
  return (
    <Card className="mt-3">
      <CardHeader tag="h6">{t("FinancialInstitutionAddress")}</CardHeader>
      <CardBody className={`${classes["mbMinus2"]}`}>
        <Row className={`${classes["rowClass"]}`}>
          <Col>
            <Row className={`label-required`}>
              <Label
                for="addressLine1"
                className={`${classes["paddingCenter"]} ${classes["addressLine"]} mr-5 ml-1`}
              >
                {t("AddressLine1")}
              </Label>
              <FormGroup>
                <AvField
                  type="text"
                  name="addressLine1"
                  className={`${classes["inputClassNew"]}`}
                  placeholder={t("EnteraddressLine1")}
                  value={addressLine1}
                  onChange={changeAddressHandler}
                  validate={{
                    required: { value: true, errorMessage: t("EnteraddressLine1") },
                    minLength: {
                        value: 2,
                        errorMessage: t("AddressLine1Validation"),
                    },
                    maxLength: {
                      value: 250,
                      errorMessage: t("AddressLine1Validation"),
                    },
                  }}
                  required
                  disabled={!isEdit}
                />
              </FormGroup>
            </Row>
            <Row className={`label-required`}>
              <Label
                for="addressLine2"
                className={`${classes["paddingCenter"]} ${classes["addressLine"]} mr-5 ml-1`}
              >
                {t("AddressLine2")}
              </Label>
              <FormGroup>
                <AvField
                  type="text"
                  name="addressLine2"
                  className={`${classes["inputClassNew"]}`}
                  placeholder={t("EnteraddressLine2")}
                  value={addressLine2}
                  onChange={changeAddressHandler}
                  validate={{
                    required: { value: true, errorMessage: t("EnteraddressLine2") },
                    minLength: {
                      value: 2,
                      errorMessage: t("AddressLine2Validation"),
                    },
                    maxLength: {
                      value: 250,
                      errorMessage: t("AddressLine2Validation"),
                    },
                  }}
                  required
                  disabled={!isEdit}
                />
              </FormGroup>
            </Row>
          </Col>
          <Col>
            <Row className={`label-required`}>
              <Label for="country" className={`${classes["paddingCenter"]} ${classes["country"]} mr-5`}>
                {t("Country")}
              </Label>
              <FormGroup>
                <AvField
                  type="select"
                  name="country"
                  className={`${classes["inputClassNew"]}`}
                  placeholder={t("EnterFIEntityCountry")}
                  value={country}
                  onChange={changeCountryHandler}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: t("SelectCountry"),
                    },
                  }}
                  required
                  disabled={!isEdit}
                >
                    {
                    <option key="" value="">
                      {t("SelectCountry")}
                    </option>
                  }
                  {countryList?.map((country) => (
                    <option
                      key={country.id}
                      value={country.countryCode}
                    >
                      {country.countryName}
                    </option>
                  ))}
                </AvField>
              </FormGroup>
            </Row>
            <Row className={`label-required`}>
              <Label
                for="postalCode"
                className={`${classes["paddingCenter"]} ${classes["postalCode"]}  mr-4`}
              >
                {t("Postal Code")}
              </Label>
              <FormGroup className="label-required">
                <AvField
                  type="text"
                  name="postalCode"
                  className={`${classes["inputClassNew"]}`}
                  placeholder={t("Enter postal code")}
                  value={postalCode}
                  onChange={changePostalCodeHandler}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: t("PostalCodeValidation"),
                    },
                    pattern: {value: '^[0-9]+$'},
                    minLength: {
                        value: 2,
                        errorMessage: t("PostalCodeLengthValidation"),
                    },
                    maxLength: {
                        value: 20,
                        errorMessage: t("PostalCodeLengthValidation"),
                    },
                  }}
                  required
                  disabled={!isEdit}
                />
              </FormGroup>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default withTranslation()(FIAddress);
