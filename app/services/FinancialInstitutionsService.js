import axios from "axios";
import CONFIG from "./urlConfig";

const { FI_ENTITIES_LIST_URL, GET_FI_COUNTRIES, FI_ENTITIES_LIST_URL_NEW, GET_FI_ENTITY_URL, UPDATE_FI_ENTITY_URL, CREATE_FI_ENTITY_URL, UPDATE_FI_STATUS, FI_PROJECTS_LIST_URL, GET_FI_PROJECTS, GET_FI_PROJECTS_NEW, GET_FI_ENTITIES } = CONFIG;


class FinancialInstitutionsService {

    getCountries() {
        return axios.get(GET_FI_COUNTRIES);
    }

    getFIList(body) {
        if (body.s) {
            return axios.get(FI_ENTITIES_LIST_URL_NEW + `/get/financialinstitution/?pageNumber=${body.page}&pageSize=${body.size}&s=${body.s}`, body.filterModel);
        }
        return axios.get(FI_ENTITIES_LIST_URL_NEW + `/get/financialinstitution/?pageNumber=${body.page}&pageSize=${body.size}`, body.filterModel);
        // return axios.post(FI_ENTITIES_LIST_URL + `?pageNumber=${body.page}&pageSize=${body.size}`, body.filterModel);
    }

    getEntity(guid) {
        return axios.get(GET_FI_ENTITY_URL + guid);
    }

    // getFIProjects(companyId, userId) {
    //     return axios.get(FI_PROJECTS_LIST_URL + "/" + companyId + "/" + userId);
    // }

    updateEntity(entity) {
        return axios.put(UPDATE_FI_ENTITY_URL, entity);
    }

    updateEntityStatus(data) {
        return axios.post(UPDATE_FI_STATUS, data);
    }

    createFI(entity) {
        return axios.post(CREATE_FI_ENTITY_URL, entity);
    }

    async getFIProjects(body) {
        //https://api-connex-dev.doxa-holdings.com/finance/finance/get-filtered-project-list?pageNumber=0&pageSize=10
        // "https://api-connex-dev.doxa-holdings.com/finance/finance/get-filtered-project-list?pageNumber=0&pageSize=9999"
        let url = `${GET_FI_PROJECTS_NEW}/v1?pageNumber=${body.page}&pageSize=${body.size}`;
        if (body.s) {
            url += `&s=${body.s}`;
        }
        if (body.q) {
            url += `&q=${body.q}`;
        }
        if (body.orderBy) {
            url += `&orderBy=${body.orderBy}`;
        }
        return axios.get(url, body.filterModel);
    }

    async getFIEntities(body) {
        let url = `${GET_FI_ENTITIES}/v1?pageNumber=${body.page}&pageSize=${body.size}`;
        if (body.s) {
            url += `&s=${body.s}`;
        }
        if (body.q) {
            url += `&q=${body.q}`;
        }
        if (body.orderBy) {
            url += `&orderBy=${body.orderBy}`;
        }
        return axios.get(url, body.filterModel);
    }

}

export default new FinancialInstitutionsService();