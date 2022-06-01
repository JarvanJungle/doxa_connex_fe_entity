import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
} from "components";
import { useDispatch, useSelector } from "react-redux";
import { getVendorDetail } from "actions/externalVendorActions";
import { v4 as uuidv4 } from "uuid";
import ExtVendorService from "services/ExtVendorService";
import { getCurrentCompanyUUIDByStore } from "helper/utilities";

const VendorInformation = (props) => {
    const {
        t,
        values,
        setFieldValue,
        vendors
    } = props;
    const dispatch = useDispatch();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const externalVendorSelector = useSelector((state) => state.externalVendorReducer);
    const authReducer = useSelector((state) => state.authReducer);
    const permissionReducer = useSelector((state) => state.permissionReducer);

    useEffect(() => {
        if (values.vendorUuid) {
            const selectedVendorByUuid = vendors.find((item) => item.uuid === values.vendorUuid);
            if (selectedVendorByUuid) {
                setSelectedVendor(selectedVendorByUuid);
            }
        }
    }, [values.vendorUuid]);

    useEffect(() => {
        if (selectedVendor) {
            setFieldValue("vendorName", selectedVendor.companyName);
            setFieldValue("vendorCode", selectedVendor.companyCode);
            setFieldValue("companyRegistrationNo", selectedVendor.uen);

            ExtVendorService.getExternalVendorDetails(
                getCurrentCompanyUUIDByStore(permissionReducer), selectedVendor.uuid
            ).then((result) => {
                if (result?.data?.data) {
                    const dataDetail = result?.data?.data;
                    setFieldValue("vendorCompanyUuid", dataDetail.vendorCompanyUuid || dataDetail.uuid);
                    setFieldValue("countryName", dataDetail.countryOfOrigin);
                }
            });

            const { companyUuid } = authReducer.userDetails.companies[0];
            dispatch(getVendorDetail(companyUuid, selectedVendor.uuid));
        }
    }, [selectedVendor]);

    useEffect(() => {
        if (externalVendorSelector.externalVendorDetail) {
            let { supplierUserList } = externalVendorSelector.externalVendorDetail;
            if (supplierUserList && supplierUserList.length > 0) {
                supplierUserList = supplierUserList.map((item) => {
                    item.uuid = uuidv4();
                    return item;
                });
                supplierUserList.sort(
                    (a, b) => {
                        if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) return -1;
                        if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) return 1;
                        return 0;
                    }
                );
                setContacts(supplierUserList);
                setSelectedContact(supplierUserList.find((item) => item.default));
            }
        }
    }, [externalVendorSelector]);

    useEffect(() => {
        if (selectedContact) {
            setFieldValue("contactUuid", selectedContact.uuid);
            setFieldValue("contactName", selectedContact.fullName);
            setFieldValue("contactEmail", selectedContact.emailAddress);
            setFieldValue("contactNumber", selectedContact.workNumber);
            setFieldValue("countryCode", selectedContact.countryCode);

            setFieldValue("contactNumberCustom", `+${selectedContact.countryCode} ${selectedContact.workNumber}`);
        }
    }, [selectedContact]);

    return (
        <>
            <Card className="mb-4">
                <CardHeader tag="h6">{t("VendorInformation")}</CardHeader>
            </Card>
        </>
    );
};

export default VendorInformation;
