import { CONTRACT_MODULE_ROUTE } from "services/ContractModuleService";
import { AP_SPECIALIST_ROUTES } from "routes/EntityAdmin/ManageAPSpecialist";
import { MANAGE_ROLES_ROUTES } from "routes/EntityAdmin/ManageRoles";
import PROGRESSIVE_ROUTES from "routes/Entities/ProgressiveClaims/routes";
import URL_CONFIG from "services/urlConfig";
import i18next from "i18next";

export const mappingCategory = (featureName) => {
    switch (featureName) {
    // Contract
    case "Contract Request List":
        return { cat: "Contracts", subCat: "" };
    case "Contract Request":
        return {
            cat: "Contracts",
            pathCat: CONTRACT_MODULE_ROUTE.CONTRACT_REQUEST_LIST,
            subCat: "Contracts",
            pathSubCat: CONTRACT_MODULE_ROUTE.CONTRACT_REQUEST_LIST
        };
    case "Contract List":
        return {
            cat: "Contracts",
            pathCat: CONTRACT_MODULE_ROUTE.CONTRACT_LIST,
            subCat: "Contracts",
            pathSubCat: CONTRACT_MODULE_ROUTE.CONTRACT_LIST
        };
    case "Contract Detail":
        return {
            cat: "Contracts",
            pathCat: CONTRACT_MODULE_ROUTE.CONTRACT_LIST,
            subCat: "Contracts",
            pathSubCat: CONTRACT_MODULE_ROUTE.CONTRACT_LIST
        };

    // Credit Note
    case "Credit Note List":
        return {
            cat: "Invoices",
            subCat: "Credit Notes",
            pathCat: null,
            pathSubCat: null
        };
        // Catalogue
    case "Catalogue Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };
    case "Create Catalogue Item":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };
    case "List of Catalogue":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };
    case "List of Manual Catalogue":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };

        // Bank Account
    case "List of Bank Account":
        return {
            cat: "Bank Connection",
            subCat: "Manage Bank Account"
        };
    case "Add Bank Account":
        return {
            cat: "Bank Connections",
            subCat: ""
        };
    case "Bank Account Details":
        return {
            cat: "Bank Connections",
            subCat: ""
        };
    case "Approve Bank Account":
        return {
            cat: "Bank Connections",
            subCat: ""
        };

    case "List of Approval Group":
        return {
            cat: "Entity Management",
            subCat: "Approval Setting"
        };

    case "Create New Approval Group":
        return {
            cat: "Entity Management",
            subCat: "Approval Groups Management"
        };

    case "Approval Group Details":
        return {
            cat: "Entity Management",
            subCat: "Approval Groups Management"
        };

        // Supplier Bank Account
    case "List of Supplier Bank Account":
        return {
            cat: "Bank Connection",
            subCat: "Manage Supplier Bank Account"
        };
    case "Add Supplier Bank Account":
        return {
            cat: "Bank Connections",
            subCat: ""
        };
    case "Supplier Bank Account Details":
        return {
            cat: "Bank Connections",
            subCat: ""
        };

    // AP Specialist
    case "Manage AP Specialist":
        return {
            cat: "System Configuration",
            subCat: "Vendor Management"
        };
    case "Add New AP Specialist Grouping":
        return {
            cat: "System Configuration",
            subCat: "Vendor Management",
            subSubCat: "Manage AP Specialist",
            path: null,
            pathCat: null,
            pathSubSubCat: AP_SPECIALIST_ROUTES.AP_SPECIALIST_LIST
        };
    case "AP Specialist Detail":
        return {
            cat: "System Configuration",
            subCat: "Vendor Management",
            subSubCat: "Manage AP Specialist",
            path: null,
            pathCat: null,
            pathSubSubCat: AP_SPECIALIST_ROUTES.AP_SPECIALIST_LIST
        };

    // Working Order Details
    case "List of Payment Cycle":
        return {
            cat: "System Configuration",
            subCat: "Payment Management"
        };
    case "Create New Payment Cycle":
        return {
            cat: "System Configuration",
            subCat: "Payment Management"
        };

    // Manage Company Users
    case "Company Users List":
        return {
            cat: "Entity Management ",
            subCat: "Manage Company User"
        };

    case i18next.t("CreateNewCompanyUser"):
        return {
            cat: "Entity Management",
            subCat: "Manage Company User"
        };
    case "Company User Details":
        return {
            cat: "Entity Management",
            subCat: "Manage Company User"
        };

    case "Payment Cycle Details":
        return {
            cat: "System Configuration",
            subCat: "Payment Management"
        };

    // Company Addresses
    case "Company Address List":
    case "Create Company Address":
    case "Company Address Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "Manage Address"
        };

    case i18next.t("ListOfPaymentTerms"):
        return {
            cat: "System Configuration",
            subCat: "Payment Management"
        };

    // Payment Term Manage
    case i18next.t("CreateNewPaymentTerm"):
    case "Payment Term Details":
        return {
            cat: "System Configuration",
            subCat: "Payment Management",
            subSubCat: "Manage Payment Terms"
        };

    // Company Addresses
    case "List UOM":
    case "Create UOM":
    case "UOM Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "Manage UOM"
        };
        // Company Addresses
    case "List of G/L Account":
    case "Create G/L Account":
    case "G/L Account Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "Manage G/L Account"
        };

    // Draft progressive claim
    case "Create Draft Progress Claim":
        return {
            cat: "Receipts",
            subCat: "Progressive Claims"
        };
    case "Progressive Claims List":
        return {
            cat: "Receipts",
            subCat: "Progressive Claims"
        };
    case "Progress Claim Details":
        return {
            cat: "Receipts",
            subCat: "Contract Progressive Claims",
            subSubCat: "Progressive Claims List"
        };
    case "Architect Progress Claims List":
        return {
            cat: "Receipts",
            subCat: "Contractor Progressive Claims"
        };
    case "Architect Progress Claim Details":
        return {
            cat: "Receipts",
            subCat: "Contractor Progressive Claims",
            subSubCat: "Architect Progress Claims List"
        };
    case "Draft Progress Claim List":
        return {
            cat: "Receipts",
            subCat: "Contractor Progressive Claims"
        };
    case "Draft Progress Claim Details":
        return {
            cat: "Receipts",
            subCat: "Contractor Progressive Claims",
            subSubCat: "Draft Progressive Claims List",
            pathSubSubCat: PROGRESSIVE_ROUTES.DRAFT_PROGRESS_CLAIM_LIST
        };
    // Payment
    case "Payment Setting":
        return {
            cat: "System Configuration",
            subCat: "Payment Management"
        };
    case "Approved Invoices List":
        return {
            cat: "Payment",
            subCat: "Invoice Submission"
        };
    case "Pending Payment Document List":
        return {
            cat: "Payment",
            subCat: "Invoice Submission"
        };
    case "Payment List":
        return {
            cat: "Payment",
            subCat: "Invoice Submission"
        };
    case "Create Payment":
        return {
            cat: "Payment",
            subCat: "Invoice Submission"
        };
    case "Payment Details":
        return {
            cat: "Payment",
            subCat: "Invoice Submission"
        };

    // Payment
    case "Create New Approval":
        return {
            cat: "Entity Management",
            subCat: "Manage Approval Matrix"
        };
    case "Approval Details":
        return {
            cat: "Entity Management",
            subCat: "Manage Approval Matrix"
        };
    case "Manage Approval Matrix":
        return {
            cat: "Entity Management",
            subCat: ""
        };
    // Payment Batch
    case "Approved Payment List":
        return {
            cat: "Payments",
            subCat: "Payment"
        };
    case "Payment Batch List":
        return {
            cat: "Payments",
            subCat: "Payment"
        };
    // Manage Currencies
    case "List of Currency":
    case "Currency Details":
    case "Create Currency":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "Manage Currencies"
        };

    // Manage Document Prefixes
    case "List of Document Prefix":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };

    case "Document Prefix Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "List of Document Prefix"
        };

    // Manage trade codes
    case "Manage Trade Code":
        return {
            cat: "System Configuration",
            subCat: "Project Management"
        };

    case "Create New Trade Code":
    case "Trade Code Details":
        return {
            cat: "System Configuration",
            subCat: "Project Management",
            subSubCat: "Manage Trade Code"
        };

    // Manage Currencies
    case "List of Category":
    case "Create New Category":
    case "Category Details":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "Manage Category"
        };

    // Manage DO
    case "Delivery Order List":
        return {
            cat: "Receipts"
        };

    // Manage Currencies
    case "Manage Connection":
        return {
            cat: "System Configuration",
            subCat: "Vendor Management"
        };

        // Manage Currencies
    case "List of Tax Record":
        return {
            cat: "System Configuration",
            subCat: "General Setting"
        };

    case "Tax Record Details":
    case "Create Tax Record":
        return {
            cat: "System Configuration",
            subCat: "General Setting",
            subSubCat: "List of Tax Record",
            pathSubSubCat: URL_CONFIG.LIST_TAX_RECORDS
        };

    // Manage External Vendor
    case "Manage External Vendor":
    case "Create External Vendor":
    case "Vendor Details":
        return {
            cat: "System Configuration",
            subCat: "Vendor Management"
        };

    // Manage Feature Matrix
    case "Manage Feature Matrix":
        return {
            cat: "Entity Management"
        };

    // Purchase Requisitions To Be Converted List
    case i18next.t("PrePurchaseRequisitionsToBeConvertedList"):
    case "Purchase Requisitions To Be Converted List":
        return {
            cat: " Orders",
            subCat: "Request Pending Conversion"
        };
    // Projects List
    case "List of Project":
        return {
            cat: "System Configuration",
            subCat: "Project Management"
        };

    case "Create New Project":
    case "Project Details":
        return {
            cat: "System Configuration",
            subCat: "Project Management",
            subSubCat: "List of Project"
        };
    // Projects Forecast List
    case "Manage Project Forecast":
        return {
            cat: "System Configuration",
            subCat: "Project Management"
        };
    // Delivery Order
    case "Create Delivery Order":
        return {
            cat: "Receipts",
            subCat: ""
        };
    case "Delivery Order Details":
        return {
            cat: "Receipts",
            subCat: "Delivery Orders List"
        };
    case "Delivery Orders List":
        return {
            cat: "Receipts",
            subCat: ""
        };

    case "Entity Details":
        return {
            cat: "List of Entities",
            pathCat: "/entities"
        };

    // Good Receipt
    case "Receipts List":
        return { cat: "Receipts" };
    case "Create Receipt From PO":
    case "Create Receipt From DO":
    case "Create Non Order Receipt":
        return { cat: "Receipts", subCat: "" };

    // Organization Users
    case "Organization Users List":
    case "Create New Organization User":
    case "Organization User Details":
        return {
            cat: "Manage Organization Users",
            subCat: "Organization Users List"
        };

    // Manage Roles
    case "List Of Role":
        return {
            cat: "Entity Management",
            subCat: "Manage Role"
        };
    case "Create New Role":
    case "Role Details":
        return {
            cat: "Entity Management",
            subCat: "Manage Role",
            subSubCat: "List of role",
            pathSubSubCat: MANAGE_ROLES_ROUTES.ROLES_LIST
        };

    // Organization Users
    case "List of Companies":
        return {
            cat: "Manage Sub-Entities"
        };
    case "Company Details":
    case "Create New Company":
        return {
            cat: "Manage Sub-Entities",
            subCat: "List of Companies"
        };

    // Manage Approval Configuration
    case i18next.t("ApprovalConfiguration"):
        return {
            cat: "Entity Management",
            subCat: "Approval Setting"
        };
    default:
        return {
            cat: null,
            subCat: null
        };
    }
};
export default mappingCategory;
