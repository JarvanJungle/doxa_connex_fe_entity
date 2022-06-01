import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import useToast from "routes/hooks/useToast";

const useCommonState = (props) => {
  const [selectedkey, setSelectedkey] = useState("1");
  const [formValid, setFormValid] = useState(false);
  const [toggleCancelModal, setToggleCancelModal] = useState(false);
  const history = useHistory();
  const formEl = useRef(null);
  const showToast = useToast();

  const handleInvalidSubmit = (e) => {
    showToast("error", "Validation error, please check your input");
  };

  const handleSelect = (key) => {
    console.log("key", key);
    if (key === "1") {
      setSelectedkey(key);
    } else if (key === "2" && formValid) {
      setSelectedkey(key);
    } else {
      showToast("error", "Validation error, please check your input");
    }
  };

  const backButtonClick = () => {
    if (selectedkey === "2") {
      setSelectedkey("1");
    } else if (selectedkey === "1") {
        setToggleCancelModal(true);
    //   history.push("/fi-list");
    }
  };

  const cancelButtonClick = () => {
    history.push("/fi-list");
  };

  return {
    selectedkey,
    formEl,
    formValid,
    toggleCancelModal,
    setSelectedkey,
    handleSelect,
    backButtonClick,
    handleInvalidSubmit,
    setToggleCancelModal,
    cancelButtonClick,
    setFormValid,
  };
};

export default useCommonState;
