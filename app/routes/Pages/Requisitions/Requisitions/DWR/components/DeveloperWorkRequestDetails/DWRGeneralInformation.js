import React from "react";
import {
    Card,
    CardHeader,
} from "components";

const DWRGeneralInformation = (props) => {
    const {
        t,
    } = props;

    return (
        <>
            <Card className="mb-4">
                <CardHeader tag="h6">{t("GeneralInformation")}</CardHeader>
            </Card>
        </>
    )
};

export default DWRGeneralInformation;
