import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import URL_CONFIG from "services/urlConfig";
import ManageFacilityService from "services/ManageFacilityService";
import useToast from "routes/hooks/useToast";
import { useSelector } from "react-redux";

const useManageFacilityState = () => {
  const history = useHistory();
  const showToast = useToast();
  const authReducer = useSelector((state) => state.authReducer);

  const backendServerConfig = useMemo(
    () => ({
      dataField: "content",
      totalField: "totalElements",
      getDataFunc: (query) => {
        let companyId = JSON.parse(localStorage.getItem("currentCompanyUUID"));
        return ManageFacilityService.getFacilityList(query, companyId)
          .then((res) => {
            //Some of the attributes are nested formatting the data as per table columns
            res.data.data.content = res.data.data.content.map((x) => {
              let data = { ...x };
              data.projectTitle = x.project.projectTitle;
              data.projectCode = x.project.projectCode;
              data.status = x.project.status;
              return data;
            });
            return res.data.data;
          })
          .catch((error) => {
            const errorMessage = error.message || "System error!";
            showToast("error", errorMessage);
          });
      },
    }),
    []
  );

  // Function to select individual facility
  const selectFacility = (event) => {
    history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_DETAILS + "?facilityID=" + event.data.id);
  };

  // Function to add a new facility
  const addNew = (e) => {
    history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_CREATE);
  };

  return {
    state: {
      backendServerConfig,
    },
    stateMethods: { selectFacility, addNew },
  };
};

export default useManageFacilityState;
