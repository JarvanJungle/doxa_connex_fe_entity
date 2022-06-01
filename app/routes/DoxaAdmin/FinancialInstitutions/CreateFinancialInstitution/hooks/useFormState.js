import { useContext } from "react";
import { useHistory } from "react-router-dom";
import useToast from "routes/hooks/useToast";
import CreateFIContext from "../context/CreateFIContext";
import FinancialInstitutionsService from 'services/FinancialInstitutionsService';

const useFormState = (props) => {
  const showToast = useToast();
  const history = useHistory();
  const context = useContext(CreateFIContext);
  const { commonState, CreateFITab1State, CreateFITab2State, t } = context;

  const handleValidSubmit = async (e) => {
    if (commonState.selectedkey === "1") {
      if (commonState.formValid) {
        commonState.setSelectedkey("2");
      } else {
        showToast(
          "error",
          "Validation error, please select atleast one from Module Subscription"
        );
      }
    } else if (commonState.selectedkey === "2") {
      try {
        let features = [];
        if (CreateFITab1State.developerFinancingModule) {
          features.push("DEVF")
        }
        if (CreateFITab1State.invoiceFinancingModule) {
          features.push("INVF")
        }
        let createRequest = {
          fiCode: CreateFITab1State.Tab1Values.FICode,
          fiName: CreateFITab1State.Tab1Values.FIName,
          status: "ASSOCIATED",
          fiportal: CreateFITab1State.Tab1Values.fiPortal,
          developerFinancing: CreateFITab1State.developerFinancingModule,
          invoiceFinancing: CreateFITab1State.invoiceFinancingModule,
          features: features,
          users: [
            {
              name: CreateFITab1State.Tab1Values.userName,
              email: CreateFITab1State.Tab1Values.email,
              designation: CreateFITab1State.Tab1Values.designation,
              workNumber: CreateFITab1State.Tab1Values.entityRepPhone,
              remarks: CreateFITab1State.Tab1Values.remark,
              countryCode: CreateFITab1State.Tab1Values.entityRepDialog,
              isActive: true,
              role: "FI_ADMIN"
              }
          ],  
          projects: CreateFITab2State.developerFinancingRowData,
          companies: CreateFITab2State.invoiceFinancingRowData,
        };
        const response = await FinancialInstitutionsService.createFI(
          createRequest
        );
        console.log('createRequest', createRequest);
        if (response.data.status == "OK") {
          showToast("success", "FI created successfully");
          history.push("/fi-list");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("message", error.message);
        const errorMessage = error.message || "System error!";
        showToast("error", errorMessage);
      }
    }
  };

  return {
    handleValidSubmit,
  };
};

export default useFormState;
