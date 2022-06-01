import React from "react";
import { withTranslation } from "react-i18next";
import { Container, Button, ButtonGroup, ButtonToolbar } from "components";
import { HeaderMain } from "routes/components/HeaderMain";
import AgGridTableBackend from "components/AgTableBackend";

// State
import useManageFIState from "./hooks/useManageFIState";

//Styles
// import classes from "./ManageFinancialInstitutions.scss";

const defaultColDef = {
  editable: false,
  filter: "agTextColumnFilter",
  floatingFilter: true,
  resizable: true,
  flex: 1
};

const columnDefs = [
  {
    headerName: "FI Code",
    field: "fiCode",
  },
  {
    headerName: "FI Name",
    field: "fiName",
  },
  {
    headerName: "Status",
    field: "status",
  },
  {
    headerName: "Contact Person",
    field: "name",
    valueFormatter: (params) => {
      const { data } = params;
      if (data.users.length > 0 ) return data.users[0].name;
      return "";
    },
  },
  {
    headerName: "Email Address",
    field: "email",
    valueFormatter: (params) => {
      const { data } = params;
      if (data.users.length > 0 ) return data.users[0].email;
      return "";
    },
  },
];

function ManageFinancialInstitutions(props) {
  const { state, stateMethods } = useManageFIState();
  const { t } = props;
  
  return (
    <React.Fragment>
      <Container fluid={true}>
        <div className="d-flex mb-5">
          <HeaderMain
            title={t("List of Financial Institutions")}
            className="mt-0"
          />
        </div>
        <div className="ag-theme-custom-react">
        <div className="d-flex">
            <ButtonToolbar className="ml-auto">
              <ButtonGroup className="align-self-start">
                <Button
                  color="primary"
                  className="mb-2 mr-2 px-3 d-flex float-right"
                  onClick={() => stateMethods.createNewFI()}
                >
                  <i className="fa fa-plus mt-1 mr-1" />
                  {t("Create New")}
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
          <AgGridTableBackend
            backendServerConfig={state.backendServerConfig}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowNodeId={(row) => row?.id}
            onRowClicked={stateMethods.selectEntity}
            rowSelection={"single"}
            gridHeight={500}
          />
        </div>
      </Container>
    </React.Fragment>
  );
}

export default withTranslation()(ManageFinancialInstitutions);
