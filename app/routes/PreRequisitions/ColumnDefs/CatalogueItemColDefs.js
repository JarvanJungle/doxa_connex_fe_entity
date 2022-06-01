import i18next from "i18next";

const CatalogueItemColDefs = [
    {
        headerName: i18next.t("ItemCode"),
        field: "catalogueItemCode",
        checkboxSelection: (params) => {
            const { data, context } = params;
            const { selected } = context;
            if (!selected.length) return true;

            const selectedItem = selected.find((e) => e.itemCode === data.catalogueItemCode);
            if (selectedItem?.isNew) return true;

            const condition1 = data.isSelected;
            const condition2 = selected?.some((e) => e?.itemCode === data.catalogueItemCode);
            const condition3 = selected?.some((e) => {
                const elementContracted = e?.contracted || false;
                const dataContracted = data?.contracted || false;
                return elementContracted !== dataContracted;
            });
            return !condition1 && !condition2 && !condition3;
        },
        width: 180
    },
    {
        headerName: i18next.t("ItemName"),
        field: "catalogueItemName",
        width: 200
    },
    {
        headerName: i18next.t("Category"),
        field: "itemCategory",
        width: 160
    },
    {
        headerName: i18next.t("Description"),
        field: "description",
        width: 200
    },
    {
        headerName: i18next.t("Model"),
        field: "itemModel",
        width: 150
    },
    {
        headerName: i18next.t("Size"),
        field: "itemSize",
        width: 120
    },
    {
        headerName: i18next.t("Brand"),
        field: "itemBrand",
        width: 120
    },
    {
        headerName: i18next.t("UOMForecast"),
        field: "uomCode",
        width: 100
    },
    {
        headerName: i18next.t("Contracted?"),
        field: "contracted",
        valueGetter: ({ data }) => (data.contracted ? "Yes" : "No"),
        width: 120
    },
    {
        headerName: i18next.t("ContractReferenceNo"),
        field: "contractedRefNo",
        width: 180
    },
    {
        headerName: i18next.t("CompanyWide?"),
        field: "companyWide",
        valueGetter: ({ data }) => (!data.contracted ? "Yes" : "No"),
        width: 150
    },
    {
        headerName: i18next.t("RemainingDrawdownQuantity"),
        field: "remainDrawDownQty",
        cellStyle: { textAlign: "right" }
    },
    {
        headerName: i18next.t("ValidTo"),
        field: "validTo",
        width: 160
    },
    {
        headerName: i18next.t("Supplier"),
        field: "supplierName"
    }
];

export default CatalogueItemColDefs;
