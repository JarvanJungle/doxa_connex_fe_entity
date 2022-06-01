import axios from "axios";
import PAYMENT_API from "./url";

class PaymentService {
    getPendingPaymentList(companyUuid) {
        const url = PAYMENT_API.PENDING_PAYMENT_LIST.replace("{companyUuid}", companyUuid);
        return axios.get(url);
    }

    getPaymentCreateDetails(companyUuid, body) {
        const url = PAYMENT_API.PAYMENT_CREATE_DETAILS.replace("{companyUuid}", companyUuid);
        return axios.post(url, body);
    }

    getPaymentList(companyUuid) {
        const url = PAYMENT_API.PAYMENT_LIST.replace("{companyUuid}", companyUuid);
        return axios.get(url);
    }

    getPaymentDetails(companyUuid, paymentUuid) {
        const url = PAYMENT_API.PAYMENT_DETAILS.replace("{companyUuid}", companyUuid).replace("{paymentUuid}", paymentUuid);
        return axios.get(url);
    }

    createPayment(companyUuid, body) {
        const url = PAYMENT_API.CREATE_PAYMENT.replace("{companyUuid}", companyUuid);
        return axios.post(url, body);
    }

    saveAsDraftPayment(companyUuid, body) {
        const url = PAYMENT_API.SAVE_AS_DRAFT_PAYMENT.replace("{companyUuid}", companyUuid);
        return axios.post(url, body);
    }

    approvalPayment(companyUuid, paymentUuid, body) {
        const url = PAYMENT_API.APPROVAL_PAYMENT.replace("{companyUuid}", companyUuid).replace("{paymentUuid}", paymentUuid);
        return axios.patch(url, body);
    }

    rejectPayment(companyUuid, paymentUuid, body) {
        const url = PAYMENT_API.REJECT_PAYMENT.replace("{companyUuid}", companyUuid).replace("{paymentUuid}", paymentUuid);
        return axios.patch(url, body);
    }

    sendBackPayment(companyUuid, paymentUuid, body) {
        const url = PAYMENT_API.SEND_BACK_PAYMENT.replace("{companyUuid}", companyUuid).replace("{paymentUuid}", paymentUuid);
        return axios.patch(url, body);
    }

    getPaymentOverview(companyUuid, paymentUuid) {
        const url = PAYMENT_API.PAYMENT_OVERVIEW.replace("{companyUuid}", companyUuid).replace("{paymentUuid}", paymentUuid);
        return axios.get(url);
    }

    getOverviewByInvoice(companyUuid, uuid) {
        const url = PAYMENT_API.OVERVIEW_BY_INVOICE.replace("{companyUuid}", companyUuid).replace("{uuid}", uuid);
        return axios.get(url);
    }
}

export default new PaymentService();
