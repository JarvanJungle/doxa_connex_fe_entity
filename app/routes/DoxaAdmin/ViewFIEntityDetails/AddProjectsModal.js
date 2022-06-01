import React, { useMemo, useState } from "react";
import { AddItemDialog } from "routes/components";
import { withTranslation } from "react-i18next";
import FinancialInstitutionsService from "services/FinancialInstitutionsService";

function AddProjectsModal(props) {
  const [selectedProjects, setSelectedProjects] = useState(null);

  const backendServerConfig = useMemo(
    () => ({
      dataField: "content",
      totalField: "totalElements",
      getDataFunc: (query) => {
        return FinancialInstitutionsService.getFIProjects(query).then(
          (data) => data.data
        );
      },
    }),
    []
  );

  return (
    <AddItemDialog
      isShow={true}
      onHide={() => props.closeModal()}
      title={props.t("Project")}
      onPositiveAction={(e) => props.successAction(selectedProjects)}
      onNegativeAction={() => props.closeModal()}
      onSelectionChanged={(params) => {
        setSelectedProjects(params.api.getSelectedNodes());
      }}
      rowSelection={"single"}
      gridHeight={300}
      columnDefs={props.columnDefs}
      defaultColDef={props.defaultColDef}
      rowDataItem={[]}
      backendServerConfig={backendServerConfig}
      backendPagination
      getRowNodeId={(row) => row?.uuid}
      sortable={true}
    />
  );
}

export default withTranslation()(AddProjectsModal);
