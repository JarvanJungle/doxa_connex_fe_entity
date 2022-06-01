import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    CustomInput,
    Label,
    Tooltip
} from "components";

let timeout = null;
const SummaryDetailsComponent = (props) => {
    const {
        t,
        values,
        touched,
        viewMode,
        handleChange,
        dirty,
        setFieldValue,
        errors,
        dwrItems,
        onChangeList
    } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    const autoFillRententionPercentItem = (value) => {
        if (dwrItems && dwrItems.length) {
            const newDataDWRItems = dwrItems.map((item) => {
                if (item.groupName.length === 1) {
                    return {
                        ...item,
                        retentionPercentage: Number(value)
                    };
                } return item;
            });
            onChangeList(newDataDWRItems);
        }
    };
    useEffect(() => {
        if (dwrItems && dwrItems.length > 0) {
            let total = 0;
            dwrItems.forEach((item) => {
                const { quantity, unitPrice, totalAmount } = item;
                if (item.groupNumber.length === 1) {
                    total += totalAmount || 0;
                }
            });
            setFieldValue("originalContractSum", total.toFixed(2));

            if (values.retentionCappedPercentage) {
                setFieldValue("retentionAmountCappedAt", ((total * Number(values.retentionCappedPercentage)) / 100).toFixed(2));
            }

            if (values) {
                setFieldValue("remeasuredContractSum", (total + Number(values.bqContingencySum)).toFixed(2));
            }
        }
    }, [dwrItems]);

    return (
        <>
            <Card>
                <CardHeader tag="h6">{t("SummaryDetails")}</CardHeader>
                <CardBody>
                    <Row>
                        <Col md={4} lg={4} className="d-flex">
                            <Label className="p-0">{t("IncludeVariationForRetentionCap")}</Label>
                            <i className="fa fa-info-circle ml-2" id="tooltip" style={{ fontSize: "20px" }} />
                            <Tooltip placement="top" isOpen={tooltipOpen} target="tooltip" toggle={toggle} style={{ textAlign: "left" }}>

                                {t("VariationSumWillBeIncludedInTheCalculationOfRetentionCapIfThisFieldIsChecked")}
                            </Tooltip>
                        </Col>
                        <Col md={8} lg={8}>
                            <CustomInput
                                type="checkbox"
                                id="includeVariationCheckbox"
                                name="includeVariation"
                                errors={errors.includeVariation}
                                touched={touched.includeVariation}
                                checked={values.includeVariation}
                                onChange={(e) => setFieldValue("includeVariation", e.target.checked)}
                                disabled={viewMode}
                            />
                        </Col>
                        
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};

export default SummaryDetailsComponent;
