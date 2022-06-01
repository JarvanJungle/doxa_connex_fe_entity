import { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import URL_CONFIG from "services/urlConfig";
import FinancialInstitutionsService from "services/FinancialInstitutionsService";
import useToast from "routes/hooks/useToast";

const useManageFIState = () => {
  const history = useHistory();
  const showToast = useToast();

  const backendServerConfig = useMemo(
    () => ({
      dataField: "content",
      totalField: "totalElements",
      getDataFunc: (query) => {
        return FinancialInstitutionsService.getFIList(query)
          .then((data) => data.data.data)
          .catch((error) => {
            const errorMessage = error.message || "System error!";
            showToast("error", errorMessage);
          });
      },
    }),
    []
  );

  const selectEntity = (event) => {
    history.push(URL_CONFIG.FI_ENTITY_DETAILS + event.data.id);
  };

  const createNewFI = () => {
    history.push(URL_CONFIG.CREATE_FI);
  };

  return {
    state: {
      backendServerConfig,
    },
    stateMethods: { selectEntity, createNewFI },
  };
};

export default useManageFIState;
