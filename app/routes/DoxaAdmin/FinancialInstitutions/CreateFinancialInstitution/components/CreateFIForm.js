import React, { useContext } from "react";

import { AvForm, AvField } from "availity-reactstrap-validation";
import { Container, Row, Button } from "components";
import { HeaderMain } from "routes/components/HeaderMain";
import { HeaderSecondary } from "routes/components/HeaderSecondary";
import { StickyFooter } from "components/StickyFooter/StickyFooter";
import classes from "./../CreateFinancialInstitution.scss";
import { Link, Prompt } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import "./../CreateFinancialInstitution.scss";
import CreateFITab1 from "./CreateFITab1";
import CreateFITab2 from "./CreateFITab2";
import CreateFIContext from "../context/CreateFIContext";
import { CommonConfirmDialog } from "routes/components/CommonConfirmDialog";
import useFormState from "../hooks/useFormState";

function CreateFIForm() {
  const { commonState, t } = useContext(CreateFIContext);
  const formState = useFormState();

  return (
    <React.Fragment>
      <AvForm
        ref={commonState.formEl}
        onValidSubmit={formState.handleValidSubmit}
        onInvalidSubmit={commonState.handleInvalidSubmit}
      >
        <Container fluid={true} className={classes["custom-container"]}>
          <HeaderMain
            title={t("FinancialInstitutionDetail")}
            className="mb-3"
          />
          <HeaderSecondary title={t("GeneralInformation")} className="mb-3" />
          <div class="FITabContainer">
            <Tabs
              activeKey={commonState.selectedkey}
              onSelect={(k) => commonState.handleSelect(k)}
              // defaultActiveKey={1}
              id="controlled-tab-example"
              className="justify-content-end mb-3 ml-2"
            >
              <Tab eventKey="1" title="1" key={1}>
                <CreateFITab1 />
              </Tab>
              <Tab
                eventKey="2"
                title="2"
                key={2}
                disabled={!commonState.formValid}
              >
                <CreateFITab2 />
              </Tab>
            </Tabs>
          </div>
        </Container>
        <StickyFooter>
          <Row className="justify-content-between mx-0 px-3">
            <div>
              <Button
                color="secondary"
                className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQueryBack"]}`}
                onClick={() => commonState.backButtonClick()}
              >
                {t("Back")}
              </Button>
            </div>
            <div>
              {commonState.selectedkey === "1" && (
                <Button
                  color="primary"
                  type="submit"
                  className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQuery"]}`}
                  // id="modal2"
                  // onClick={() => commonState.handleSelect("2")}
                >
                  Next
                </Button>
              )}
              {commonState.selectedkey === "2" && (
                <>
                  <Button
                    color="danger"
                    className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQuery"]}`}
                    // id="modal2"
                    onClick={() => commonState.setToggleCancelModal(true)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQuery"]}`}
                    // id="modal2"
                    // onClick={commonState.handleSelect("2")}
                  >
                    Create
                  </Button>
                </>
              )}
            </div>
          </Row>
          <CommonConfirmDialog 
          className={classes["new-line"]}
            isShow={commonState.toggleCancelModal}
            onHide={() => commonState.setToggleCancelModal(false)}
            title={"Cancel Onboarding of FI"}
            titleColor="danger"
            content={"All information input will be lost.\nDo you want to continue to cancel the Onboarding of FI?"}
            positiveProps={{
              onPositiveAction: () => commonState.cancelButtonClick(),
              contentPositive: "Yes",
            }}
            negativeProps={{
              onNegativeAction: () => commonState.setToggleCancelModal(false),
              colorNegative: "secondary",
            }}
          />
        </StickyFooter>
      </AvForm>
      {/* <Prompt
        // when={this.state.isEdit}
        message="Are you sure you want to leave this page as all your input will be lost?"
      /> */}
    </React.Fragment>
  );
}

// export default CreateFIForm;
export default React.memo(CreateFIForm);
