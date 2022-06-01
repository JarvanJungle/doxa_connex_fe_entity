import axios from "axios";
import CONFIG from "./urlConfig";

const {
    GET_FACILITY_LIST,
    FI_PROJECTS_LIST_URL,
    GET_FACILITY_INFO_URL,
    SAVE_FACILITY_URL,
    FACILITY_STATUS_URL } = CONFIG;


class ManageFacilityService {

    getFacilityList(body, companyId = '') {
        let url = `${GET_FACILITY_LIST}/v1?pageNumber=${body.page || 0}&pageSize=${body.size || 10}&companyUuid=${companyId}`;
        if (body.s) {
            url += `&s=${body.s}`;
        }
        if (body.orderBy) {
            url += `&orderBy=${body.orderBy}`;
        }
        return axios.get(url);
    }

    getFIProjects(companyId, userId) {
        return axios.get(FI_PROJECTS_LIST_URL + "/" + companyId);
    }

    getFacilityInfo(guid) {
        return axios.get(GET_FACILITY_INFO_URL + "/" + guid);
    }

    saveFacility(entity) {
        return axios.post(SAVE_FACILITY_URL, entity);
    }

    changeFacilityStatus(data) {
        return axios.post(FACILITY_STATUS_URL, data);
    }

}

export default new ManageFacilityService();