import URL_CONFIG from "services/urlConfig";
import URL_MANAGE_PROJECT from "services/ProjectService/url";
import i18next from "i18next";
import { CONTRACT_MODULE_ROUTE } from "services/ContractModuleService";
import { MANAGE_ROLES_ROUTES } from "routes/EntityAdmin/ManageRoles";
import { MANAGE_APPROVAL_CONFIG_ROUTES } from "routes/EntityAdmin/ManageApprovalConfig";
import BANK_ACCOUNT_ROUTES_PATH from "routes/EntityAdmin/ManageBankAccount/routes";
import { DOXA_ADMIN_MANAGE_ROLES_ROUTES } from "routes/DoxaAdmin/ManageRoles";
import SUPPLIER_BANK_ACCOUNT_ROUTES_PATH from "routes/EntityAdmin/ManageSupplierBankAccount/routes";
import CATALOGUES_ROUTE from "routes/EntityAdmin/ManageCatalogue/route";
import { AP_SPECIALIST_ROUTES } from "routes/EntityAdmin/ManageAPSpecialist";
import PAYMENT_CYCLE_ROUTE from "../../routes/EntityAdmin/ManagePaymentCycle/routes";
import { RequisitionSideBar, CompanyAdminSideBar } from "./sidebars";
import FACILITY_ROUTES_PATH from "routes/EntityAdmin/ManageFacility/routes";

const APP_ROUTES = () => {
    const roleCheck = JSON.parse(localStorage.getItem("companyRole"));

    let companyAdminSideBar = [];
    if (roleCheck !== null && roleCheck.role.length !== 0) {
        for (let i = 0; i < roleCheck.role.length; i++) {
            if (roleCheck.role[i] === "COMPANY_ADMIN") {
                companyAdminSideBar = CompanyAdminSideBar;
            }
        }
    }

    return {
        entity: [
            {
                id: 1,
                icon: "fa fa-fw fa-plus-square",
                title: "Onboard Entity",
                path: URL_CONFIG.CREATE_ENTITY,
                children: []
            },
            {
                id: 2,
                icon: "fa fa-fw fa-list",
                title: "List of Entities",
                path: URL_CONFIG.LIST_ENTITIES,
                children: []
            },
            {
                id: "rbac-role",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageRoles"),
                path: DOXA_ADMIN_MANAGE_ROLES_ROUTES.ROLES_LIST,
                children: []
            },
            {
                id: "fi",
                icon: "fa fa-fw fa-list",
                title: "Manage Financial Institutions",
                path: URL_CONFIG.FI_LIST_ENTITIES,
                children: []
            }
        ],
        subEntity: [
            {
                id: 3,
                icon: "fa fa-fw fa-list",
                title: "Manage Sub-Entities",
                path: "",
                children: [
                    {
                        id: 1,
                        icon: "",
                        title: "Create Company",
                        path: URL_CONFIG.CREATE_COMPANY
                    },
                    {
                        id: 2,
                        icon: "",
                        title: "List of Companies",
                        path: URL_CONFIG.LIST_COMPANIES
                    }
                ]
            }
        ],
        COMPANY_ADMIN: companyAdminSideBar,
        PRE_REQUISITION: RequisitionSideBar,
        GeneralSetting: {
            id: "generals-settings",
            icon: "fa fa-fw fa-list",
            title: "General Setting",
            path: "",
            children: []
        },
        VendorManagement: {
            id: "vendors-management",
            icon: "fa fa-fw fa-list",
            title: "Vendor Management",
            path: "",
            children: []
        },
        ProjectManagement: {
            id: "projects-management",
            icon: "fa fa-fw fa-list",
            title: i18next.t("ProjectManagement"),
            path: "",
            children: []
        },
        PaymentManagement: {
            id: "payment-management",
            icon: "fa fa-fw fa-list",
            title: "Payment Management",
            path: "",
            children: []
        },
        ApprovalSetting: {
            id: "approval-setting",
            icon: "fa fa-fw fa-list",
            title: "Approval Setting",
            path: "",
            children: []
        },
        Requisitions: {
            id: "requisitions",
            icon: "fa fa-fw fa-list",
            title: "Requisitions",
            path: "",
            children: []
        },
        Invoices: {
            id: "invoices",
            icon: "fa fa-fw fa-list",
            title: "Invoices",
            path: "",
            children: []
        },
        CreditNotes: {
            id: "credit-notes",
            icon: "fa fa-fw fa-list",
            title: "Credit Notes",
            path: "",
            children: []
        },
        Payments: {
            id: "payments",
            icon: "fa fa-fw fa-list",
            title: "Payments",
            path: "",
            children: []
        },
        PreRequisitions: {
            id: "pre-requisitions",
            icon: "fa fa-fw fa-calendar-check-o",
            title: "Pre Purchase Requisition",
            path: "",
            children: []
        },
        PPR: [
            {
                id: "raise-pre-requisitions",
                title: "Raise Pre-Requisition",
                path: URL_CONFIG.PPR_ROUTING.RAISE_PRE_REQUISITIONS,
                children: []
            },
            {
                id: "purchase-pre-requisitions-list",
                title: "Purchase Pre-Requisitions List",
                path: URL_CONFIG.PPR_ROUTING.PURCHASE_PRE_REQUISITIONS_LIST,
                children: []
            }
        ],
        OrdersList: {
            id: "orderslist",
            icon: "fa fa-fw fa-list",
            title: "Orders List",
            path: "",
            children: []
        },
        catalogue: [
            {
                id: "catelogue",
                icon: "fa fa-fw fa-list",
                title: "Manage Catalogue",
                path: "",
                children: [
                    {
                        id: "list-of-catalogues",
                        icon: "fa fa-fw fa-list",
                        title: "List of Catalogue",
                        path: CATALOGUES_ROUTE.MANAGE_CATALOGUES,
                        children: []
                    },
                    {
                        id: "list-of-manual-catalogue",
                        icon: "fa fa-fw fa-list",
                        title: "List of Manual Catalogue",
                        path: CATALOGUES_ROUTE.MANAGE_MANUAL_CATALOGUES,
                        children: []
                    }
                ]
            }
        ],
        managePrefix: [
            {
                id: "managePrefix",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageDocumentPrefix"),
                path: URL_CONFIG.DOCUMENT_PREFIX_ROUTES.LIST_DOCUMENT_PREFIXES,
                children: []
            }
        ],
        apSpecialist: [
            {
                id: "approval-matrix",
                icon: "fa fa-fw fa-list",
                title: "Manage AP Specialist",
                path: AP_SPECIALIST_ROUTES.AP_SPECIALIST_LIST,
                children: []
            }
        ],
        contract: [
            {
                id: "contract-request-listing",
                title: "Contract Request Listing",
                path: CONTRACT_MODULE_ROUTE.CONTRACT_REQUEST_LIST,
                children: []
            },
            {
                id: "contract-request-submit",
                title: "Create Contract Request",
                path: CONTRACT_MODULE_ROUTE.CONTRACT_REQUEST_FORM,
                children: []
            },
            {
                id: "contract-listing",
                title: "Contract Listing",
                path: CONTRACT_MODULE_ROUTE.CONTRACT_LIST,
                children: []
            }
        ],
        supplierBankAccount: [
            {
                id: "supplier-bank-account",
                icon: "fa fa-fw fa-list",
                title: "Manage Supplier Bank Account",
                path: SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST,
                children: []
            }
        ],
        bankAccount: [
            {
                id: 2,
                icon: "fa fa-fw fa-list",
                title: "Manage Bank Account",
                path: BANK_ACCOUNT_ROUTES_PATH.BANK_ACCOUNT_LIST,
                children: []
            }
        ],
        Contracts: {
            id: "contract",
            icon: "fa fa-fw fa-list",
            title: "Contracts",
            path: "",
            children: []
        },
        RequestsPendingConversion: {
            id: "requests-pending-conversion",
            icon: "fa fa-fw fa-list",
            title: "Requests Pending Conversion",
            path: "",
            children: []
        },
        LrsToBeConverted: [
            {
                id: "ltbc",
                title: "LRs To Be Converted",
                path: "",
                children: []
            }
        ],
        Receipts: {
            id: "receipts",
            icon: "fa fa-fw fa-list",
            title: "Receipts",
            path: "",
            children: []
        },
        INVF: {
            id: "invf",
            icon: "fa fa-fw fa-list",
            title: "Invoice Financing",
            path: "",
            children: []
        },
        DEVF: {
            id: "devf",
            icon: "fa fa-fw fa-list",
            title: "Developer Financing",
            path: "",
            children: []
        },
        WR: [
            {
                id: "wr",
                icon: "fa fa-fw fa-list",
                title: "Work Requisition",
                path: "",
                children: []
            }
        ],
        WO: [
            {
                id: "dwl",
                title: "Draft WOs List",
                path: "",
                children: []
            },
            {
                id: "wl",
                title: "WOs List",
                path: "",
                children: []
            }
        ],
        BC: {
            id: "bc",
            icon: "fa fa-fw fa-list",
            title: "BC List",
            path: "",
            children: []
        },
        VR: {
            id: "vr",
            icon: "fa fa-fw fa-list",
            title: "VR List",
            path: "",
            children: []
        },
        dwr: [
            {
                id: "dwr",
                icon: "fa fa-fw fa-list",
                title: "DVWR List",
                path: URL_CONFIG.DW_REQUEST_ROUTES.LIST_DW_REQUESTS,
                children: []
            }
        ],
        address: [
            {
                id: "address",
                icon: "fa fa-map-marker",
                title: "Manage Address",
                path: URL_CONFIG.LIST_ADDRESSES,
                children: []
            }
        ],
        project: [
            {
                id: "project",
                icon: "fa fa-fw fa-list",
                title: "List of Project",
                path: URL_MANAGE_PROJECT.LIST_PROJECT,
                children: []
            }
        ],
        trade: [
            {
                id: "trade",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageTradeCode"),
                path: URL_CONFIG.LIST_MANAGE_PROJECT_TRADE,
                children: []
            }
        ],
        currency: [
            {
                id: "currency",
                icon: "fa fa-fw fa-money",
                title: i18next.t("ManageCurrency"),
                path: URL_CONFIG.LIST_CURRENCIES,
                children: []
            }
        ],
        documentTemplate: [
            {
                id: "documentTemplate",
                icon: "fa fa-fw fa-list",
                title: i18next.t("Manage Document Template"),
                path: URL_CONFIG.MANAGE_DOCUMENT_TEMPLATE,
                children: []
            }
        ],
        uom: [
            {
                id: "uom",
                icon: "fa fa-fw fa-list",
                title: "Manage UOM",
                path: URL_CONFIG.LIST_UOM,
                children: []
            }
        ],
        tax: [
            {
                id: "tax",
                icon: "fa fa-fw fa-list",
                title: "Manage Tax",
                path: URL_CONFIG.LIST_TAX_RECORDS,
                children: []
            }
        ],
        connection: [
            {
                id: "connection",
                icon: "fa fa-fw fa-list",
                title: "Manage Connection",
                path: URL_CONFIG.LIST_CONNECTION,
                children: []
            }
        ],
        gl: [
            {
                id: "gl",
                icon: "fa fa-fw fa-list",
                title: "Manage G/L Account",
                path: URL_CONFIG.LIST_GL,
                children: []
            }
        ],
        paymentTerm: [
            {
                id: "paymentTerm",
                icon: "fa fa-fw fa-list",
                title: "Manage Payment Term",
                path: URL_CONFIG.LIST_PAYMENT_TERMS,
                children: []
            }
        ],
        paymentCycle: [
            {
                id: "payment-cycle",
                icon: "fa fa-fw fa-list",
                title: "Manage Payment Cycle",
                path: PAYMENT_CYCLE_ROUTE.PAYMENT_CYCLES_LIST,
                children: []
            }
        ],
        pms: [
            {
                id: "pms",
                icon: "fa fa-fw fa-list",
                title: "Manage Payment Setting",
                path: "/payment/payment-setting",
                children: []
            }
        ],
        approvalConfiguration: [
            {
                id: "approvalConfiguration",
                icon: "fa fa-fw fa-list",
                title: "Manage Approval Configuration",
                path: MANAGE_APPROVAL_CONFIG_ROUTES.APPROVAL_CONFIG,
                children: []
            }
        ],
        facility: [
            {
                id: "facility",
                icon: "fa fa-fw fa-list",
                title: "Manage Facility",
                path: FACILITY_ROUTES_PATH.FACILITY_LIST,
                children: []
            }
        ],
        approvalMatrix: [
            {
                id: "approval-matrix",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageApprovalMatrix"),
                path: URL_CONFIG.LIST_APPROVAL_MATRIX,
                children: []
            },
            {
                id: 17,
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageApprovalGroups"),
                path: URL_CONFIG.LIST_APPROVAL_GROUPS,
                children: []
            }
        ],
        adminMatrix: [
            {
                id: "admin-matrix",
                icon: "fa fa-fw fa-list",
                title: "Manage Admin Matrix",
                path: URL_CONFIG.MANAGE_ADMIN_MATRIX,
                children: []
            }
        ],
        userMatrix: [
            {
                id: "user-matrix",
                icon: "fa fa-fw fa-list",
                title: "Manage User Matrix",
                path: "",
                children: []
            }
        ],
        cpUser: [
            {
                id: "cp-user",
                icon: "fa fa-user",
                title: "Manage Company User",
                path: URL_CONFIG.LIST_COMPANY_USERS,
                children: []
            }
        ],
        user: [
            {
                id: "user",
                icon: "fa fa-users",
                title: "Manage Organization Users",
                path: URL_CONFIG.LIST_ORGANIZATION_USERS,
                children: []
            }
        ],
        projectForeCast: [
            {
                id: "project-forecast",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageProjectForecast"),
                path: URL_CONFIG.LIST_PROJECT_FORECAST,
                children: []
            }
        ],
        vendor: [
            {
                id: "vendor",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageExtVendor"),
                path: URL_CONFIG.LIST_EXT_VENDOR,
                children: []
            }
        ],
        featureMatrix: [
            {
                id: "featureMatrix",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageFeaturesMatrix"),
                path: URL_CONFIG.FEATURES_MATRIX_ROUTES.LIST_FEATURES_MATRIX,
                children: []
            }
        ],
        category: [
            {
                id: "category",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageCategory"),
                path: "/category/list",
                children: []
            }
        ],
        ContractorProgressiveClaims: {
            id: "contractor-progressive-claims",
            icon: "fa fa-fw fa-list",
            title: "Contractor Progressive Claims",
            path: "",
            children: []
        },
        dpc: [
            {
                id: "dpc-list",
                icon: "fa fa-fw fa-list",
                title: "Draft Progress Claims List",
                path: URL_CONFIG.PROGRESSIVE_ROUTES.DRAFT_PROGRESS_CLAIM_LIST,
                children: []
            },
            {
                id: "dpc-create",
                icon: "fa fa-fw fa-list",
                title: "Create Draft Progress Claim",
                path: URL_CONFIG.PROGRESSIVE_ROUTES.SUBMIT_DRAFT_CLAIM,
                children: []
            },
            {
                id: "progress-claim-list",
                icon: "fa fa-fw fa-list",
                title: "Progressive Claims List",
                path: URL_CONFIG.PROGRESSIVE_ROUTES.OFFICIAL_PROGRESS_CLAIM_LIST,
                children: []
            },
            {
                id: "pc-create-official",
                icon: "fa fa-fw fa-list",
                title: "Create Official Progress Claim",
                path: URL_CONFIG.PROGRESSIVE_ROUTES.CREATE_DEVELOPER_PROGRESS_CLAIM,
                children: []
            },
            {
                id: "architect-progress-claim-list",
                icon: "fa fa-fw fa-list",
                title: "Architect Progress Claims List",
                path: URL_CONFIG.PROGRESSIVE_ROUTES.ARCHITECT_OFFICIAL_PROGRESS_CLAIM_LIST,
                children: []
            }
        ],
        rbacRole: [
            {
                id: "rbac-role",
                icon: "fa fa-fw fa-list",
                title: i18next.t("ManageRoles"),
                path: MANAGE_ROLES_ROUTES.ROLES_LIST,
                children: []
            }
        ]
    };
};

// Object.freeze(APP_ROUTES);

export default APP_ROUTES;
