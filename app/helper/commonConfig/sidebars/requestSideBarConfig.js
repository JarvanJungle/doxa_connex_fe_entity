import URL_CONFIG from "services/urlConfig";

const RequisitionSideBar = [
    {
        id: "pre-requisitions",
        icon: "fa fa-fw fa-calendar-check-o",
        title: "Pre-Requisitions",
        path: "",
        children: [
            {
                id: "raise-pre-requisitions",
                title: "Raise Pre-Requisition",
                path: URL_CONFIG.PPR_ROUTING.RAISE_PRE_REQUISITIONS,
                children: []
            },
            // {
            //     id: "rental-pre-requisitions-list",
            //     title: "Rental Pre-Requisitions List",
            //     path: "",
            //     children: []
            // },
            {
                id: "purchase-pre-requisitions-list",
                title: "Purchase Pre-Requisitions List",
                path: URL_CONFIG.PPR_ROUTING.PURCHASE_PRE_REQUISITIONS_LIST,
                children: []
            }
        ]
    },
];

export default RequisitionSideBar;
