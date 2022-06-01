import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Label,
    Button, MultiSelect, FormGroup
} from "components";
import { Field, ErrorMessage } from "formik";
import Select from "react-select";
const MatrixSearchForm = (props) => {
    const { t } = useTranslation();
    const {
        userList,
        modules,
        errors,
        values,
        touched,
        dirty,
        setFieldValue,
        onSubmit
    } = props;
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserSelect = (e) => {
        const userUuid = e.value;
        setFieldValue("userUuid", userUuid);
        const selected = userList.find((user) => user.uuid === userUuid);
        if (selected) {
            setSelectedUser(selected);
        }
    };
    const SingleValue = ({ data, ...props }) => {
        if (data.value === "") return <div style={{ opacity: '0.4' }}>{data.label}</div>
        return (<div>{data.label}</div>);
    }
    return (
        <>
            <Card className="mb-4">
                <CardHeader tag="h6">{t("SearchForFeatures")}</CardHeader>
                <CardBody className="p-4">
                    <Row className="d-flex mx-0">
                        <Col md={3} xs={6}>
                            <FormGroup >
                                <Select
                                    onChange={e => handleUserSelect(e)}
                                    components={{ SingleValue }}
                                    options={userList
                                        .map((user) =>
                                        ({
                                            label: user.name,
                                            value: user.uuid
                                        })
                                        )}
                                    isSearchable
                                    defaultValue={{ value: "", label: "Please select an user" }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3} xs={6}>
                            <FormGroup>
                                <MultiSelect
                                    name="moduleCode"
                                    className="form-control"
                                    options={modules.map((module) => ({
                                        name: module.moduleName,
                                        value: module.moduleCode
                                    }))}
                                    objectName="Module"
                                    setFieldValue={setFieldValue}
                                    defaultValue={[]}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3} xs={6} className="text-center">
                            <Button
                                className="mb-2"
                                color="primary"
                                type="submit"
                                onClick={
                                    () => {
                                        if (!dirty || (dirty && Object.keys(errors).length)) {
                                            return;
                                        }
                                        onSubmit(values);
                                    }
                                }
                            >
                                {t("Search")}
                            </Button>
                        </Col>
                    </Row>
                    {
                        selectedUser && (
                            <div style={{ marginTop: "15px" }}>
                                <Row className="d-flex mx-0">
                                    <Col md={3} xs={6}>
                                        <Label>{t("UserName")}</Label>
                                    </Col>
                                    <Col md={6} xs={6}>
                                        {selectedUser.name}
                                    </Col>
                                </Row>
                                <Row className="d-flex mx-0">
                                    <Col md={3} xs={6}>
                                        <Label>{t("Email")}</Label>
                                    </Col>
                                    <Col md={6} xs={6}>
                                        {selectedUser.email}
                                    </Col>
                                </Row>
                                <Row className="d-flex mx-0">
                                    <Col md={3} xs={6}>
                                        <Label>{t("Designation")}</Label>
                                    </Col>
                                    <Col md={6} xs={6}>
                                        {selectedUser.designation}
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                </CardBody>
            </Card>
        </>
    );
};

export default MatrixSearchForm;
