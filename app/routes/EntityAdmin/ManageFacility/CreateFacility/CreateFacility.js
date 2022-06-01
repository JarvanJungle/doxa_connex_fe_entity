import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import useToast from "routes/hooks/useToast";
import _ from "lodash";
import moment from "moment";
import URL_CONFIG from "services/urlConfig";
import ManageFacilityService from "../../../../services/ManageFacilityService";
import {
  Row,
  Col,
  Card,
  Label,
  Container,
  CardBody,
  CardHeader,
  Button,
  ButtonGroup,
  ButtonToolbar,
  FormGroup,
} from "components";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { HeaderMain } from "routes/components/HeaderMain";
import { withTranslation, useTranslation } from "react-i18next";
import useUnsavedChangesWarning from "routes/components/UseUnsaveChangeWarning/useUnsaveChangeWarning";
import { StickyFooter } from "components/StickyFooter/StickyFooter";
import classes from "./CreateFacility.scss";
import { convertToLocalTime } from "helper/utilities";

function CreateFacility1(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const showToast = useToast();
  const [mainTitle, setMainTitle] = useState(t("CreateProjectFacility"));
  const [isEdit, setIsEdit] = useState(false);
  const [projectCodeInEdit, setProjectCodeInEdit] = useState("");
  const [projectName, setProjectName] = useState("");
  const [facilityId, setFacilityId] = useState(-1);
  const [financialInstitution, setFinancialInstitution] = useState({});
  const [projectCodeList, setProjectCodeList] = useState([]);
  const [financialInstitutionList, setFinancialInstitutionList] = useState([]);
  const [fromRowClick, setFromRowClick] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [facilityStatus, setFacilityStatus] = useState("");
  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
  const [validationSchema, setValidationSchema] = useState(null);
  const [facilityData, setFacilityData] = useState({
    facilityName: "",
    loanType: "Bilateral",
    status: "ACTIVE",
    loanAccountNumber: "",
    offerDate: "",
    projectAccountNo: "",
    project: {
      id: 0,
    },
  });

  useEffect(() => {
    fetchFacilityList();
    retrieveFacilityDetails();
    fetchFIProjects();
  }, []);

  let associatedProjectsIds = [];

  const fetchFacilityList = async () => {
    try {
      let payload = {};
      // let payload = {
      // 	facilityName: "",
      // };
      const response = await ManageFacilityService.getFacilityList(payload);
      const responseData = response.data.data.content;
      !_.isEmpty(responseData) && responseData.map((item) => {
        if (item.project && item.project.status.toLowerCase() === 'active') associatedProjectsIds.push(item.project.id);
      })

    } catch (error) {
      console.log("message", error.message);
      const errorMessage = error.message || "Error loading Facility";
      //this.setState({ errorMessage })
      showToast("error", errorMessage);
      history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST);
    }
  }

  const fetchFIProjects = async () => {
    let companyId = JSON.parse(localStorage.getItem("currentCompanyUUID"));
    let userId = JSON.parse(localStorage.getItem("user")).uuid;
    const response = await ManageFacilityService.getFIProjects(companyId, userId);
    const responseData = response.data.data;
    if (!_.isEmpty(associatedProjectsIds)) {
      let newResponseData = responseData.filter((item) => {
        return !associatedProjectsIds.includes(item.id);
      });
      setProjectCodeList(newResponseData);
      return;
    }

    setProjectCodeList(responseData);
  };

  const retrieveFacilityDetails = async () => {
    const query = props.location.search;
    try {
      if (!_.isEmpty(query)) {
        //means edit case
        const facilityID = query.slice(12);
        const response = await ManageFacilityService.getFacilityInfo(facilityID);
        const responseData = response.data.data;
        // if (response.data.status == "OK") {
        if (!_.isEmpty(responseData)) {
          responseData.offerDate = responseData.offerDate?.slice(0, 10);
          setFromRowClick(true);
          setMainTitle(t("ProjectFacilityDetail"));
          setFacilityData(responseData);
          let fi = {
            fiName: responseData?.project?.fiDetail?.fiName,
          };
          setFinancialInstitution(fi);
          setProjectCodeInEdit(responseData?.project?.projectCode + " (" + responseData?.project?.projectTitle + ")");
          setProjectName(responseData?.project?.projectTitle);
          setFacilityId(responseData.id);
        }
        //}
        // else {
        //     throw new Error(response.data.message);
        // }
      }
    } catch (error) {
      console.log("message", error.message);
      const errorMessage = error.message || "Error loading entity";
      //this.setState({ errorMessage })
      showToast("error", errorMessage);
      history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
    setMainTitle(t("UpdateProjectFacility"));
  };

  const handleActivateDeactivate = async (e, status) => {
    try {
      facilityData.offerDate = facilityData.offerDate?.slice(0, 10) + " 00:00:00";
      facilityData.status = status;
      setFacilityData(facilityData);
      const response = await ManageFacilityService.changeFacilityStatus(facilityData);

      if (response.data.status == "OK") {
        history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST);
        showToast("success", "Project Facility Status has been updated successfully");
      }
      else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("message", error.message);
      const errorMessage = error.message || "System error!";
      //this.setState({ errorMessage })
      showToast("error", errorMessage);
    }
  };

  const onChangeHandler = (e) => {
    if (e.target.name === "projectCode") {
      const selectedProject = projectCodeList?.find(
        (code) => code?.projectCode === e?.target?.value?.toString()
      );
      const FIInfo = selectedProject?.fiDetail || "";
      facilityData.project.id = selectedProject.id;//Number(e.target.value);
      setFacilityData(facilityData);
      setFinancialInstitution(FIInfo);
      setProjectName(selectedProject?.projectTitle);
      return;
    }
    setFacilityData({ ...facilityData, [e.target.name]: e.target.value });
  };

  const onDateHandler = (e) => {
    setFacilityData({ ...facilityData, [e.target.name]: e.target.value });
  };

  const handleInvalidSubmit = (e) => {
    console.log("iinnvalidsubmit");
    // this.setState({ ifSubmit: true });
    // this.setState({
    // 	errorMessage: "Validation error, please check your input",
    // });
    showToast("error", "Validation error, please check your input");
  };

  const handleValidSubmit = async (e) => {
    console.log("validsubmit");
    try {
      //e.preventDefault();
      facilityData.offerDate = facilityData.offerDate + " 00:00:00";
      console.log("data to be inserted>>", facilityData);

      const response = await ManageFacilityService.saveFacility(facilityData);
      console.log("res>>", response);
      history.push(URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST);
      showToast("success", "Project Facility updated successfully");
      // if (response.data.status == "OK") {
      // 	this.cancelEdit();
      // }
      // else {
      // 	throw new Error(response.data.message)
      // }
    } catch (error) {
      console.error("message", error.message);
      const errorMessage = error.message || "System error!";
      //this.setState({ errorMessage })
      showToast("error", errorMessage);
    }
  };

  return (
    <React.Fragment>
      <AvForm
        onValidSubmit={(e) => handleValidSubmit(e)}
        onInvalidSubmit={(e) => handleInvalidSubmit(e)}
      >
        <Container fluid>
          <Row className="mb-3">
            <Col md={12} lg={12}>
              <Row>
                <Col md={12} lg={12}>
                  <HeaderMain title={mainTitle} className="mb-3 mb-lg-3" />
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={12}>
                  <Card className="mt-3 mb-3">
                    <CardHeader tag="h6">{t("FacilityInformation")}</CardHeader>
                    <CardBody>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="facilityName">
                                {t("FacilityName")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  name="facilityName"
                                  type="text"
                                  className="label-required"
                                  value={facilityData.facilityName}
                                  onChange={(e) => onChangeHandler(e)}
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: t(
                                        "PleaseEnterValidFacilityName"
                                      ),
                                    },
                                  }}
                                  required
                                //disabled
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="financialInstitution">
                                {t("Financial Institution")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  type="select"
                                  name="financialInstitution"
                                  //label={t('ProjectCode')}
                                  disabled
                                  className={`${classes["inputClass"]}`}
                                //value={facilityStatus}
                                // validate={{
                                //     required: { value: true, errorMessage: t('PleaseSelectStatus') }
                                // }}
                                >
                                  <option key="" value="">
                                    {financialInstitution?.fiName || ""}
                                  </option>
                                </AvField>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {fromRowClick && (
                        <Row>
                          <Col lg={6}>
                            <Row>
                              <Col md={3} lg={3} className="label">
                                <Label for="status">{t("Status")}</Label>
                              </Col>
                              <Col md={9} lg={9}>
                                <FormGroup>
                                  <AvField
                                    type="text"
                                    name="status"
                                    disabled
                                    className={`${classes["inputClass"]}`}
                                    value={facilityData.status}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6}>
                            <Row>
                              <Col md={3} lg={3} className="label">
                                <Label for="facilityId">
                                  {t("FacilityId")}
                                </Label>
                              </Col>
                              <Col md={9} lg={9}>
                                <FormGroup>
                                  <AvField
                                    name="facilityId"
                                    type="text"
                                    className="label"
                                    value={facilityId}
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={12}>
                  <Card className="mt-3 mb-3">
                    <CardHeader tag="h6">{t("ProjectIntegration")}</CardHeader>
                    <CardBody>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="ProjectCode">
                                {t("ProjectCode")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  type="select"
                                  name="projectCode"
                                  className={`${classes["inputClass"]}`}
                                  //value={facilityData.project.id}
                                  onChange={(e) => onChangeHandler(e)}
                                  validate={{
                                    required: {
                                      value: fromRowClick === true ? false : true,
                                      errorMessage: t(
                                        "PleaseSelectProjectCode"
                                      ),
                                    },
                                  }}
                                  disabled={fromRowClick}
                                >
                                  <option key="" value="">
                                    {/* {facilityData.project.id
                                      ? facilityData.project.id
                                      : t("PleaseSelectProjectCode")} */}
                                    {facilityData.project.id && typeof (facilityData.project.id) === 'string'
                                      ? facilityData.project.id
                                      : !_.isEmpty(projectCodeInEdit) ? projectCodeInEdit :
                                        t("PleaseSelectProjectCode")}
                                  </option>
                                  {!_.isEmpty(projectCodeList) && projectCodeList.map((projectCode) => (
                                    <option
                                      key={projectCode.projectCode}
                                      value={projectCode.projectCode}
                                    >
                                      {projectCode.projectCode} ({projectCode.projectTitle})
                                    </option>
                                  ))}
                                </AvField>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="loanAccountNo">
                                {t("LoanAccountNo")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  name="loanAccountNumber"
                                  type="text"
                                  className="label-required"
                                  value={facilityData.loanAccountNumber}
                                  onChange={(e) => onChangeHandler(e)}
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: t(
                                        "PleaseEnterValidLoanAccountNo"
                                      ),
                                    },
                                    maxLength: {
                                      value: 20,
                                      errorMessage: t(
                                        "LoanAccountNoValidation"
                                      ),
                                    },
                                    //maxLength: { value: 250, errorMessage: t('LoanAccountNoValidation') }
                                  }}
                                  required
                                //disabled
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label">
                              <Label for="projectName">
                                {t("ProjectName")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  type="text"
                                  name="projectName"
                                  //label={t('ProjectCode')}
                                  disabled
                                  className={`${classes["inputClass"]}`}
                                  value={projectName}
                                  onChange={(e) => onChangeHandler(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="projectAccountNo">
                                {t("ProjectAccountNo")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  type="text"
                                  name="projectAccountNo"
                                  //label={t('ProjectCode')}
                                  //disabled
                                  className={`${classes["inputClass"]}`}
                                  value={facilityData.projectAccountNo}
                                  onChange={(e) => onChangeHandler(e)}
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: t(
                                        "PleaseEnterProjectAccountNo"
                                      ),
                                    },
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}></Col>
                        <Col lg={6}>
                          <Row>
                            <Col md={3} lg={3} className="label-required">
                              <Label for="offerDate">
                                {t("FacilityAgreement")}
                              </Label>
                            </Col>
                            <Col md={9} lg={9}>
                              <FormGroup>
                                <AvField
                                  type="date"
                                  name="offerDate"
                                  //label={t('ProjectCode')}
                                  //disabled
                                  className={`${classes["inputClass"]}`}
                                  value={facilityData.offerDate}
                                  onChange={(e) => onDateHandler(e)}
                                  //   validate={{date: {format: 'DD-MM-YYYY'}}}
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: t(
                                        "PleaseSelectFacilityAgreement"
                                      ),
                                    },
                                    date: { format: 'DD-MM-YYYY' }
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <StickyFooter>
          <Row className="justify-content-between mx-0 px-3">
            <div>
              <Link to={URL_CONFIG.FACILITY_ROUTES_PATH.FACILITY_LIST}>
                <Button color="secondary" className={`mr-2`}>
                  {t('Back')}
                </Button>
              </Link>
            </div>
            <div>
              {fromRowClick &&
                facilityData?.status?.toLowerCase() === "active" && (
                  <Button
                    color="danger"
                    className={`${classes["inputTextButton"]} mb-2 mr-2 px-3`}
                    onClick={(e) => handleActivateDeactivate(e, "INACTIVE")}
                  >
                    Deactivate
                  </Button>
                )}
              {fromRowClick &&
                facilityData?.status?.toLowerCase() === "inactive" && (
                  <Button
                    color="primary"
                    className={`${classes["inputTextButton"]} mb-2 mr-2 px-3`}
                    onClick={(e) => handleActivateDeactivate(e, "ACTIVE")}
                  >
                    Activate
                  </Button>
                )}
              {fromRowClick && !isEdit && (
                <Button
                  color="facebook"
                  className={`${classes["inputTextButton"]} mb-2 mr-2 px-3`}
                  onClick={() => handleEdit()}
                >
                  Edit
                  <i className="fa fa-pencil ml-1" />
                </Button>
              )}
              {(!fromRowClick || (fromRowClick && isEdit)) && (
                <Button
                  color="primary"
                  className={`${classes["inputTextButton"]}  mb-2 mr-2 px-3`}
                >
                  {t("Save")}
                </Button>
              )}
            </div>
          </Row>
        </StickyFooter>
      </AvForm>
      {Prompt}
    </React.Fragment>
  );
}
const CreateFacility = withTranslation()(CreateFacility1);
export default CreateFacility;
