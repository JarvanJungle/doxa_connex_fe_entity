import axios from "axios";
import CONFIG from "./urlConfig";
import UserService from "./UserService";
class AddressDataService {
    getCompanyAddresses(companyUuid) {
        return axios.get(CONFIG.GET_COMPANY_ADDRESSES.replace("{companyUuid}", companyUuid));
    }

    getAddressDetails(addressuuid) {
        return axios.get(CONFIG.GET_ADDRESS_DETAILS.replace("{companyUuid}", UserService.getCurrentCompanyUuid()) + addressuuid);
    }

    updateAddressDetails(address) {
        return axios.put(CONFIG.UPDATE_ADDRESS_DETAILS.replace("{companyUuid}", UserService.getCurrentCompanyUuid()), address);
    }

    createAddress(address) {
        return axios.post(CONFIG.CREATE_ADDRESS_URL.replace("{companyUuid}", UserService.getCurrentCompanyUuid()), address);
    }

    massUploadAddresses(addresses, companyUuid) {
        return axios.post(CONFIG.MASS_UPLOAD_ADDRESSES_URL.replace("{companyUuid}", companyUuid), addresses);
    }

    deactivateAddresses(addresses) {
        return axios.put(CONFIG.DEACTIVATING_ADDRESSES_URL.replace("{companyUuid}", UserService.getCurrentCompanyUuid()), addresses);
    }

    activateAddresses(addresses) {
        return axios.put(CONFIG.ACTIVATING_ADDRESSES_URL.replace("{companyUuid}", UserService.getCurrentCompanyUuid()), addresses);
    }
}

export default new AddressDataService();
