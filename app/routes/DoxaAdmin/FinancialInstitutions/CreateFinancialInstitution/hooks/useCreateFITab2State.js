import { useState, useEffect } from "react";

const useCreateFITab2State = (props) => {
  const defaultColDef = {
    editable: false,
    sizeColumnsToFit: true,
    flex: 1,
  };
  const modalDefaultColDef = {
    editable: false,
    filter: "agTextColumnFilter",
    sizeColumnsToFit: true,
    autoSizeAllColumns: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
  };
  const [addNewProjectModal, setAddNewProjectModal] = useState(false);
  const [addNewEntityModal, setAddNewEntityModal] = useState(false);
  const [developerFinancingRowData, setDeveloperFinancingRowData] = useState([]);
  const [invoiceFinancingRowData, setInvoiceFinancingRowData] = useState([]);
  const [developerFinancingGridApi, setDeveloperFinancingGridApi] =
    useState(null);

  const onDeveloperFinancingGridReady = ({ api }) => {
    setDeveloperFinancingGridApi(api);
  };

  const [invoiceFinancingGridApi, setInvoiceFinancingGridApi] = useState(null);

  const onInvoiceFinancingGridReady = ({ api }) => {
    setInvoiceFinancingGridApi(api);
  };

  const handleAddProject = (selectedProjects) => {
    if (selectedProjects.length) {
      const selectedNodes = selectedProjects;
      let selectedData = selectedNodes?.[0]["data"];
      selectedData["status"] = "ACTIVE";
      let updateProject = [];
      updateProject = [...developerFinancingRowData, selectedData];
      setDeveloperFinancingRowData(updateProject);
      setAddNewProjectModal(false);
    }
  };

  const handleAddEntity = (selectedEntities) => {
    if (selectedEntities.length) {
      const selectedNodes = selectedEntities;
      let selectedData = selectedNodes?.[0]["data"];
      selectedData["status"] = "ACTIVE";
      let updateEntity = [];
      updateEntity = [...invoiceFinancingRowData, selectedData];
      setInvoiceFinancingRowData(updateEntity);
      setAddNewEntityModal(false);
    }
  };

  return {
    defaultColDef,
    modalDefaultColDef,
    addNewProjectModal,
    addNewEntityModal,
    developerFinancingRowData,
    invoiceFinancingRowData,
    onDeveloperFinancingGridReady,
    onInvoiceFinancingGridReady,
    setAddNewProjectModal,
    setAddNewEntityModal,
    handleAddProject,
    handleAddEntity,
  };
};

export default useCreateFITab2State;
