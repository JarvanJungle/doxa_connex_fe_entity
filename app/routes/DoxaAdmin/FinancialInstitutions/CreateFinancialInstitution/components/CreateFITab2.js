import React, { useState, useContext } from "react";
import { AgGridReact } from "components/agGrid";
import classes from "./../CreateFinancialInstitution.scss";
import CreateFIContext from "../context/CreateFIContext";
import AddProjectsModal from "../../ViewFIEntityDetails/AddProjectsModal";
import AddEntitiesModal from "../../ViewFIEntityDetails/AddEntitiesModal";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  ButtonToolbar,
} from "components";

function CreateFITab2() {
  const { CreateFITab1State, CreateFITab2State, t } = useContext(CreateFIContext);
  const developerFinancingColDefs = [
    {
      headerName: "Company/Entity",
      field: "companyName",
    },
    {
      headerName: "Project Code",
      field: "projectCode",
    },
    {
      headerName: "Project Title",
      field: "projectTitle",
    },
  ];
  const invoiceFinancingColDefs = [
    {
      headerName: "Company/Entity",
      field: "companyName",
    },
  ];

  const developerFinancingAddTableColDefs = [
    {
      headerName: t("Project Code"),
      field: "projectCode",
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: t("Project Title"),
      field: "projectTitle",
      width: "255px",
    },
    {
      headerName: t("Entity Name"),
      field: "companyName",
      width: "255px",
    },
  ];

  const invoiceFinancingAddTableColDefs = [
    {
      headerName: t("Entity Name"),
      field: "companyName",
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
  ];

  return (
    <>
      {CreateFITab1State.developerFinancingModule && (
        <Card className={`${classes["tabCard"]}`}>
          <CardHeader tag="h6">{t("Developer Financing")}</CardHeader>
          <CardBody className={`${classes["cardBody"]} mb-3`}>
            <ButtonToolbar className="ml-auto d-flex justify-content-end">
              <ButtonGroup>
                <Button
                  color="primary"
                  className="mb-2 mr-2 px-3"
                  id="addNewModal"
                  onClick={() => CreateFITab2State.setAddNewProjectModal(true)}
                >
                  <i className="fa fa-plus" /> Add New
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            {CreateFITab2State.addNewProjectModal && (
              <AddProjectsModal
                closeModal={() =>
                  CreateFITab2State.setAddNewProjectModal(false)
                }
                successAction={CreateFITab2State.handleAddProject}
                columnDefs={developerFinancingAddTableColDefs}
                defaultColDef={CreateFITab2State.modalDefaultColDef}
              />
            )}
            <Card className="mt-3">
              <CardHeader tag="h6">
                {t("Entity and Project Tagging")}
              </CardHeader>
              <CardBody
                className={`${classes["cardBody"]} ${classes["agGridCard"]}`}
              >
                <div
                  className="ag-theme-custom-react"
                  style={{ height: "300px", width: "100%" }}
                >
                  <AgGridReact
                    columnDefs={developerFinancingColDefs}
                    defaultColDef={CreateFITab2State.defaultColDef}
                    rowData={CreateFITab2State.developerFinancingRowData}
                    onGridReady={(params) =>
                      CreateFITab2State.onDeveloperFinancingGridReady(params)
                    }
                  />
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      )}
      {CreateFITab1State.invoiceFinancingModule && (
        <Card className="mt-3">
          <CardHeader tag="h6">{t("Invoice Financing")}</CardHeader>
          <CardBody className={`${classes["cardBody"]} mb-3`}>
            <ButtonToolbar className="ml-auto d-flex justify-content-end">
              <ButtonGroup>
                <Button
                  color="primary"
                  className="mb-2 mr-2 px-3"
                  id="addNewModal"
                  onClick={() => CreateFITab2State.setAddNewEntityModal(true)}
                >
                  <i className="fa fa-plus" /> Add New
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            {CreateFITab2State.addNewEntityModal && (
              <AddEntitiesModal
                closeModal={() =>
                  CreateFITab2State.setAddNewEntityModal(false)
                }
                successAction={CreateFITab2State.handleAddEntity}
                columnDefs={invoiceFinancingAddTableColDefs}
                defaultColDef={CreateFITab2State.modalDefaultColDef}
              />
            )}
            <Card className="mt-3">
              <CardHeader tag="h6">{t("Entity Tagging")}</CardHeader>
              <CardBody
                className={`${classes["cardBody"]} ${classes["agGridCard"]}`}
              >
                <div
                  className="ag-theme-custom-react"
                  style={{ height: "300px", width: "100%" }}
                >
                  <AgGridReact
                    columnDefs={invoiceFinancingColDefs}
                    defaultColDef={CreateFITab2State.defaultColDef}
                    rowData={CreateFITab2State.invoiceFinancingRowData}
                    onGridReady={(params) =>
                      CreateFITab2State.onInvoiceFinancingGridReady(params)
                    }
                  />
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      )}
    </>
  );
}

// export default CreateFITab2;
export default React.memo(CreateFITab2);
