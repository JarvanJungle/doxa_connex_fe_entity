import URL_CONFIG from "services/urlConfig";
import i18next from "i18next";
import TwoFA from "./Pages/TwoFA";
import TwoFAVerification from "./Pages/TwoFAVerification";
import TwoFALogin from "./Pages/TwoFALogin";
import Login from "./Pages/Login";
import OthersPassword from "./Pages/OthersPassword";
import ResetOwnPassword from "./Pages/ResetOwnPassword";
import Settings from "./Pages/Settings";

import CreateCompany from "./EntityAdmin/ManageCompany/CreateCompany";
import ListCompany from "./EntityAdmin/ManageCompany/ListCompany";
import CompanyDetails from "./EntityAdmin/ManageCompany/CompanyDetails";

import CreateCurrency from "./EntityAdmin/ManageCurrency/CreateCurrency";
import ListCurrency from "./EntityAdmin/ManageCurrency/ListCurrency";
import CurrencyDetails from "./EntityAdmin/ManageCurrency/CurrencyDetails";

import SetupPassword from "./Pages/SetupPassword";
import Success from "./Pages/Success/Success";
import Error404 from "./Pages/Error404/Error404";
import Dashboard from "./EntityAdmin/Dashboard";
import ListEntityUsers from "./Entities/ListEntityUsers";
import UserDetails from "./Entities/UserDetails";
import CreateUser from "./Entities/CreateUser";
import ManageDocumentTemplate from "./EntityAdmin/ManageDocumentTemplate";
import ListAddresses from "./Entities/ManageAddress/ListAddresses";
import AddressDetails from "./Entities/ManageAddress/AddressDetails";

import ListGL from "./EntityAdmin/ManageGL/ListGL/ListGL";
import GLDetails from "./EntityAdmin/ManageGL/GLDetails/GLDetails";

import ListConnection from "./EntityAdmin/ManageConnection/ListConnection";
import ConnectionDetails from "./EntityAdmin/ManageConnection/ConnectionDetails";

import ListUOM from "./EntityAdmin/ManageUOM/ListUOM";
import UOMDetails from "./EntityAdmin/ManageUOM/UOMDetails";

import ListTaxRecord from "./EntityAdmin/ManageTaxRecord/ListTaxRecord";
import TaxRecordDetails from "./EntityAdmin/ManageTaxRecord/TaxRecordDetails";

import CatalogueDetails from "./EntityAdmin/ManageCatalogue/CatalogueDetails/CatalogueDetails";
import ListCatalogues from "./EntityAdmin/ManageCatalogue/ListCatalogues/ListCatalogues";

import ListProjectTrade from "./EntityAdmin/ManageProjectTrade/View/ListProjectTrade";
import ListProjectTradeDetail from "./EntityAdmin/ManageProjectTrade/Detail/ListProjectTradeDetail";

import { ListProjectForecast, ProjectForecastDetails, ProjectForecast } from "./EntityAdmin/ManageProjectForeCast";
import { ListVendor, VendorDetails } from "./EntityAdmin/ManageExternalVendor";
import { CreateProject, ListProject, ProjectDetails } from "./EntityAdmin/ManageProject";

import ListPaymentTerms from "./EntityAdmin/ManagePaymentTerm/ListPaymentTerms/ListPaymentTerms";
import PaymentTermDetails from "./EntityAdmin/ManagePaymentTerm/PaymentTermDetails/PaymentTermDetails";
import ListApprovalGroups from "./EntityAdmin/ManageApprovalGroup/ListApprovalGroups/ListApprovalGroups";
import ApprovalGroupDetails from "./EntityAdmin/ManageApprovalGroup/ApprovalGroupDetails/ApprovalGroupDetails";
import ListApprovalMatrix from "./EntityAdmin/ManageApprovalMatrix/ListApprovalMatrix/ListApprovalMatrix";
import ApprovalMatrixDetails from "./EntityAdmin/ManageApprovalMatrix/ApprovalMatrixDetails/ApprovalMatrixDetails";
import FeaturesMatrix from "./EntityAdmin/ManageFeaturesMatrix/FeaturesMatrix";

import DocumentPrefixDetails from "./EntityAdmin/ManageDocumentPrefix/DocumentPrefixDetails/DocumentPrefixDetails";
import DOCUMENT_PREFIX_ROUTES from "./EntityAdmin/ManageDocumentPrefix/routes";
import ListDocumentPrefixes from "./EntityAdmin/ManageDocumentPrefix/ListDocumentPrefixes/ListDocumentPrefixes";

import CategoryDetails from "./EntityAdmin/ManageCategory/CategoryDetails";
import ListCategory from "./EntityAdmin/ManageCategory/ListCategory";
import ListManualCatalogues from "./EntityAdmin/ManageCatalogue/ListManualCatalogues/ListManualCatalogues";
import ListBankAccount from "./EntityAdmin/ManageBankAccount/ListBankAccount";
import BankAccountDetail from "./EntityAdmin/ManageBankAccount/BankAccountDetail/BankAccountDetail";
import SupplierBankAccountList from "./EntityAdmin/ManageSupplierBankAccount/SupplierBankAccountList";
import SupplierBankAccountDetails from "./EntityAdmin/ManageSupplierBankAccount/SupplierBankAccountDetails";

import CATALOGUES_ROUTE from "./EntityAdmin/ManageCatalogue/route";

import {
    AP_SPECIALIST_ROUTES,
    ListAPSpecialist,
    APSpecialistDetails
} from "./EntityAdmin/ManageAPSpecialist";
import PaymentSetting from "./EntityAdmin/ManagePaymentTerm/PaymentSetting/PaymentSetting";
import PAYMENT_CYCLE_ROUTE from "./EntityAdmin/ManagePaymentCycle/routes";
import PaymentCyclesList from "./EntityAdmin/ManagePaymentCycle/PaymentCyclesList/PaymentCyclesList";
import CreatePaymentCycle from "./EntityAdmin/ManagePaymentCycle/CreatePaymentCycle/CreatePaymentCycle";
import UpdatePaymentCycle from "./EntityAdmin/ManagePaymentCycle/UpdatePaymentCycle/UpdatePaymentCycle";
import {
    RolesList,
    RoleDetails,
    MANAGE_ROLES_ROUTES
} from "./EntityAdmin/ManageRoles";
import CompanyDetailsCurrent from "./EntityAdmin/ManageCompany/CompanyDetails/CompanyDetailsCurrent";
import { ManageApprovalConfig, MANAGE_APPROVAL_CONFIG_ROUTES } from "./EntityAdmin/ManageApprovalConfig";

import {
    DoxaAdminRolesList,
    DoxaAdminRoleDetails,
    DOXA_ADMIN_MANAGE_ROLES_ROUTES
} from "./DoxaAdmin/ManageRoles";

import ViewEntityDetails from "./DoxaAdmin/ViewEntityDetails";
import ListEntity from "./DoxaAdmin/ListEntity";
import CreateEntity from "./DoxaAdmin/CreateEntity";

import ListFacility from "./EntityAdmin/ManageFacility/ListFacility";
import CreateFacility from "./EntityAdmin/ManageFacility/CreateFacility";

import ManageFinancialInstitutions from "./DoxaAdmin/FinancialInstitutions/ManageFinancialInstitutions/ManageFinancialInstitutions"; 
import ViewFIEntityDetails from "./DoxaAdmin/FinancialInstitutions/ViewFIEntityDetails";
import CreateFinancialInstitution from "./DoxaAdmin/FinancialInstitutions/CreateFinancialInstitution/CreateFinancialInstitution";

const PaymentManagementRoutes = [
    // manage payment terms
    {
        path: "/payment-terms", isProtected: true, name: i18next.t("ListOfPaymentTerms"), Component: ListPaymentTerms, render: true
    },
    {
        path: "/create-payment-terms", isProtected: true, name: i18next.t("CreateNewPaymentTerm"), Component: PaymentTermDetails, render: true
    },
    {
        path: "/payment-term-details", isProtected: true, name: "Payment Term Details", Component: PaymentTermDetails, render: true
    },
    {
        path: "/approval-groups", isProtected: true, name: i18next.t("ListOfApprovalGroups"), Component: ListApprovalGroups, render: true
    },
    {
        path: "/details-approval-groups", isProtected: true, name: i18next.t("ApprovalGroupDetails"), Component: ApprovalGroupDetails, render: true
    },
    {
        path: "/create-approval-groups", isProtected: true, name: i18next.t("CreateApprovalGroup"), Component: ApprovalGroupDetails, render: true
    },
    // manage payment cycle
    {
        path: PAYMENT_CYCLE_ROUTE.PAYMENT_CYCLES_LIST, isProtected: true, name: i18next.t("ListOfPaymentCycles"), Component: PaymentCyclesList
    },
    {
        path: PAYMENT_CYCLE_ROUTE.UPDATE_PAYMENT_CYCLE, isProtected: true, name: i18next.t("PaymentCycleDetails"), Component: UpdatePaymentCycle
    },
    {
        path: PAYMENT_CYCLE_ROUTE.CREATE_PAYMENT_CYCLE, isProtected: true, name: i18next.t("CreateNewPaymentCycle"), Component: CreatePaymentCycle
    },
    {
        path: "/payment/payment-setting", isProtected: true, name: i18next.t("PaymentSetting"), Component: PaymentSetting
    }
];

const GeneralSettingRoutes = [
    // Mange G/L Account
    {
        path: "/gls", isProtected: true, name: "List of G/L Account", Component: ListGL, render: true
    },
    {
        path: "/gl-details", isProtected: true, name: "G/L Account Details", Component: GLDetails, render: true
    },
    {
        path: "/create-gl", isProtected: true, name: "Create G/L Account", Component: GLDetails, render: true
    },
    // Manage Address
    {
        path: "/company/addresses", isProtected: true, name: "Company Address List", Component: ListAddresses, render: true
    },
    {
        path: "/company/address-details", isProtected: true, name: "Company Address Details", Component: AddressDetails, render: true
    },
    {
        path: "/company/create-address", isProtected: true, name: "Create Company Address", Component: AddressDetails, render: true
    },
    // Manage Currency
    {
        path: "/currencies", isProtected: true, name: "List of Currency", Component: ListCurrency
    },
    {
        path: "/create-currency", isProtected: true, name: "Create Currency", Component: CreateCurrency
    },
    {
        path: "/currency-details", isProtected: true, name: "Currency Details", Component: CurrencyDetails
    },
    // Manage UOM
    {
        path: "/uom/list", isProtected: true, name: "List UOM", Component: ListUOM, render: true
    },
    {
        path: "/create-uom", isProtected: true, name: "Create UOM", Component: UOMDetails
    },
    {
        path: "/uom/details", isProtected: true, name: "UOM Details", Component: UOMDetails
    },
    // Manage Catalogue
    {
        path: CATALOGUES_ROUTE.MANAGE_CATALOGUES, isProtected: true, name: "List of Catalogue", Component: ListCatalogues, render: true
    },
    {
        path: CATALOGUES_ROUTE.MANAGE_MANUAL_CATALOGUES, isProtected: true, name: "List of Manual Catalogue", Component: ListManualCatalogues, render: true
    },
    {
        path: CATALOGUES_ROUTE.MANAGE_CATALOGUES_DETAILS, isProtected: true, name: "Catalogue Details", Component: CatalogueDetails, render: true
    },
    {
        path: CATALOGUES_ROUTE.MANAGE_CATALOGUES_CREATE, isProtected: true, name: "Create Catalogue Item", Component: CatalogueDetails, render: true
    },
    // Manage Tax
    {
        path: "/tax-records", isProtected: true, name: "List of Tax Record", Component: ListTaxRecord, render: true
    },
    {
        path: "/tax-record-details", isProtected: true, name: "Tax Record Details", Component: TaxRecordDetails, render: true
    },
    {
        path: "/create-tax-record", isProtected: true, name: "Create Tax Record", Component: TaxRecordDetails, render: true
    },
    // Manage Document Prefix
    {
        path: DOCUMENT_PREFIX_ROUTES.LIST_DOCUMENT_PREFIXES, isProtected: true, name: i18next.t("ListOfDocumentPrefixes"), Component: ListDocumentPrefixes, render: true
    },
    {
        path: DOCUMENT_PREFIX_ROUTES.DOCUMENT_PREFIX_DETAILS, isProtected: true, name: i18next.t("DocumentPrefixDetails"), Component: DocumentPrefixDetails, render: true
    },
    // Manage Category
    {
        path: "/category/list", isProtected: true, name: "List of Category", Component: ListCategory, render: true
    },
    {
        path: "/category/details", isProtected: true, name: "Category Details", Component: CategoryDetails, render: true
    },
    {
        path: "/category/create", isProtected: true, name: "Create New Category", Component: CategoryDetails, render: true
    },
    {
        path: URL_CONFIG.MANAGE_DOCUMENT_TEMPLATE, name: "Manage Document Template", isProtected: true, Component: ManageDocumentTemplate
    }
];

const ProjectMangementRoutes = [
    // Manage Trade Code
    {
        path: "/list-trade-code", isProtected: true, name: "Manage Trade Code", Component: ListProjectTrade, render: true
    },
    {
        path: "/create-trade-code", isProtected: true, name: "Create New Trade Code", Component: ListProjectTradeDetail, render: true
    },
    {
        path: "/trade-code-details", isProtected: true, name: "Trade Code Details", Component: ListProjectTradeDetail, render: true
    },
    // List of Project
    {
        path: "/manage-project", isProtected: true, name: i18next.t("ListOfProject"), Component: ListProject, render: true
    },
    {
        path: "/create-project", isProtected: true, name: i18next.t("Create New Project"), Component: CreateProject, render: true
    },
    {
        path: "/project-details", isProtected: true, name: i18next.t("ProjectDetails"), Component: ProjectDetails, render: true
    },
    // Manage Project Forecast
    {
        path: "/list-project-forecast", isProtected: true, name: i18next.t("ManageProjectForecast"), Component: ListProjectForecast, render: true
    },
    {
        path: "/list-project-forecast/details", isProtected: true, name: i18next.t("ProjectForecastUpdate"), Component: ProjectForecastDetails, render: true
    },
    {
        path: "/list-project-forecast/forecast", isProtected: true, name: i18next.t("ForecastTrade"), Component: ProjectForecast, render: true
    }
];

const VendorManagementRoutes = [
    // Manage External Vendor
    {
        path: "/list-ext-vendor", isProtected: true, name: i18next.t("ManageExtVendor"), Component: ListVendor, render: true
    },
    {
        path: "/external-vendor/create", isProtected: true, name: i18next.t("CreateExtVendor"), Component: VendorDetails, render: true
    },
    {
        path: "/external-vendor/details", isProtected: true, name: i18next.t("ExtVendorEdit"), Component: VendorDetails, render: true
    },
    // Manage Connection
    {
        path: "/connections", isProtected: true, name: i18next.t("ManageConnection"), Component: ListConnection, render: true
    },
    {
        path: "/connections/connection-details", isProtected: true, name: "Connection Details", Component: ConnectionDetails, render: true
    },
    // Manage AP Specialist
    {
        path: AP_SPECIALIST_ROUTES.AP_SPECIALIST_LIST, isProtected: true, name: i18next.t("ManageAPSpecialist"), Component: ListAPSpecialist
    },
    {
        path: AP_SPECIALIST_ROUTES.AP_SPECIALIST_CREATE, isProtected: true, name: i18next.t("AddNewAPSpecialistGrouping"), Component: APSpecialistDetails
    },
    {
        path: AP_SPECIALIST_ROUTES.AP_SPECIALIST_DETAILS, isProtected: true, name: i18next.t("APSpecialistDetails"), Component: APSpecialistDetails
    }
];

const ManageCompanyUserRoutes = [
    {
        path: "/company/users", isProtected: true, name: "Company Users List", Component: ListEntityUsers, render: true
    },
    {
        path: "/company-users/create", isProtected: true, name: i18next.t("CreateNewCompanyUser"), Component: CreateUser, render: true
    },
    {
        path: "/company-users/details", isProtected: true, name: i18next.t("CompanyUserDetails"), Component: UserDetails, render: true
    }
];

const ManageRoleRoutes = [
    {
        path: MANAGE_ROLES_ROUTES.ROLES_LIST, isProtected: true, name: i18next.t("ListOfRoles"), Component: RolesList
    },
    {
        path: MANAGE_ROLES_ROUTES.CREATE_NEW_ROLE, isProtected: true, name: i18next.t("CreateNewRole"), Component: RoleDetails
    },
    {
        path: MANAGE_ROLES_ROUTES.ROLE_DETAILS, isProtected: true, name: i18next.t("RoleDetails"), Component: RoleDetails
    }
];

const ManageSubEntitiesRoutes = [
    // Create Company
    {
        path: "/create-company", isProtected: true, name: "Create New Company", Component: CreateCompany
    },
    // List of Companies
    {
        path: "/companies", isProtected: true, name: "List of Companies", Component: ListCompany
    },
    {
        path: "/company-details", isProtected: true, name: "Company Details", Component: CompanyDetails
    }
];

const ManageOrganizationUsersRoutes = [
    {
        path: "/organization/users/list", isProtected: true, name: "Organization Users List", Component: ListEntityUsers, render: true
    },
    {
        path: "/organization/users/details", isProtected: true, name: "Organization User Details", Component: UserDetails, render: true
    },
    {
        path: "/organization/users/create", isProtected: true, name: "Create New Organization User", Component: CreateUser, render: true
    },
    {
        path: "/users/password/reset/:uuid", name: "Reset Password", isProtected: true, Component: OthersPassword, render: true
    }
];

const ManageFeatureMatrixRoutes = [
    {
        path: "/features-matrix", isProtected: true, name: i18next.t("ManageFeatureMatrix"), Component: FeaturesMatrix, render: true
    }
];

const ApprovalSettingRoutes = [
    // Manage Approval Matrix
    {
        path: URL_CONFIG.LIST_APPROVAL_MATRIX, isProtected: true, name: i18next.t("ListOfApprovals"), Component: ListApprovalMatrix, render: true
    },
    {
        path: URL_CONFIG.CREATE_APPROVAL_MATRIX, isProtected: true, name: i18next.t("CreateApproval"), Component: ApprovalMatrixDetails, render: true
    },
    {
        path: URL_CONFIG.APPROVAL_MATRIX_DETAILS, isProtected: true, name: i18next.t("ApprovalDetails"), Component: ApprovalMatrixDetails, render: true
    },
    // Manage Approval Group
    // { path: URL_CONFIG.LIST_APPROVAL_GROUPS, isProtected: true, name: i18next.t("ListOfApprovals"), Component: ListApprovalMatrix, render: true },
    // { path: URL_CONFIG.CREATE_APPROVAL_GROUPS, isProtected: true, name: i18next.t("CreateApproval"), Component: ApprovalMatrixDetails, render: true },
    // { path: URL_CONFIG.APPROVAL_GROUPS_DETAILS, isProtected: true, name: i18next.t("ApprovalDetails"), Component: ApprovalMatrixDetails, render: true },

    // Manage Approval Configuration
    {
        path: MANAGE_APPROVAL_CONFIG_ROUTES.APPROVAL_CONFIG, isProtected: false, name: i18next.t("ApprovalConfiguration"), Component: ManageApprovalConfig
    }
];

const ManageSupplierBankAccountRoutes = [
    {
        path: URL_CONFIG.SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST, isProtected: true, name: "List of Supplier Bank Account", Component: SupplierBankAccountList, render: true
    },
    {
        path: URL_CONFIG.SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_CREATE, isProtected: true, name: "Add Supplier Bank Account", Component: SupplierBankAccountDetails, render: true
    },
    {
        path: URL_CONFIG.SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_DETAILS, isProtected: true, name: "Supplier Bank Account Details", Component: SupplierBankAccountDetails, render: true
    }
];

const ManageBankAccountRoutes = [
    {
        path: URL_CONFIG.BANK_ACCOUNT_ROUTES_PATH.BANK_ACCOUNT_LIST, isProtected: true, name: "List of Bank Account", Component: ListBankAccount, render: true
    },
    {
        path: URL_CONFIG.BANK_ACCOUNT_ROUTES_PATH.BANK_ACCOUNT_CREATE, isProtected: true, name: "Add Bank Account", Component: BankAccountDetail, render: true
    },
    {
        path: URL_CONFIG.BANK_ACCOUNT_ROUTES_PATH.BANK_ACCOUNT_DETAILS, isProtected: true, name: "Bank Account Details", Component: BankAccountDetail, render: true
    }
];

const ManageFacilityRoutes = [
    {
        path: URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST, isProtected: true, name: "Manage Facility", Component: ListFacility, render: true
    },

    {
        path: URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_CREATE, isProtected: true, name: "Manage Facility", Component: CreateFacility, render: true
    },

    {
        path: URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_DETAILS, isProtected: true, name: "Manage Facility", Component: CreateFacility, render: true
    },
];

const FinancialInstitutionsRoutes = [
    {
        path: "/fi-list", doxaAdmin: true, name: "Manage Financial Institutions", Component: ManageFinancialInstitutions, render: true
    },
    {
        path: "/fi-details", doxaAdmin: true, name: "Financial Institution Detail", Component: ViewFIEntityDetails, render: true
    },
    {
        path: "/create-fi", doxaAdmin: true, name: "Onboard New Financial Institution", Component: CreateFinancialInstitution, render: true
    },
];

const DoxaAdminListOfEntity = [
    {
        path: "/entities", doxaAdmin: true, name: "List of Entities", Component: ListEntity
    },
    {
        path: "/create-entity", doxaAdmin: true, name: "Onboard New Entity", Component: CreateEntity
    },
    {
        path: "/entity-details", doxaAdmin: true, name: "Entity Details", Component: ViewEntityDetails
    }
];

const DoxaAdminManageRole = [
    {
        path: DOXA_ADMIN_MANAGE_ROLES_ROUTES.ROLES_LIST, isProtected: true, name: "DoxaAdminListOfRoles", Component: DoxaAdminRolesList
    },
    {
        path: DOXA_ADMIN_MANAGE_ROLES_ROUTES.CREATE_NEW_ROLE, isProtected: true, name: "DoxaAdminCreateNewRole", Component: DoxaAdminRoleDetails
    },
    {
        path: DOXA_ADMIN_MANAGE_ROLES_ROUTES.ROLE_DETAILS, isProtected: true, name: "DoxaAdminRoleDetails", Component: DoxaAdminRoleDetails
    }
];

export default [
    {
        path: "/current-company-details", isProtected: true, name: "Current Company Details", Component: CompanyDetailsCurrent
    },
    {
        path: "/me/settings", name: "Settings", isProtected: true, Component: Settings, render: true
    },
    {
        path: "/me/settings/password/reset/own", name: "Reset Your Own Password", isProtected: true, Component: ResetOwnPassword, render: true
    },
    {
        path: "/twofa", name: "Two FA Sign Up", isProtected: true, Component: TwoFA, render: true
    },
    {
        path: "/twofa/verification", name: "2FA verification", isProtected: true, Component: TwoFAVerification, render: true
    },
    {
        path: "/twofa/login", name: "Two FA Login", isProtected: true, Component: TwoFALogin, render: true
    },
    {
        path: "/dashboard", name: "Dashboard", isProtected: true, Component: Dashboard
    },
    {
        path: "/success", name: "Success", isProtected: false, Component: Success
    },
    {
        path: "/setup-password", name: "Setup Password", isProtected: true, Component: SetupPassword, render: true
    },
    {
        path: "/login", name: "Login", isProtected: false, Component: Login, render: true
    },
    {
        path: "/404", name: "Not found", isProtected: false, Component: Error404, render: true
    },

    // System Configuration
    ...PaymentManagementRoutes,
    ...GeneralSettingRoutes,
    ...ProjectMangementRoutes,
    ...VendorManagementRoutes,
    // Entity Management
    ...ManageCompanyUserRoutes,
    ...ManageRoleRoutes,
    ...ManageSubEntitiesRoutes,
    ...ManageOrganizationUsersRoutes,
    ...ManageFeatureMatrixRoutes,
    ...ApprovalSettingRoutes,
    // Bank Connection
    ...ManageSupplierBankAccountRoutes,
    ...ManageBankAccountRoutes,
    ...ManageFacilityRoutes,
    // Doxa Admin
    ...DoxaAdminListOfEntity,
    ...DoxaAdminManageRole,
    ...FinancialInstitutionsRoutes
];
