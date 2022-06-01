import React from "react";

import CreateRequestForm from "./components/CreateFIForm";
import CreateFIProvider from "./context/CreateFIProvider";

function CreateFinancialInstitution() {
  return (
    <CreateFIProvider>
      <CreateRequestForm />
    </CreateFIProvider>
  );
}

export default CreateFinancialInstitution;
