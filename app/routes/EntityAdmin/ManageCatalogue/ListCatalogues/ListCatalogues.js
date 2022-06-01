import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePermission } from "routes/hooks";
import { HeaderMain } from "routes/components/HeaderMain";
import CSVTemplate from "helper/commonConfig/CSVTemplates";
import { CSVLink } from "react-csv";
import {
    Container, ButtonToolbar,
    Button, Row, Col
} from "components";
import CatalogueService from "services/CatalogueService";
import useToast from "routes/hooks/useToast";
import ActionModal from "routes/components/ActionModal";
import UploadButton from "routes/components/UploadButton";
import CSVHelper from "helper/CSVHelper";
import { formatDateString, formatDateTime, formatDisplayDecimal } from "helper/utilities";
import CUSTOM_CONSTANTS, { FEATURE } from "helper/constantsDefined";
import { AgGridReact } from "components/agGrid";
import CatalogueTable from "./CatalogueTable";
import CATALOGUES_ROUTE from "../route";

const ListCatalogues = () => {
    const { t } = useTranslation();
    const showToast = useToast();
    const refActiveModal = useRef(null);
    const refDeactivateModal = useRef(null);
    const [showAction, setShowAction] = useState(false);
    const [selectedCatalogue, setSelectedCatalogue] = useState();
    const [actionOne, setActionOne] = useState();
    const [companyUuid, setCompanyUuid] = useState("");
    const [gridApi, setGridApi] = useState();
    const [gridApiDownload, setGridApiDownload] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const buttonRef = React.createRef();
    const handleRolePermission = usePermission(FEATURE.CATALOGUE);
    const [lastFetch, setLastFetch] = useState(new Date());
    const [rowCatalogueDownload, setRowCatalogueDownload] = useState([]);

    let message = "Opp! Something went wrong.";

    const getAllCatalogue = async (uuid) => {
        const maxInt = 2147483646 - 1;
        const query = {
            page: 0, size: maxInt
        };
        if (uuid) {
            const allCatalogue = await CatalogueService.getCataloguesV2Manage(uuid, query);
            setRowCatalogueDownload(allCatalogue?.data?.data?.catalogues);
        }
    };
    useEffect(() => {
        const companyRole = JSON.parse(localStorage.getItem("companyRole"));
        setCompanyUuid(companyRole.companyUuid);
        getAllCatalogue(companyRole.companyUuid);
    }, []);

    const reloadCatalogues = async () => {
        setLastFetch(new Date());
        gridApi?.deselectAll();
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onGridReadyDownload = (params) => {
        setGridApiDownload(params.api);
    };

    const handleExport = async () => {
        gridApiDownload.exportDataAsCsv({
            fileName: CSVTemplate.Catalogue_List_DownloadFileName,
            columnKeys: [
                "catalogueItemCode",
                "catalogueItemName",
                "description",
                "supplierName",
                "uomCode",
                "itemCategory",
                "itemModel",
                "itemSize",
                "itemBrand",
                "contracted",
                "contractedRefNo",
                "contractedQty",
                "projectCodes",
                "glAccountNumber",
                "contractedPrice",
                "currencyCode",
                "unitPrice",
                "validFrom",
                "validTo",
                "taxCode",
                "taxRate",
                "isActive",
                "updatedOn",
                "createdOn"
            ],
            processCellCallback: (cell) => {
                if (cell.column?.colId === "updatedOn") {
                    return formatDateString(
                        cell.value,
                        CUSTOM_CONSTANTS.DDMMYYYHHmmss
                    );
                }
                return cell.value;
            }
        });
    };

    const selectCell = (event) => {
        if (event.colDef.headerName === "Action") {
            setSelectedCatalogue(event.data.uuid);
            setActionOne(true);
            if (event.data.isActive === "Yes" || event.data.isActive === true) {
                refDeactivateModal.current.toggleModal();
            } else {
                refActiveModal.current.toggleModal();
            }
        }
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes.length > 0) {
            setShowAction(true);
        } else {
            setShowAction(false);
        }
    };

    const handleAction = async (type) => {
        try {
            let data = [];
            let response;
            if (actionOne) {
                data = [selectedCatalogue];
            } else {
                const selectedNodes = gridApi.getSelectedNodes();
                const selectedData = selectedNodes.map((node) => node.data.uuid);
                data = selectedData;
            }
            switch (type) {
            case "activate":
                response = await CatalogueService
                    .putActivateCatalogues({ companyUuid, catalogueList: data });
                break;
            case "deactivate":
                response = await CatalogueService
                    .putDeactivateCatalogues({ companyUuid, catalogueList: data });
                break;
            default:
                break;
            }
            if (response.data.status === "OK") {
                showToast("success", response.data.message);
            } else {
                showToast("error", response.data.data);
            }
            reloadCatalogues();
        } catch (error) {
            showToast("error", error.response.data.message);
        }
    };

    const handleOnDrop = (data = []) => {
        setIsLoading(false);
        const massUpload = [];
        try {
            for (let i = 0; i < data.length; i++) {
                if (data[i].data[0] !== "" && !data[i].data[0].includes("Contracted Item")) {
                    const validationResult = CSVHelper.validateCSVListCatalogue(data, data[i].data, ["Contracted Item", "Item Code", "Item Name", "UOM Code", "Unit Price", "Item Category"]);
                    if (validationResult.missingField) {
                        throw new Error(`Validate Error: Please select valid  ${validationResult.missingField}`);
                    } else if (!validationResult.validate) {
                        throw new Error(CSVTemplate.NeededFields_Error);
                    }
                    const isActive = data[i].data[22].toLowerCase() === "yes";
                    const contracted = data[i].data[0].toLowerCase() === "yes";
                    const uploadItem = {
                        companyUuid,
                        contracted,
                        contractedRefNo: data[i].data[1],
                        catalogueItemCode: data[i].data[2],
                        catalogueItemName: data[i].data[3],
                        description: data[i].data[4] ?? "",
                        uomCode: data[i].data[5],
                        supplierCode: data[i].data[6] ?? "",
                        supplierName: data[i].data[7] ?? "",
                        itemCategory: data[i].data[8] ?? "",
                        itemModel: data[i].data[9] ?? "",
                        itemSize: data[i].data[10] ?? "",
                        itemBrand: data[i].data[11] ?? "",
                        glAccountNumber: data[i].data[12] ?? "",
                        currencyCode: data[i].data[13],
                        unitPrice: Number(data[i].data[14]) || 0,
                        contractedPrice: Number(data[i].data[15]) || 0,
                        validFrom: data[i].data[16],
                        validTo: data[i].data[17],
                        taxCode: data[i].data[18],
                        taxRate: Number(data[i].data[19]),
                        contractedQty: Number(data[i].data[20]) || 0,
                        projectCodes: data[i].data[21] ?? "",
                        isActive,
                        isManual: false
                    };
                    if (!uploadItem.supplierCode) delete uploadItem.supplierCode;
                    if (!uploadItem.supplierName) delete uploadItem.supplierName;
                    if (!uploadItem.glAccountNumber) delete uploadItem.glAccountNumber;
                    if (!uploadItem.validFrom) delete uploadItem.validFrom;
                    if (!uploadItem.validTo) delete uploadItem.validTo;

                    if (uploadItem.contracted && uploadItem.contractedPrice <= 0) {
                        throw new Error(`Row ${i}: Contracted Item must have Contracted Price greater than 0`);
                    }

                    massUpload.push(uploadItem);
                }
            }
        } catch (error) {
            message = error.message;
            showToast("error", message);
            setIsLoading(false);
            return;
        }

        const payload = {
            companyUuid,
            catalogueList: massUpload
        };
        CatalogueService.postMassUploadCatalogues(payload).then((res) => {
            setIsLoading(false);
            if (res.data.status === "OK") {
                message = "Mass Upload Done";
                showToast("success", message);
                reloadCatalogues();
            } else {
                message = res.data.message;
                showToast("error", message);
            }
        }).catch((error) => {
            message = error.response.data.message;
            showToast("error", message);
            setIsLoading(false);
        });
    };

    const handleOnError = (err) => {
        message = err;
        showToast("error", message);
    };

    const handleOpenDialog = (e) => {
        if (buttonRef?.current) {
            buttonRef?.current.open(e);
        }
    };

    const columnDefsDownload = () => [
        {
            headerName: t("CatalogueItemCode"),
            field: "catalogueItemCode"
        },
        {
            headerName: t("CatalogueItemName"),
            field: "catalogueItemName"
        },
        {
            headerName: t("CatalogueItemDescription"),
            field: "description"
        },
        {
            headerName: t("CatalogueSupplier"),
            field: "supplierName"
        },
        {
            headerName: t("CatalogueUOM"),
            field: "uomCode",
            width: 120
        },
        {
            headerName: t("Category"),
            field: "itemCategory"
        },
        {
            headerName: t("Model"),
            field: "itemModel",
            width: 120
        },
        {
            headerName: t("Size"),
            field: "itemSize",
            width: 120
        },
        {
            headerName: t("Brand"),
            field: "itemBrand",
            width: 120
        },
        {
            headerName: t("Contracted"),
            field: "contracted",
            valueGetter: ({ data }) => (data.contracted ? "Yes" : "No"),
            width: 120
        },
        {
            headerName: t("ContractReferenceNo"),
            field: "contractedRefNo",
            width: 180
        },
        {
            headerName: t("ContractedQuantity"),
            field: "contractedQty",
            cellStyle: { textAlign: "right" },
            valueGetter: ({ data }) => (data.contractedQty || ""),
            width: 170
        },
        {
            headerName: t("Project"),
            field: "projectCodes",
            width: 180
        },
        {
            headerName: t("G/L Code"),
            field: "glAccountNumber",
            width: 140
        },
        {
            headerName: t("CatalogueCurrency"),
            field: "currencyCode",
            width: 140
        },
        {
            headerName: t("ContractedUnitPrice"),
            field: "contractedPrice",
            cellStyle: { textAlign: "right" },
            valueGetter: ({ data }) => (data.contractedPrice || ""),
            width: 180
        },
        {
            headerName: t("CatalogueUUP"),
            field: "unitPrice",
            cellStyle: { textAlign: "right" },
            valueFormatter: (param) => param.value,
            width: 180
        },
        {
            headerName: t("CatalogueValidFrom"),
            field: "validFrom",
            valueFormatter: (param) => formatDateTime(param.value, CUSTOM_CONSTANTS.DDMMYYYY),
            width: 160
        },
        {
            headerName: t("CatalogueValidTo"),
            field: "validTo",
            valueFormatter: (param) => formatDateTime(param.value, CUSTOM_CONSTANTS.DDMMYYYY),
            width: 160
        },
        {
            headerName: t("CatalogueTaxCode"),
            field: "taxCode",
            width: 160
        },
        {
            headerName: t("CatalogueTaxPercentage"),
            field: "taxRate",
            cellStyle: { textAlign: "right" },
            valueFormatter: (param) => formatDisplayDecimal(param.value,
                CUSTOM_CONSTANTS.DEFAULT_PRECISION_NUMBER),
            width: 160
        },
        {
            headerName: t("CatalogueIsActive"),
            field: "isActive",
            valueGetter: ({ data }) => (data?.active || data?.isActive ? "Yes" : "No"),
            width: 160
        },
        {
            headerName: t("CatalogueUpdatedOn"),
            field: "updatedOn",
            valueGetter:
            (params) => (params.data.updatedOn ? params.data.updatedOn : params.data.createdOn),
            valueFormatter: (param) => formatDateString(
                param.value,
                CUSTOM_CONSTANTS.DDMMYYYHHmmss
            )
        },
        {
            field: "createdOn",
            valueFormatter: (param) => formatDateString(
                param.value,
                CUSTOM_CONSTANTS.DDMMYYYHHmmss
            ),
            hide: true
        },
        {
            headerName: t("Action"),
            field: "action",
            cellRenderer: "actionButton",
            resizable: true,
            filter: false,
            width: 140
        }
    ];

    return (
        <>
            <Container fluid>
                <Row className="mb-1">
                    <Col lg={12}>
                        <HeaderMain
                            title={t("CatalogueLOC")}
                            className="mb-3 mb-lg-3"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <div className="d-flex mb-2">
                            {
                                showAction && (
                                    <ButtonToolbar>
                                        <Button
                                            color="primary"
                                            className="mb-2 mr-2 px-3"
                                            onClick={() => {
                                                setActionOne(false);
                                                refActiveModal.current.toggleModal();
                                            }}
                                        >
                                            {t("Activate")}
                                        </Button>
                                        <Button
                                            color="danger"
                                            className="mb-2 mr-2 px-3"
                                            onClick={() => {
                                                setActionOne(false);
                                                refDeactivateModal.current.toggleModal();
                                            }}
                                        >
                                            {t("Deactivate")}
                                        </Button>
                                    </ButtonToolbar>
                                )
                            }
                            <ButtonToolbar className="ml-auto">
                                <div>
                                    <Button color="secondary" className="mb-2 mr-2 px-3" onClick={handleExport}>
                                        <i className="fa fa-download" />
                                        {` ${t("Download")}`}
                                    </Button>
                                </div>
                                {handleRolePermission?.write && (
                                    <>
                                        <UploadButton
                                            buttonRef={buttonRef}
                                            handleOnDrop={handleOnDrop}
                                            isLoading={isLoading}
                                            handleOnError={handleOnError}
                                            translation={t}
                                            handleOpenDialog={handleOpenDialog}
                                        />
                                        <div>
                                            <Button color="primary" className="mb-2 mr-2 px-3">
                                                <CSVLink
                                                    data={CSVTemplate.Catalogue_List_Data}
                                                    headers={CSVTemplate.Catalogue_List_Headers}
                                                    filename={
                                                        CSVTemplate.Catalogue_List_TemplatesFilename
                                                    }
                                                    style={{ color: "white" }}
                                                >
                                                    <i className="fa fa-download" />
                                                    {` ${t("Template")}`}
                                                </CSVLink>
                                            </Button>
                                        </div>
                                        <Link to={CATALOGUES_ROUTE.MANAGE_CATALOGUES_CREATE}>
                                            <Button color="primary" className="mb-2 mr-2 px-3">
                                                <i className="fa fa-plus" />
                                                {` ${t("Create New")}`}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </ButtonToolbar>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col lg={12}>
                        <CatalogueTable
                            write={handleRolePermission?.write}
                            lastFetch={lastFetch}
                            onGridReady={onGridReady}
                            selectCell={selectCell}
                            onSelectionChanged={onSelectionChanged}
                            companyUuid={companyUuid}
                        />
                    </Col>
                </Row>
                <Row className="d-none">
                    <Col
                        md={12}
                        lg={12}
                    >
                        <AgGridReact
                            className="ag-theme-custom-react"
                            columnDefs={columnDefsDownload()}
                            rowData={rowCatalogueDownload}
                            pagination
                            paginationPageSize={10}
                            onGridReady={onGridReadyDownload}
                            containerStyle={{ height: 590 }}
                            tooltipShowDelay={0}
                        />
                    </Col>
                </Row>
            </Container>
            <ActionModal
                ref={refActiveModal}
                title={t("Activation")}
                body={t("Are you sure you want to activate these catalogue items?")}
                button={t("Activate")}
                color="primary"
                action={() => handleAction("activate")}
            />
            <ActionModal
                ref={refDeactivateModal}
                title={t("Deactivation")}
                body={t("Are you sure you want to deactivate these catalogue items?")}
                button="Deactivate"
                color="danger"
                action={() => handleAction("deactivate")}
            />
        </>
    );
};
export default ListCatalogues;
