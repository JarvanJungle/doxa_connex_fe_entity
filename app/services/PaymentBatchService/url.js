import { BASE_URL } from "../urlConfig/urlConfig";

const PAYMENT_BATCH_API = {
    GET_APPROVED_PAYMENT_LIST_URL: `${BASE_URL}payment/{companyUuid}/payment/approved`,
    DETAILS_PAYMENT_FOR_CREATING_PAYMENT_BATCH_URL: `${BASE_URL}payment/{companyUuid}/payment/detail/payment-batch`,
    GET_PAYMENT_BATCH_LIST_URL: `${BASE_URL}payment/{companyUuid}/payment-batch`,
    CREATE_PAYMENT_BATCH_URL: `${BASE_URL}payment/{companyUuid}/payment-batch`,
    DETAILS_PAYMENT_BATCH_URL: `${BASE_URL}payment/{companyUuid}/payment-batch/{paymentUuid}`
};

Object.freeze(PAYMENT_BATCH_API);
export default PAYMENT_BATCH_API;
