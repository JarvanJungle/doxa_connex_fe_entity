import React, { useMemo, useState } from "react";
import { AddItemDialog } from "routes/components";
import { withTranslation } from "react-i18next";
import FinancialInstitutionsService from "services/FinancialInstitutionsService";

function AddEntitiesModal(props) {
  const [selectedEntities, setSelectedEntities] = useState(null);

  const backendServerConfig = useMemo(
    () => ({
      dataField: "content",
      totalField: "totalElements",
      getDataFunc: (query) => {
        return FinancialInstitutionsService.getFIEntities(query).then(
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
      title={props.t("Entity")}
      onPositiveAction={(e) => props.successAction(selectedEntities)}
      onNegativeAction={() => props.closeModal()}
      onSelectionChanged={(params) => {
        setSelectedEntities(params.api.getSelectedNodes());
      }}
      rowSelection={"single"}
      gridHeight={300}
      columnDefs={props.columnDefs}
      defaultColDef={props.defaultColDef}
      rowDataItem={[]}
      backendServerConfig={backendServerConfig}
      backendPagination
      getRowNodeId={(row) => row?.uuid}
    />
  );
}

export default withTranslation()(AddEntitiesModal);
