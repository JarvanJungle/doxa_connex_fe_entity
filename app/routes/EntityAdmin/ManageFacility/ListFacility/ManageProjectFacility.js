import React from "react";
// the hoc
import { withTranslation } from "react-i18next";
import { Container, Button, ButtonGroup, ButtonToolbar } from "components";
import { HeaderMain } from "routes/components/HeaderMain";
import { convertToLocalTime } from "helper/utilities";
import AgGridTableBackend from "components/AgTableBackend";

//State
import useManageFacilityState from "./hooks/useManageProjectFacilityState";

const defaultColDef = {
  editable: false,
  filter: "agTextColumnFilter",
  floatingFilter: true,
  resizable: true,
  sortable: true
};

const columnDefs = [
  {
    headerName: "Facility Id",
    field: "id",
  },
  {
    headerName: "Facility Name",
    field: "facilityName",
  },
  {
    headerName: "Project Code",
    field: "projectCode",
  },
  {
    headerName: "Project Name",
    field: "projectTitle",
  },
  {
    headerName: "Facility Agreement/Letter of Offer Date",
    field: "offerDate",
    valueFormatter: ({ value }) => convertToLocalTime(value).slice(0, 10),
  },
  {
    headerName: "Loan Account No",
    field: "loanAccountNumber",
  },
  {
    headerName: "Status",
    field: "status",
  },
];

function ManageFacility(props) {
  const { state, stateMethods } = useManageFacilityState();
  const { t } = props;

  return (
    <React.Fragment>
      <Container fluid={true}>
        <div className="d-flex mb-5">
          <HeaderMain title={"Project Facility"} className="mt-0" />
        </div>
        <div className="d-flex">
          <ButtonToolbar className="ml-auto">
            <ButtonGroup className="align-self-start">
              <Button
                color="primary"
                className="mb-2 mr-2 px-3 d-flex float-right"
                id="addNewModal"
                onClick={(e) => stateMethods.addNew(e)}
              >
                <i className="fa fa-plus mt-1 mr-1" />
                Add New
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div className="ag-theme-custom-react" style={{ height: "600px" }}>
          <AgGridTableBackend
            backendServerConfig={state.backendServerConfig}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowNodeId={(row) => row?.id}
            onRowClicked={stateMethods.selectFacility}
            rowSelection={"single"}
            gridHeight={500}
            pageSize={10}
          />
        </div>
      </Container>
    </React.Fragment>
  );
}

export default withTranslation()(ManageFacility);
