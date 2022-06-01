import { useState, useEffect } from "react";

const useCreateFITab1State = (props) => {
  const rowData = [
    {
      financingType: "Developer Financing",
      active: false,
    },
    {
      financingType: "Invoice Financing",
      active: false,
    },
  ];
  const defaultColDef = {
    editable: false,
    sizeColumnsToFit: true,
    flex: 1,
  };
  const [gridApi, setGridApi] = useState(null);
  const [developerFinancingModule, setDeveloperFinancingModule] = useState(false);
  const [invoiceFinancingModule, setInvoiceFinancingModule] = useState(false);

  const [Tab1Values, setTab1Values] = useState({
    FICode: "",
    FIName: "",
    userName: "",
    entityRepDialog: "",
    entityRepPhone: "",
    email: "",
    designation: "",
    fiPortal: false,
    remark: "",
  });

  useEffect(() => {
    checkFormValid();
  }, [developerFinancingModule]);

  useEffect(() => {
    checkFormValid();
  }, [invoiceFinancingModule]);

  const onGridReady = ({ api }) => {
    setGridApi(api);
  };

  const handleCheckboxSelection = (data) => {
    const selectedNodes = data.api.getSelectedNodes();
    let devFinancingModule = [];
    devFinancingModule = selectedNodes.filter((item) => item.data.financingType === "Developer Financing");
    let invFinancingModule = [];
    invFinancingModule = selectedNodes.filter((item) => item.data.financingType === "Invoice Financing");
    if(devFinancingModule.length !== 0) {
        setDeveloperFinancingModule(true);
    } else if(devFinancingModule.length === 0) {
        setDeveloperFinancingModule(false);
    }
    if(invFinancingModule.length !== 0) {
        setInvoiceFinancingModule(true);
    } else if(invFinancingModule.length === 0) {
        setInvoiceFinancingModule(false);
    }
  }

  const checkFormValid = () => {
    setTimeout(function () {
      if (
        props?.formEl.current?.state?.invalidInputs.FICode === undefined &&
        props?.formEl.current?.state?.invalidInputs.FIName === undefined &&
        props?.formEl.current?.state?.invalidInputs.email === undefined &&
        props?.formEl.current?.state?.invalidInputs.entityRepDialog === undefined &&
        props?.formEl.current?.state?.invalidInputs.entityRepPhone === undefined &&
        props?.formEl.current?.state?.invalidInputs.userName === undefined &&
        (developerFinancingModule || invoiceFinancingModule)
      ) {
        props.setFormValid(true);
      } else {
        props.setFormValid(false);
      }
    }, 10);
  };

  const setFormValues = (e) => {
      if(e.target.name === "fiPortal") {
          if(e.target.value === "no") {
            setTab1Values({ ...Tab1Values, [e.target.name]: false });
          } else if(e.target.value === "yes") {
            setTab1Values({ ...Tab1Values, [e.target.name]: true });
          }
      } else {
        setTab1Values({ ...Tab1Values, [e.target.name]: e.target.value });
      }
  };

  return {
    rowData,
    defaultColDef,
    invoiceFinancingModule,
    developerFinancingModule,
    Tab1Values,
    onGridReady,
    handleCheckboxSelection,
    checkFormValid,
    setFormValues,
  };
};

export default useCreateFITab1State;
