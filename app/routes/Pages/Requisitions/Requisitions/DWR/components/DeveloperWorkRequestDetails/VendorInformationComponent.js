import React, { useEffect, useState, useRef } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row
} from "components";
import ExtVendorService from "services/ExtVendorService";
import { getCurrentCompanyUUIDByStore } from "helper/utilities";
import { useDispatch, useSelector } from "react-redux";
import { getVendorDetail } from "actions/externalVendorActions";
import { v4 as uuidv4 } from "uuid";


const VendorInformationComponent = (props) => {
    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }
    const {
        t,
        values,
        setFieldValue,
    } = props;
    const permissionReducer = useSelector((state) => state.permissionReducer);

    useEffect(() => {
        setFieldValue("contactNumberShow", `+${values.countryCode} ${values.contactNumber}`);
    }, [values.contactNumber]);

    // useEffect(() => {
    //     setFieldValue("countryCodeShow", values.countryName);
    // }, [values.countryCode]);

    useEffect(() => {
        if (values.vendorUuid) {
            ExtVendorService.getExternalVendorDetails(
                getCurrentCompanyUUIDByStore(permissionReducer), values.vendorUuid
            ).then((result) => {
                if (result?.data?.data) {
                    const dataDetail = result?.data?.data;
                    setFieldValue("countryName", dataDetail.countryOfOrigin);
                }
            });
        }
    }, [values.vendorUuid, permissionReducer]);

    return (
        <>
            <Card className="mb-4">
                <CardHeader tag="h6">{t("VendorInformation")}</CardHeader>
            </Card>
        </>
    );
};

export default VendorInformationComponent;
