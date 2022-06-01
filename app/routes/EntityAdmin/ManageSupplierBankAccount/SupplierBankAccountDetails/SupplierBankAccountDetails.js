import React, { useEffect, useMemo, useState } from "react";
import {
    Container, Row, Col, Button, Input
} from "components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import useToast from "routes/hooks/useToast";
import { HeaderSecondary } from "routes/components/HeaderSecondary";
import StickyFooter from "components/StickyFooter";
import { AuditTrail, CommonConfirmDialog, Conversation } from "routes/components";
import { HeaderMain } from "routes/components/HeaderMain";
import { AvForm } from "availity-reactstrap-validation";
import { useSelector } from "react-redux";
import useUnsavedChangesWarning from "routes/components/UseUnsaveChangeWarning/useUnsaveChangeWarning";
import BankAccountService from "services/BankAccountService/BankAccountService";
import {
    debounce,
    formatDateString, formatDateTimeUpdated, isNullOrUndefinedOrEmpty, sortArrayByName
} from "helper/utilities";
import ConversationService from "services/ConversationService/ConversationService";
import CUSTOM_CONSTANTS, { RESPONSE_STATUS } from "helper/constantsDefined";
import EntitiesService from "services/EntitiesService";
import { v4 as uuidv4 } from "uuid";
import ExtVendorService from "services/ExtVendorService";
import classNames from "classnames";
import { initialValues, PAGE_STAGE } from "../helper";
import SupplierBankAccountForm from "./SupplierBankAccountForm";
import SUPPLIER_BANK_ACCOUNT_ROUTES_PATH from "../routes";
import Countries from "/public/assets/Countries.jsx";

export default function SupplierBankAccountDetails() {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const showToast = useToast();
    const permissionReducer = useSelector((state) => state.permissionReducer);
    const { userPermission } = permissionReducer;
    const authReducer = useSelector((state) => state.authReducer);
    const { userDetails } = authReducer;

    const [pageState, setPageState] = useState(PAGE_STAGE.CREATE);
    const [formData, setFormData] = useState(initialValues);
    const [isUpdate, setIsUpdate] = useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const [bankAccountStates, setBankAccountStates] = useState({
        loading: false,
        companyUuid: "",
        activeInternalTab: 1,
        activeExternalTab: 1,
        showAddCatalogue: false,
        showAddContact: false,
        showAddForecast: false,
        catalogueItems: [],
        forecastItems: [],
        contactItems: [],
        suppliers: [],
        uoms: [],
        currencies: [],
        taxRecords: [],
        addresses: [],
        responseUOMs: [],
        glAccounts: [],
        typeOfRequisitions: [],
        natureOfRequisitions: [
            { label: "Project", value: true },
            { label: "Non-Project", value: false }
        ],
        projects: [],
        procurementTypes: [
            { label: "Goods", value: "GOODS" },
            { label: "Service", value: "SERVICE" }
        ],
        approvalRoutes: [],
        rowDataProject: [],
        rowDataTrade: [],
        rowDataItem: [],
        rowDataInternalConversation: [],
        rowDataExternalConversation: [],
        rowDataInternalAttachment: [],
        rowDataExternalAttachment: [],
        rowDataItemReq: [],
        rowDataAuditTrail: [],
        subTotal: 0,
        tax: 0,
        total: 0,
        selectedCatalogueItems: [],
        selectedForecastItems: [],
        selectedContactItems: [],
        externalConversationLines: [],
        internalConversationLines: [],
        attachments: [],
        listBank: [],
        listBankData: [],
        listSupplier: [],
        isInit: false,
        showErrorReasonReject: false,
        displayRejectReasonDialog: false,
        reasonReject: ""
    });

    const [showValidate, setShowValidate] = useState(false);

    const sendCommentConversation = async (comment, isInternal) => {
        if (isInternal) {
            const internalConversationLines = [...bankAccountStates.internalConversationLines];
            const { rowDataInternalConversation } = bankAccountStates;
            const newRowData = [...rowDataInternalConversation];
            newRowData.push({
                userName: userDetails.name,
                userRole: userDetails.designation,
                userUuid: userDetails.uuid,
                dateTime: formatDateString(new Date(), CUSTOM_CONSTANTS.DDMMYYYHHmmss),
                comment,
                externalConversation: false
            });
            internalConversationLines.push({
                text: comment
            });
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataInternalConversation: newRowData,
                internalConversationLines
            }));
            return;
        }

        const { rowDataExternalConversation } = bankAccountStates;
        const newRowData = [...rowDataExternalConversation];
        const externalConversationLines = [...bankAccountStates.externalConversationLines];
        newRowData.push({
            userName: userDetails.name,
            userRole: userDetails.designation,
            userUuid: userDetails.uuid,
            dateTime: formatDateString(new Date(), CUSTOM_CONSTANTS.DDMMYYYHHmmss),
            comment,
            externalConversation: true
        });
        externalConversationLines.push({
            text: comment
        });
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            rowDataExternalConversation: newRowData,
            externalConversationLines
        }));
    };
    const addNewRowAttachment = (isInternal) => {
        if (isInternal) {
            const { rowDataInternalAttachment } = bankAccountStates;
            const newRowData = [...rowDataInternalAttachment];
            newRowData.push({
                guid: "",
                fileLabel: "",
                fileDescription: "",
                uploadedOn: formatDateString(new Date(), CUSTOM_CONSTANTS.DDMMYYYHHmmss),
                uploadedBy: userDetails.name,
                uploaderUuid: userDetails.uuid,
                externalDocument: false,
                uuid: uuidv4(),
                isNew: true
            });
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataInternalAttachment: newRowData
            }));
            return;
        }

        const { rowDataExternalAttachment } = bankAccountStates;
        const newRowData = [...rowDataExternalAttachment];
        newRowData.push({
            guid: "",
            fileLabel: "",
            fileDescription: "",
            uploadedOn: formatDateString(new Date(), CUSTOM_CONSTANTS.DDMMYYYHHmmss),
            uploadedBy: userDetails.name,
            uploaderUuid: userDetails.uuid,
            externalDocument: true,
            uuid: uuidv4(),
            isNew: true
        });
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            rowDataExternalAttachment: newRowData
        }));
    };
    const handleFileUpload = async (event) => {
        try {
            const data = new FormData();
            const file = event.target.files[0];
            data.append("file", file);
            data.append("category", "purchase-service/documents");
            data.append("uploaderRole", "user");
            const response = await EntitiesService.uploadDocuments(data);
            const responseData = response.data.data;
            if (response.data.status === "OK") {
                return ({
                    fileLabel: responseData.fileName,
                    guid: responseData.guid
                });
            }
            showToast("error", response.data.message);
        } catch (error) {
            if (error.response) {
                if (error.response.data.status === "BAD_REQUEST") {
                    showToast("error", "We don't support this file format, please upload another.");
                } else {
                    showToast("error", error.response.data.message);
                }
            } else {
                showToast("error", error.message);
            }
        }
        return null;
    };
    const handelDeleteFile = async (guid) => {
        try {
            const response = await EntitiesService.deleteDocuments(guid);
            if (response.data.status === "OK") {
                return true;
            }
            showToast("error", response.data.message);
        } catch (error) {
            showToast("error", error.response ? error.response.data.message : error.message);
        }
        return false;
    };
    const onAddAttachment = (event, uuid, rowData, isInternal) => {
        handleFileUpload(event).then((result) => {
            if (!result) return;
            if (isInternal) {
                const newRowData = [...rowData];
                newRowData.forEach((row, index) => {
                    if (row.uuid === uuid) {
                        newRowData[index] = {
                            ...row,
                            guid: result.guid,
                            attachment: result.fileLabel
                        };
                    }
                });
                setBankAccountStates((prevStates) => ({
                    ...prevStates,
                    rowDataInternalAttachment: newRowData
                }));
                return;
            }

            const newRowData = [...rowData];
            newRowData.forEach((row, index) => {
                if (row.uuid === uuid) {
                    newRowData[index] = {
                        ...row,
                        guid: result.guid,
                        attachment: result.fileLabel
                    };
                }
            });
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataExternalAttachment: newRowData
            }));
        }).catch((error) => {
            showToast("error", error.response ? error.response.data.message : error.message);
        });
    };
    const onDeleteAttachment = (uuid, rowData, isInternal) => {
        if (isInternal) {
            const newRowData = rowData.filter((row) => row.uuid !== uuid);
            const rowDeleted = rowData.find((row) => row.uuid === uuid);
            if (rowDeleted && rowDeleted.guid) {
                handelDeleteFile(rowDeleted.guid);
            }
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataInternalAttachment: newRowData
            }));
            return;
        }

        const newRowData = rowData.filter((row) => row.uuid !== uuid);
        const rowDeleted = rowData.find((row) => row.uuid === uuid);
        if (rowDeleted && rowDeleted.guid) {
            handelDeleteFile(rowDeleted.guid);
        }
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            rowDataExternalAttachment: newRowData
        }));
    };
    const onCellEditingStopped = (params, isInternal) => {
        const { data } = params;
        if (isInternal) {
            const { rowDataInternalAttachment } = bankAccountStates;
            const newRowData = [...rowDataInternalAttachment];
            newRowData.forEach((rowData, index) => {
                if (rowData.uuid === data.uuid) {
                    newRowData[index] = {
                        ...data
                    };
                }
            });
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataInternalAttachment: newRowData
            }));
            return;
        }

        const { rowDataExternalAttachment } = bankAccountStates;
        const newRowData = [...rowDataExternalAttachment];
        newRowData.forEach((rowData, index) => {
            if (rowData.uuid === data.uuid) {
                newRowData[index] = {
                    ...data
                };
            }
        });
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            rowDataExternalAttachment: newRowData
        }));
    };
    const mappingCreateBodyParams = (data) => {
        const dataBody = {
            ...data
        };
        if (dataBody.companyName) {
            delete dataBody.companyName;
            delete dataBody.companyRegNo;
            delete dataBody.companyCode;
            delete dataBody.paymentTerms;
            delete dataBody.countryOfOrigin;
        }
        const listInternal = bankAccountStates.rowDataInternalAttachment.map((item) => ({
            guid: item.guid,
            fileLabel: item.fileLabel || item.attachment,
            fileDescription: item.fileDescription,
            uploadBy: userDetails.name,
            externalDocument: false
        }));
        const listExternal = bankAccountStates.rowDataExternalAttachment.map((item) => ({
            guid: item.guid,
            fileLabel: item.fileLabel || item.attachment,
            fileDescription: item.fileDescription,
            uploadBy: userDetails.name,
            externalDocument: true
        }));
        const listDocument = listInternal.concat(listExternal);
        listDocument.forEach((item) => {
            if (!item.guid) {
                throw new Error("Please attach a file!");
            }
        });
        const listDocDto = listDocument.filter((item) => bankAccountStates.attachments
            .filter((value) => value.guid === item.guid).length === 0);
        const body = {
            ...dataBody,
            supplierBankAccountDocumentMetadata: listDocDto
        };
        return body;
    };

    const getDetailBankAccount = async (currentCompanyUUID, bankAccountUuid) => {
        const responseCatalogue = await BankAccountService
            .getSupplierBankAccountDetails(currentCompanyUUID, bankAccountUuid);
        if (responseCatalogue.data.status === "OK") {
            const resData = responseCatalogue.data.data;

            // Hide Approve/ Reject
            if (resData.status === "PENDING_APPROVAL") {
                setPageState(PAGE_STAGE.APPROVE);
            }
            const formatData = {
                ...resData,
                companyCode: resData?.vendor?.companyCode,
                companyName: resData?.vendor?.companyName,
                paymentTerms: resData?.vendor?.paymentTerm ? `${resData.vendor.paymentTerm?.ptDays} (Pay in ${resData.vendor.paymentTerm?.ptName})` : "",
                companyRegNo: resData?.vendor?.uen,
                countryOfOrigin: resData?.vendor?.countryOfOrigin,
                defaultAccountBeforeApproval: resData.defaultAccountBeforeApproval
            };
            setFormData(formatData);
            const attachments = resData.bankAccountDocumentMetadata
                ? resData.bankAccountDocumentMetadata.map((item) => ({
                    ...item,
                    uploadedOn: formatDateString(
                        formatDateTimeUpdated(item.uploadedOn, CUSTOM_CONSTANTS.YYYYMMDDHHmmss)
                    )
                })) : [];

            const rowDataExternalConversation = [
                ...bankAccountStates.rowDataExternalConversation];
            try {
                const resConversation = await ConversationService
                    .getDetailExternalConversation(
                        currentCompanyUUID, bankAccountUuid
                    );
                if (resConversation.data.status === "OK") {
                    resConversation?.data?.data?.conversations
                        .forEach((item) => {
                            rowDataExternalConversation.push({
                                userName: item.sender,
                                userRole: item.designation,
                                userUuid: item.userUuid,
                                dateTime: formatDateString(new Date(item.createdAt),
                                    CUSTOM_CONSTANTS.DDMMYYYHHmmss),
                                comment: item.text,
                                externalConversation: true
                            });
                        });
                }
            } catch (error) {
                console.log("error", error);
            }
            const rowDataInternalConversation = [
                ...bankAccountStates.rowDataInternalConversation];
            try {
                const relatedAccountUuid = resData.relatedAccountUuid || [];
                if (Array.isArray(relatedAccountUuid)) {
                    const originInternalConversations = await Promise.all(relatedAccountUuid.map((uuid) => ConversationService.getDetailInternalConversation(
                        currentCompanyUUID, uuid
                    )));
                    // eslint-disable-next-line array-callback-return
                    originInternalConversations.map((responose) => {
                        if (responose.data.status === "OK") {
                            responose?.data?.data?.conversations.forEach((item) => {
                                rowDataInternalConversation.push({
                                    userName: item.sender,
                                    userRole: item.designation,
                                    userUuid: item.userUuid,
                                    dateTime: formatDateString(new Date(item.date), CUSTOM_CONSTANTS.DDMMYYYHHmmss),
                                    comment: item.text,
                                    externalConversation: true
                                });
                            });
                        }
                    });
                }
            } catch (error) {
                console.log("error", error);
            }

            setBankAccountStates((prevStates) => ({
                ...prevStates,
                rowDataAuditTrail: resData.bankAccountAuditTrail.map((item) => ({
                    userName: item.userName,
                    userRole: item.userRole,
                    dateTime: formatDateString(
                        formatDateTimeUpdated(item.dateTime, CUSTOM_CONSTANTS.YYYYMMDDHHmmss)
                    ),
                    action: item.action
                })),
                rowDataInternalAttachment: attachments.filter(
                    (attachment) => attachment.externalDocument === false
                ),
                rowDataExternalAttachment: attachments.filter(
                    (attachment) => attachment.externalDocument === true
                ),
                rowDataExternalConversation,
                rowDataInternalConversation,
                isInit: true,
                attachments
            }));
        } else {
            showToast("error", responseCatalogue.data.message);
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            const createBankAccountBody = mappingCreateBodyParams(formData);

            if (pageState === PAGE_STAGE.CREATE) {
                const response = await BankAccountService.postCreateSupplierBankAccount(
                    bankAccountStates.companyUuid, createBankAccountBody
                );
                if (response.data.status === "OK") {
                    if (bankAccountStates.externalConversationLines.length > 0) {
                        const conversationBody = {
                            referenceId: response.data.data,
                            supplierUuid: userDetails.uuid,
                            conversations: bankAccountStates.externalConversationLines
                        };
                        await ConversationService
                            .createExternalConversation(
                                bankAccountStates.companyUuid, conversationBody
                            );
                    }
                    if (bankAccountStates.internalConversationLines.length > 0) {
                        const conversationBody = {
                            referenceId: response.data.data,
                            supplierUuid: userDetails.uuid,
                            conversations: bankAccountStates.internalConversationLines
                        };
                        await ConversationService
                            .createInternalConversation(
                                bankAccountStates.companyUuid, conversationBody
                            );
                    }
                    setPristine();
                    history.push(SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST);
                    showToast("success", response.data.message);
                } else {
                    showToast("error", response.data.message);
                }
            } else if (isUpdate) {
                const response = await BankAccountService.postUpdateSupplierBankAccount(bankAccountStates.companyUuid, createBankAccountBody);
                if (response.data.status === "OK") {
                    if (bankAccountStates.externalConversationLines.length > 0) {
                        const conversationBody = {
                            referenceId: response.data.data,
                            supplierUuid: userDetails.uuid,
                            conversations: bankAccountStates.externalConversationLines
                        };
                        await ConversationService
                            .createExternalConversation(
                                bankAccountStates.companyUuid, conversationBody
                            );
                    }
                    if (bankAccountStates.internalConversationLines.length > 0) {
                        const conversationBody = {
                            referenceId: response.data.data,
                            supplierUuid: userDetails.uuid,
                            conversations: bankAccountStates.internalConversationLines
                        };
                        await ConversationService
                            .createInternalConversation(
                                bankAccountStates.companyUuid, conversationBody
                            );
                    }
                    setPristine();
                    history.push(SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST);
                    showToast("success", response.data.message);
                } else {
                    showToast("error", response.data.message);
                }
            }
        } catch (error) {
            showToast("error", error.response.data.message);
        }
    };

    const approvedBankAccount = async () => {
        const BABody = mappingCreateBodyParams(formData);
        const bodyApprove = {
            uuid: BABody.uuid,
            documents: BABody.supplierBankAccountDocumentMetadata
        };
        const response = await BankAccountService.postApproveSupplierBankAccount(
            bankAccountStates.companyUuid, bodyApprove.uuid, bodyApprove
        );
        if (response.data.status === "OK") {
            if (bankAccountStates.externalConversationLines.length > 0) {
                const conversationBody = {
                    referenceId: BABody.uuid,
                    supplierUuid: userDetails.uuid,
                    conversations: bankAccountStates.externalConversationLines
                };
                await ConversationService
                    .createExternalConversation(
                        bankAccountStates.companyUuid, conversationBody
                    );
            }
            if (bankAccountStates.internalConversationLines.length > 0) {
                const conversationBody = {
                    referenceId: BABody.uuid,
                    supplierUuid: userDetails.uuid,
                    conversations: bankAccountStates.internalConversationLines
                };
                await ConversationService
                    .createInternalConversation(
                        bankAccountStates.companyUuid, conversationBody
                    );
            }
            setPristine();
            history.push(SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST);
            showToast("success", response.data.message);
        } else {
            showToast("error", response.data.message);
        }
    };

    const rejectBankAccount = async () => {
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            showErrorReasonReject: true
        }));
        if (bankAccountStates.reasonReject) {
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                showErrorReasonReject: false
            }));
            const BABody = mappingCreateBodyParams(formData);
            const bodyReject = {
                uuid: BABody.uuid,
                documents: BABody.supplierBankAccountDocumentMetadata
            };
            const response = await BankAccountService.postRejectSupplierBankAccount(
                bankAccountStates.companyUuid, BABody.uuid, bodyReject
            );
            if (response.data.status === "OK") {
                const conversationLines = [...bankAccountStates.internalConversationLines];
                conversationLines.push({ text: bankAccountStates.reasonReject });
                if (bankAccountStates.externalConversationLines.length > 0) {
                    const conversationBody = {
                        referenceId: BABody.uuid,
                        supplierUuid: userDetails.uuid,
                        conversations: bankAccountStates.externalConversationLines
                    };
                    await ConversationService
                        .createExternalConversation(
                            bankAccountStates.companyUuid, conversationBody
                        );
                }
                if (conversationLines.length > 0) {
                    const conversationBody = {
                        referenceId: BABody.uuid,
                        supplierUuid: userDetails.uuid,
                        conversations: conversationLines
                    };
                    await ConversationService
                        .createInternalConversation(
                            bankAccountStates.companyUuid, conversationBody
                        );
                }
                setPristine();
                history.push(SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST);
                showToast("success", response.data.message);
            } else {
                showToast("error", response.data.message);
            }
        }
    };

    const handleValidSubmit = () => {
        if (!formData.companyCode || !formData.country || !formData.currency || !formData.bankName) {
            setShowValidate(true);
            showToast("error", "Validation error, please check your input");
        } else {
            setShowValidate(false);
            handleCreateOrUpdate();
        }
    };

    const handleInvalidSubmit = () => {
        if (!formData.companyCode || !formData.country || !formData.currency || !formData.bankName) {
            setShowValidate(true);
        } else {
            setShowValidate(false);
        }
        showToast("error", "Validation error, please check your input");
    };

    const handleChangeBank = (event) => {
        const { value } = event;

        setFormData({
            ...formData,
            bankName: value
        });
    };
    const handleChangeValue = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleChangeCountry = (event) => {
        const listBankAccount = [...bankAccountStates.listBankData];
        const country = Countries.countries.find((item) => item.name === event.value);
        setBankAccountStates((prevStates) => ({
            ...prevStates,
            listBank: listBankAccount.filter((item) => (item.country === country.code))
        }));
        setFormData({ ...formData, country: event.value });
    };
    const handleChangeCurrency = (event) => {
        const { value } = event;

        setFormData({
            ...formData,
            currency: value
        });
    };

    const handleChangeSupplier = async (event, supplierData) => {
        const { value } = event;
        let supplier = supplierData;
        if (value) {
            supplier = bankAccountStates.listSupplier.find((item) => item.companyCode === value);
        }
        try {
            const response = await ExtVendorService.getExternalVendorDetails(
                bankAccountStates.companyUuid, supplier.uuid
            );
            const { data } = response.data;
            setFormData({
                ...formData,
                companyCode: data.companyCode,
                companyName: data.companyName,
                companyUuid: bankAccountStates.companyUuid,
                supplierUuid: supplier.uuid,
                companyName: data.companyName,
                companyRegNo: data.uen,
                countryOfOrigin: data.countryOfOrigin,
                paymentTerms: data.paymentTerm ? `${data?.paymentTerm?.ptDays} (Pay in ${data?.paymentTerm?.ptName})` : ""
            });
        } catch (error) {
            console.log("error", error);
        }
    };
    const handleChangeActive = async (event) => {
        setFormData({
            ...formData,
            defaultAccountBeforeApproval: !formData.defaultAccountBeforeApproval
        });
    };

    const getDataResponse = (responseData, type = "array") => {
        if (responseData.status === RESPONSE_STATUS.FULFILLED) {
            const { value } = responseData;
            const { status, data, message } = value && value.data;
            if (status === RESPONSE_STATUS.OK) {
                return data;
            }
            showToast("error", message);
        } else {
            const { response } = responseData && responseData.reason;
            showToast("error", response.data.message || response.data.error);
        }
        return type === "array" ? [] : {};
    };

    const initData = async (currentCompanyUUID) => {
        try {
            const responses = await Promise.allSettled([
                BankAccountService.getListBankName(currentCompanyUUID),
                ExtVendorService.getExternalVendors(currentCompanyUUID)
            ]);
            const [
                resListBank,
                resSupplier
            ] = responses;

            const suppliers = getDataResponse(resSupplier).filter((item) => item.seller === true);
            const supplierSorted = sortArrayByName(suppliers, "companyName");

            setBankAccountStates((prevStates) => ({
                ...prevStates,
                listBank: getDataResponse(resListBank),
                listBankData: getDataResponse(resListBank),
                listSupplier: supplierSorted
            }));
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        const currentCompanyUUID = permissionReducer?.currentCompany?.companyUuid;
        if (!isNullOrUndefinedOrEmpty(currentCompanyUUID)) {
            setBankAccountStates((prevStates) => ({
                ...prevStates,
                companyUuid: currentCompanyUUID
            }));
            const query = new URLSearchParams(location.search);
            const uuid = query.get("uuid");
            initData(currentCompanyUUID);
            if (uuid) {
                setPageState(PAGE_STAGE.DETAIL);
                getDetailBankAccount(currentCompanyUUID, uuid);
            } else {
                setBankAccountStates((prevStates) => ({
                    ...prevStates,
                    isInit: true
                }));
            }
        }
    }, [userPermission]);

    useEffect(() => {
        if (bankAccountStates.isInit) {
            setDirty();
        }
    }, [formData]);

    const enable = useMemo(() => pageState === PAGE_STAGE.CREATE || isUpdate || (pageState === PAGE_STAGE.APPROVE && !formData.requestor), [pageState, isUpdate, formData]);

    return (
        <AvForm onValidSubmit={debounce(handleValidSubmit)} onInvalidSubmit={debounce(handleInvalidSubmit)}>
            <Container fluid>
                <Row className="mb-4">
                    <Col md={12} lg={12}>
                        {pageState === PAGE_STAGE.CREATE && (
                            <HeaderMain
                                title={t("Add New Supplier Bank Account")}
                                className="mb-3 mb-lg-3"
                            />
                        )}
                        {pageState === PAGE_STAGE.APPROVE && (
                            <HeaderMain
                                title={t("Supplier Bank Account Details")}
                                className="mb-3 mb-lg-3"
                            />
                        )}
                        {pageState === PAGE_STAGE.DETAIL && (
                            <HeaderMain
                                title={t("Supplier Bank Account Details")}
                                className="mb-3 mb-lg-3"
                            />
                        )}
                        <Row>
                            <Col xs={12}>
                                <SupplierBankAccountForm
                                    formData={formData}
                                    pageState={pageState}
                                    onChange={handleChangeValue}
                                    handleChangeCountry={handleChangeCountry}
                                    listBank={bankAccountStates.listBank}
                                    listSupplier={bankAccountStates.listSupplier}
                                    handleChangeSupplier={handleChangeSupplier}
                                    handleChangeActive={handleChangeActive}
                                    handleChangeCurrency={handleChangeCurrency}
                                    handleChangeBank={handleChangeBank}
                                    isUpdate={isUpdate}
                                    showValidate={showValidate}
                                />
                            </Col>
                        </Row>

                        <HeaderSecondary
                            title={t("Conversations")}
                            className="mb-2"
                        />
                        <Row className="mb-2">
                            <Col xs={12}>
                                {/* Internal Conversations */}
                                <Conversation
                                    title={t("InternalConversations")}
                                    activeTab={bankAccountStates.activeInternalTab}
                                    setActiveTab={(idx) => {
                                        setBankAccountStates((prevStates) => ({
                                            ...prevStates,
                                            activeInternalTab: idx
                                        }));
                                    }}
                                    sendConversation={
                                        (comment) => sendCommentConversation(
                                            comment, true
                                        )
                                    }
                                    addNewRowAttachment={
                                        () => addNewRowAttachment(true)
                                    }
                                    rowDataConversation={
                                        bankAccountStates.rowDataInternalConversation
                                    }
                                    rowDataAttachment={
                                        bankAccountStates.rowDataInternalAttachment
                                    }
                                    onDeleteAttachment={
                                        (uuid, rowData) => onDeleteAttachment(
                                            uuid, rowData, true
                                        )
                                    }
                                    onAddAttachment={
                                        (e, uuid, rowData) => onAddAttachment(
                                            e, uuid, rowData, true
                                        )
                                    }
                                    onCellEditingStopped={
                                        (params) => onCellEditingStopped(params, true)
                                    }
                                    defaultExpanded
                                    disabled={!enable}
                                />
                            </Col>
                        </Row>
                        {/* Comment External Conversation */}
                        {/* Comment External Conversation */}

                        <HeaderSecondary
                            title={t("AuditTrail")}
                            className="mb-2"
                        />
                        <Row className="mb-5">
                            <Col xs={12}>
                                {/* Audit Trail */}
                                <AuditTrail
                                    rowData={bankAccountStates.rowDataAuditTrail}
                                    onGridReady={(params) => {
                                        params.api.sizeColumnsToFit();
                                    }}
                                    paginationPageSize={10}
                                    gridHeight={350}
                                    defaultExpanded
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <StickyFooter>
                    <Row className="mx-0 px-3 justify-content-between">
                        <Button
                            color="secondary"
                            onClick={() => history.push(
                                SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST
                            )}
                        >
                            {t("Back")}
                        </Button>

                        {pageState === PAGE_STAGE.CREATE && (
                            <Row className="mx-0">
                                <Button
                                    color="primary"
                                    type="submit"
                                    label={t("Create")}
                                >
                                    {t("Create")}
                                </Button>
                            </Row>
                        )}
                        {isUpdate && (
                            <Row className="mx-0">
                                <Button
                                    color="primary"
                                    type="submit"
                                    label={t("Create")}
                                >
                                    {t("Save")}
                                </Button>
                            </Row>
                        )}
                        {!isUpdate && formData.status && formData.requestor && [PAGE_STAGE.APPROVED, PAGE_STAGE.REJECTED].includes(formData.status) && (
                            <Button
                                color="facebook"
                                className="mr-2"
                                onClick={async () => {
                                    await handleChangeSupplier({ target: {} }, formData.vendor);
                                    setIsUpdate(true);
                                }}
                            >
                                {t("Edit")}
                                <i className="ml-1 fa fa-pencil" />
                            </Button>
                        )}
                        {pageState === PAGE_STAGE.APPROVE && !formData.requestor && (
                            <Row className="mx-0">
                                <Button
                                    color="danger"
                                    type="button"
                                    className="mr-3"
                                    label={t("Reject")}
                                    onClick={() => {
                                        setBankAccountStates((prevStates) => ({
                                            ...prevStates,
                                            displayRejectReasonDialog: true
                                        }));
                                    }}
                                >
                                    {t("Reject")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="button"
                                    label={t("Approve")}
                                    onClick={approvedBankAccount}
                                >
                                    {t("Approve")}
                                </Button>
                            </Row>
                        )}
                    </Row>
                </StickyFooter>
                {Prompt}
                <CommonConfirmDialog
                    isShow={bankAccountStates.displayRejectReasonDialog}
                    onHide={() => setBankAccountStates((prevStates) => ({
                        ...prevStates,
                        displayRejectReasonDialog: false
                    }))}
                    title={t("Reason")}
                    positiveProps={
                        {
                            onPositiveAction: () => {
                                rejectBankAccount(bankAccountStates.reasonReject);
                            },
                            contentPositive: t("Reject"),
                            colorPositive: "danger"
                        }
                    }
                    negativeProps={
                        {
                            onNegativeAction: () => setBankAccountStates((prevStates) => ({
                                ...prevStates,
                                displayRejectReasonDialog: false
                            })),
                            contentNegative: t("Close"),
                            colorNegative: "secondary"
                        }
                    }
                    size="xs"
                    titleCenter
                    titleRequired
                >
                    <Input
                        type="textarea"
                        rows={5}
                        name="rejectReason"
                        className={
                            classNames("form-control", {
                                "is-invalid": bankAccountStates.showErrorReasonReject && !bankAccountStates.reasonReject
                            })
                        }
                        placeholder={t("Please enter reason..")}
                        value={bankAccountStates.reasonReject}
                        onChange={(e) => {
                            const { value } = e.target;
                            setBankAccountStates((prevStates) => ({
                                ...prevStates,
                                reasonReject: value
                            }));
                        }}
                    />
                    {
                        bankAccountStates.showErrorReasonReject
                        && !bankAccountStates.reasonReject
                        && (<div className="invalid-feedback">{t("PleaseEnterValidReason")}</div>)
                    }
                </CommonConfirmDialog>
            </Container>
        </AvForm>
    );
}
