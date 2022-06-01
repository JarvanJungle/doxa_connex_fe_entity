import React from "react";
import CreateFIContext from "./CreateFIContext";
import { withTranslation } from "react-i18next";
import useCommonState from "../hooks/useCommonState";
import useCreateFITab1State from "../hooks/useCreateFITab1State";
import useCreateFITab2State from "../hooks/useCreateFITab2State";

const CreateFIProvider = (props) => {
  const commonState = useCommonState();
  const CreateFITab1State = useCreateFITab1State(commonState);
  const CreateFITab2State = useCreateFITab2State(commonState);

  const { t } = props;

  return (
    <CreateFIContext.Provider
      value={{
        commonState,
        CreateFITab1State,
        CreateFITab2State,
        t,
      }}
    >
      {props.children}
    </CreateFIContext.Provider>
  );
};

export default withTranslation()(CreateFIProvider);
