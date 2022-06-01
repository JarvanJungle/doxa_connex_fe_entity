import React from 'react';
import { useState } from "react";

// the hoc
import { withTranslation } from 'react-i18next';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
import {
    Container,
    Row,
    Nav,
    NavItem,
    NavLink,
    UncontrolledModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    CustomInput,
    Card,
    CardBody,
    CardHeader,
    Media,
    FormGroup,
    Col, Label, Input, ButtonGroup, ButtonToolbar, Layout
} from 'components';
import {
    AgGridReact
} from 'components/agGrid';
import { HeaderMain } from "routes/components/HeaderMain";
import { HeaderSecondary } from "routes/components/HeaderSecondary";

import classes from './ViewFIEntityDetails.scss';

import FinancialInstitutionsService from 'services/FinancialInstitutionsService';
import UserDataService from 'services/UserService'
import { StickyFooter } from 'components/StickyFooter/StickyFooter';

import URL_CONFIG from 'services/urlConfig'
import PrivilegesService from 'services/PrivilegesService';
import DialCodes from "/public/assets/DialCodes";
import {v4 as uuidv4} from "uuid";
import useToast from "routes/hooks/useToast";
import {Link, Prompt} from "react-router-dom";
import _ from 'lodash';
import AddProjectsModal from './AddProjectsModal';
import AddEntitiesModal from './AddEntitiesModal';
import FIAddress from './FIAddress';

const LAYOUT = {
    'metric-v-target-users': { h: 6, md: 4 },
    'metric-v-target-sessions': { h: 6, md: 4 },
    'metric-v-target-pageviews': { h: 6, md: 4 },
    'analytics-audience-metrics': { h: 9, minH: 7 },
    'traffic-channels': { md: 6, h: 6 },
    'sessions': { md: 6, h: 6, maxH: 9, minW: 3 },
    'spend': { md: 6, h: 7 },
    'website-performance': { md: 6, h: 11 },
    'organic-traffic': { md: 6, h: 10 }
}

const showToast = useToast();

const user = JSON.parse(localStorage.getItem("user"));

const tabList= [
    { id: 1, name: "Contact Information" },
    { id: 2, name: "Security & Login", icon: "fa fa-unlock-alt" },
];

class ViewFIEntityDetails1 extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date(),
      date =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
    this.gridRef = React.createRef();
    this.gridInvoiceRef = React.createRef();
    this.state = {
      activeTab: 1,
      developerFinancingModule: false,
      invoiceFinancingModule: false,
      fiUuid: "",
      user:{},
      isEdit: false,
      errorMessage: "",
      coreModules: [],
      id: "",
      FICode: "",
      FIName: "",
      country: "",
      workPhone: "",
      countryCode: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      countryList: [],
      remark: "",
      fiPortal: false,
      status: "",
      projects: [],
      entities: [],
      successMessage: "",
      active: true,

      projectCodeList: [],
      entityTypeList: [],
      industryTypeList: [],

      defaultColDef: {
        editable: false,
        filter: "agTextColumnFilter",
        sizeColumnsToFit: true,
        autoSizeAllColumns: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
      },
      tableColDefs: [
        {
          headerName: this.props.t("Project Code"),
          field: "projectCode",
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        {
          headerName: this.props.t("Project Title"),
          field: "projectTitle",
          width: "255px",
        },
        {
          headerName: this.props.t("Entity Name"),
          field: "companyName",
          width: "255px",
        },
      ],
      invoiceTableColDefs: [
        {
          headerName: this.props.t("Entity Name"),
          field: "companyName",
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
      ],
      defaultColDefPaymentTable: {
        editable: false,
        // filter: 'agTextColumnFilter',
        sizeColumnsToFit: true,
        flex: 1,
        // autoSizeAllColumns: true,
        // floatingFilter: true,
        // resizable: true,
      },
      paymentColDefs: [
        {
          headerName: this.props.t("Entity Name"),
          field: "companyName",
        },
        {
          headerName: this.props.t("Status"),
          field: "status",
          // width: "221px",
          cellRenderer: ({ value }) => {
            return value?.toLowerCase() === "inactive" ||
              value?.toLowerCase() === "deactivate"
              ? "INACTIVE"
              : "ACTIVE";
          },
        },
        {
          headerName: this.props.t("Project Code"),
          field: "projectCode",
        },
        {
          headerName: this.props.t("Project Title"),
          field: "projectTitle",
        },
        // {
        //     headerName: this.props.t('Action'),
        //     field: "action",
        //     width: "227px",
        //     suppressSizeToFit: false,
        //     cellRenderer: (params) => viewRenderer(params)
        // }
      ],
      invoiceColDefs: [
        {
          headerName: this.props.t("Entity Name"),
          field: "companyName",
        },
        {
          headerName: this.props.t("Status"),
          field: "status",
          // width: "221px",
          cellRenderer: ({ value }) => {
            return value?.toLowerCase() === "inactive" ||
              value?.toLowerCase() === "deactivate"
              ? "INACTIVE"
              : "ACTIVE";
          },
        },
        // {
        //     headerName: this.props.t('Action'),
        //     field: "action",
        //     width: "227px",
        //     suppressSizeToFit: false,
        //     cellRenderer: (params) => viewRenderer(params)
        // }
      ],
      addNewProjectModal: false,
      addNewEntityModal: false,
    };

    // const viewRenderer = (params) => {
    //     //let cursorSymbol = this.state.isEdit ? "pointer" : "not-allowed";
    //     if (params.data?.status?.toLowerCase() === 'deactivate' || params.data?.status?.toLowerCase() === 'inactive') {
    //         return "<span style=\"color:navy; cursor: pointer;\"><i class=\"fa fa-plus\" style=\"font-size:15px;color:navy\"></i>&emsp;Activate</span>";
    //     }
    //     return "<span style=\"color:red; cursor: pointer;\"><i class=\"fa fa-close\" style=\"font-size:15px;color:red\"></i>&emsp;Deactivate</span>";
    //     // return "<span style=\"color:red; cursor: "+ cursorSymbol +";\"><i class=\"fa fa-close\" style=\"font-size:15px;color:red\"></i>&emsp;Deactivate</span>";
    // };

    this.changeAddressHandler = this.changeAddressHandler.bind(this);
    this.changeCountryHandler = this.changeCountryHandler.bind(this);
    this.changePostalCodeHandler = this.changePostalCodeHandler.bind(this);
    this.changeFICodeHandler = this.changeFICodeHandler.bind(this);
    this.changeUserNameHandler = this.changeUserNameHandler.bind(this);
    this.changeEmailHandler = this.changeEmailHandler.bind(this);
    this.changeWorkPhoneHandler = this.changeWorkPhoneHandler.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.changeAutSigNameHandler = this.changeAutSigNameHandler.bind(this);
    this.changeAutSigEmailHandler = this.changeAutSigEmailHandler.bind(this);
    this.changeAutSigPhoneHandler = this.changeAutSigPhoneHandler.bind(this);
    this.changeEntAdmNameHandler = this.changeEntAdmNameHandler.bind(this);
    this.changeEntAdmEmailHandler = this.changeEntAdmEmailHandler.bind(this);
    this.changeEntAdmPhoneHandler = this.changeEntAdmPhoneHandler.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleDoNothing = this.handleDoNothing.bind(this);

    this.gridApi = null;
    this.gridModuleApi = null;
    this.gridInvoiceApi = null;

    this.onDeveloperGridReady = this.onDeveloperGridReady.bind(this);
    this.onInvoiceGridReady = this.onInvoiceGridReady.bind(this);
    this.onGridReady = this.onGridReady.bind(this);
    this.onModelUpdated = this.onModelUpdated.bind(this);
    this.onQuickFilterChange = this.onQuickFilterChange.bind(this);

    this.statusColClicked = this.statusColClicked.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.retrieveEntityDetails = this.retrieveEntityDetails.bind(this);
    this.fetchCountries = this.fetchCountries.bind(this);
    this.fetchFIProjects = this.fetchFIProjects.bind(this);
    this.handleAddProject = this.handleAddProject.bind(this);
    this.handleAddEntity = this.handleAddEntity.bind(this);
    this.handleFIStatus = this.handleFIStatus.bind(this);
    this.handleSelectedFeature = this.handleSelectedFeature.bind(this);

    this.onValueChangeIsBuyer = this.onValueChangeIsBuyer.bind(this);
    this.onValueChangeIsSupplier = this.onValueChangeIsSupplier.bind(this);
    this.onValueChangeIsDeveloper = this.onValueChangeIsDeveloper.bind(this);
  }

  handleClickActiveTab(currentTab) {
    this.setState({ activeTab: currentTab });
  }

  handleCheckboxSelection = (data) => {
    let selectedNodes = data.api.getSelectedNodes();
    let devFinancingModule = [];
    devFinancingModule = selectedNodes.filter(
      (item) => item.data.financingType === "Developer Financing"
    );
    let invFinancingModule = [];
    invFinancingModule = selectedNodes.filter(
      (item) => item.data.financingType === "Invoice Financing"
    );
    if (devFinancingModule.length !== 0) {
      this.setState({ developerFinancingModule: true });
    } else if (devFinancingModule.length === 0) {
      this.setState({ developerFinancingModule: false });
    }
    if (invFinancingModule.length !== 0) {
        this.setState({ invoiceFinancingModule: true });
    } else if (invFinancingModule.length === 0) {
        this.setState({ invoiceFinancingModule: false });
    }
  };

  componentDidMount() {
    this.fetchCountries();
    this.retrieveEntityDetails();
  }

  handleSelectedFeature(featureCode, { features, moduleCode }) {
    this.setState((state) => {
      state.assignedFeatures[featureCode] =
        !state.assignedFeatures[featureCode];
      state.moduleCheckedAll[moduleCode] = features.every(
        (feature) => state.assignedFeatures[feature.featureCode]
      );
      return state;
    });
  }

  changeModuleCheckedAll = (module) => {
    this.setState((state) => {
      module.features.forEach(({ featureCode }) => {
        state.assignedFeatures[featureCode] =
          !state.moduleCheckedAll[module.moduleCode];
      });
      state.moduleCheckedAll[module.moduleCode] =
        !state.moduleCheckedAll[module.moduleCode];
      return state;
    });
  };

  setMainCompany(companies) {
    this.setState({ mainCompany: companies.find((e) => e.mainCompany) });
  }

  setCurrentSubscription(features) {
    for (const feature of features) {
      this.state.assignedFeatures[feature.featureCode] = true;
    }
  }

  fetchCountries = async () => {
    const response = await FinancialInstitutionsService.getCountries();
    const responseData = response.data.data;
    this.setState({ countryList: responseData });
  };

  fetchFIProjects = async () => {
    // let companyId = JSON.parse(localStorage.getItem("currentCompanyUUID"));
    // let userId = JSON.parse(localStorage.getItem("user")).uuid;
    const response = await FinancialInstitutionsService.getFIProjects();
    const responseData = response.content;
    // const responseData = response.data;
    this.setState({ projectCodeList: responseData });
  };

  retrieveEntityDetails = async () => {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get("uuid");
    try {
      const response = await FinancialInstitutionsService.getEntity(token);
      const responseData = response.data.data;
      if (responseData !== null) {
        this.setState({
          id: responseData.id,
          FICode: responseData.fiCode,
          FIName: responseData.fiName,
          userName: responseData.users[0].name,
          email: responseData.users[0].email,
          workPhone: responseData.users[0].workNumber,
          countryCode: responseData.users[0].countryCode,
          destination: responseData.users[0].designation,
          status: responseData.status,
          remark: responseData.users[0].remarks || "",
          fiPortal: responseData.fiportal || false,
          // addressLine1: responseData.addressLine1,
          // addressLine2: responseData.addressLine2,
          // postalCode: responseData.postalCode,
          // country: responseData.country,
          projects: responseData.projects || [],
          entities: responseData.companies,
          developerFinancingModule: (responseData.features.indexOf("DEVF") !== -1) ? true:false,
          invoiceFinancingModule: (responseData.features.indexOf("INVF") !== -1) ? true:false,
          fiUuid: responseData.fiUuid,  
          user: responseData.users[0],     
        });
        let state = this.state;
        this.gridModuleApi?.forEachNode(function (node) {
          if(node.data.financingType === "Developer Financing" && state.developerFinancingModule) {
            node.setSelected(true);
          } else if(node.data.financingType === "Invoice Financing" && state.invoiceFinancingModule) {
            node.setSelected(true);
          } else {
            node.setSelected(false);
          }
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log("message", error?.message);
      const errorMessage = error?.message || "Error loading entity";
      this.setState({ errorMessage });
      showToast("error", errorMessage);
      // this.props.history.push(URL_CONFIG.FI_LIST_ENTITIES)
    }
  };

  state = {
    layouts: _.clone(LAYOUT),
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.gridApi) {
      if (this.state.quickFilterValue !== prevState.quickFilterValue) {
        this.gridApi.setQuickFilter(this.state.quickFilterValue);
      }
    }
  }

  onModelUpdated() {
    if (this.gridApi) {
      const model = this.gridApi.getModel();
      const visibleCount = model.getRowCount();
      this.setState({ visibleCount });
    }
  }

  initCheckboxAll() {
    this.setState((state) => {
      this?.state?.coreModules?.forEach(({ moduleCode, features }) => {
        state.moduleCheckedAll[moduleCode] = features.every(
          (feature) => state.assignedFeatures[feature.featureCode]
        );
      });
      return state;
    });
  }

  onDeveloperGridReady({ api, columnApi }) {
    this.gridApi = api;
    this.gridRef = api;
    this.gridColumnApi = columnApi;
  }

  onGridReady = ({ api }) => {
    this.gridModuleApi = api;
    let state = this.state;
    this.gridModuleApi.forEachNode(function (node) {
      if(node.data.financingType === "Developer Financing" && state.developerFinancingModule) {
        node.setSelected(true);
      } else if(node.data.financingType === "Invoice Financing" && state.invoiceFinancingModule) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });
  };   

  onInvoiceGridReady({ api, columnApi }) {
    this.gridInvoiceApi = api;
    this.gridInvoiceRef = api;
    this.gridColumnApi = columnApi;
  }

  onQuickFilterChange(e) {
    this.setState({ quickFilterValue: e.target.value });
  }

  _resetLayout = () => {
    this.setState({
      layouts: _.clone(LAYOUT),
    });
  };

  state = {
    layouts: _.clone(LAYOUT),
  };

  _resetLayout = () => {
    this.setState({
      layouts: _.clone(LAYOUT),
    });
  };

  changeFICodeHandler = (event) => {
    this.setState({ FICode: event.target.value });
  };

  changeFINameHandler = (event) => {
    this.setState({ FIName: event.target.value });
  };

  selectCountry = (event) => {
    this.setState({ country: event.target.value });
  };

  changeRemark = (event) => {
    this.setState({ remark: event.target.value });
  };

  changeFIPortalRadio = (event) => {
    if(event.target.value === "no") {
      this.setState({ fiPortal: false });
    } else if(event.target.value === "yes") {
      this.setState({ fiPortal: true });
    }
  };

  changeUserNameHandler = (event) => {
    this.setState({ userName: event.target.value });
  };

  changeEmailHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  changeWorkPhoneHandler = (event) => {
    this.setState({ workPhone: event.target.value });
  };

  onChangeValue = (field) => (event) => {
    event.persist();
    this.setState((prevState) => ({
      ...prevState,
      [field]: event?.target?.value || event?.currentTarget?.value,
    }));
  };

  changeAutSigNameHandler = (event) => {
    this.setState({ authorizedSigName: event.target.value });
  };

  changeAutSigEmailHandler = (event) => {
    this.setState({ authorizedSigEmail: event.target.value });
  };

  changeAutSigPhoneHandler = (event) => {
    this.setState({ authorizedSigPhone: event.target.value });
  };

  changeEntAdmNameHandler = (event) => {
    this.setState({ entityAdmName: event.target.value });
  };

  changeEntAdmEmailHandler = (event) => {
    this.setState({ entityAdmEmail: event.target.value });
  };

  changeAddressHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  changeCountryHandler = (event) => {
    this.setState({ country: event.target.value });
  };

  changePostalCodeHandler = (event) => {
    this.setState({ postalCode: event.target.value });
  };

  changeEntAdmPhoneHandler = (event) => {
    let tryParse = isNaN(event.target.value);
    this.setState({ entityAdmPhone: event.target.value });
    if (event.target.value == "" || tryParse == true) {
      this.setState({ entityAdmPhoneErrors: true });
    } else {
      this.setState({ entityAdmPhoneErrors: false });
    }
  };
  handleFileUpload = async (event) => {
    try {
      const data = new FormData();
      data.append("file", event.target.files[0]);
      data.append("category", "entity-management/company-documents");
      data.append("uploaderRole", "user");
      const response = await EntitiesService.uploadDocuments(data);
      const responseData = response.data.data;
      if (response.data.status == "OK") {
        this.createNewRowData(responseData.fileName, responseData.guid);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("message", error.message);
      const errorMessage = error.message || "System error!";
      this.setState({ errorMessage });
      showToast("error", errorMessage);
    }
  };

  createNewRowData(fileName, guidResponse) {
    var today = new Date();
    var day = "";
    var month = "";
    if (today.getDate() < 10) {
      day = "0" + today.getDate();
    } else {
      day = today.getDate();
    }
    if (today.getMonth() + 1 < 10) {
      month = "0" + (today.getMonth() + 1);
    } else {
      month = today.getMonth() + 1;
    }
    var date = day + "/" + month + "/" + today.getFullYear();
    let arr = this.state.documentList.slice();
    let newRow = {
      title: "",
      fileName: fileName,
      guid: guidResponse,
      createdAt: date,
      updatedAt: date,
    };
    this.setState({
      documentTitleErrors: true,
    });
    arr.push(newRow);
    this.setState({ documentList: arr });
  }

  handleInvalidSubmit = (e) => {
    this.setState({ ifSubmit: true });
    this.setState({
      errorMessage: "Validation error, please check your input",
    });
    showToast("error", "Validation error, please check your input");
  };

  handleFIStatus = async (e, value) => {
    const {
      id,
      userName,
      email,
      workPhone,
      countryCode,
      destination,
      remark,
      FIName,
      FICode,
      projects,
      entities,
      // addressLine1,
      // addressLine2,
      // postalCode,
      // country,
      fiPortal,
      developerFinancingModule,
      invoiceFinancingModule,
      fiUuid,
      user
    } = this.state;
    try {
      e.persist();
      let features = [];
      if (developerFinancingModule) {
        features.push("DEVF")
      }
      if (invoiceFinancingModule) {
        features.push("INVF")
      }
      let updateRequest = {
        id: id,
        fiCode: FICode,
        fiName: FIName,
        status:
          value.toLowerCase() === "associated" ||
          value.toLowerCase() === "active"
            ? "DEACTIVATED"
            : "ASSOCIATED",
        fiportal: fiPortal,
        developerFinancing: developerFinancingModule,
        invoiceFinancing: invoiceFinancingModule,
        fiUuid: fiUuid,
        features:features,
        users: [
          {
            // "id": 1115,
            name: userName,
            email: email,
            workNumber: workPhone,
            designation: destination,
            // "password": null,
            remarks: remark,
            countryCode: countryCode,
            uuid: user.uuid,
            // "role": null,
            // "companyUuid": null,
            // "loggedInUserUuid": null,
            // "fiCode": null,
            // "fiName": null,
            // "fiUuid": null,
            // "fiId": null
        },
        ],
        projects: projects,
        companies: entities
      };
      console.log('updateRequest',updateRequest);
      const response = await FinancialInstitutionsService.updateEntity(
        updateRequest
      );
      if (response.data.status == "OK") {
        showToast(
          "success",
          "Financial Institution has been updated successfully"
        );
        this.cancelEdit();
        this.props.history.push(URL_CONFIG.FI_LIST_ENTITIES);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("message", error.message);
      const errorMessage = error.message || "System error!";
      this.setState({ errorMessage });
      showToast("error", errorMessage);
    }
  };

  handleValidSubmit = async (e) => {
    const {
      id,
      userName,
      email,
      workPhone,
      countryCode,
      destination,
      status,
      remark,
      FIName,
      FICode,
      projects,
      entities,
      // addressLine1,
      // addressLine2,
      // postalCode,
      // country,
      fiPortal,
      developerFinancingModule,
      invoiceFinancingModule,
      fiUuid,
      user
    } = this.state;
    this.setState({ ifSubmit: true });
    try {
      e.persist();
      let features = [];
      if (developerFinancingModule) {
        features.push("DEVF")
      }
      if (invoiceFinancingModule) {
        features.push("INVF")
      }
      let updateRequest = {
        id: id,
        fiCode: FICode,
        fiName: FIName,
        status: status,
        fiportal: fiPortal,
        developerFinancing: developerFinancingModule,
        invoiceFinancing: invoiceFinancingModule,
        fiUuid: fiUuid,
        features:features,
        users: [
          {
            // "id": 1115,
            name: userName,
            email: email,
            workNumber: workPhone,
            designation: destination,
            // "password": null,
            remarks: remark,
            countryCode: countryCode,
            uuid: user.uuid,
            // "role": null,
            // "companyUuid": null,
            // "loggedInUserUuid": null,
            // "fiCode": null,
            // "fiName": null,
            // "fiUuid": null,
            // "fiId": null
        },
        ],
        projects: projects,
        companies: entities
      };
      console.log('updateRequest',updateRequest);
      const response = await FinancialInstitutionsService.updateEntity(
        updateRequest
      );
      if (response.data.status == "OK") {
        showToast("success", "FI updated successfully");
        this.cancelEdit();
        this.props.history.push(URL_CONFIG.FI_LIST_ENTITIES);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("message", error.message);
      const errorMessage = error.message || "System error!";
      showToast("error", errorMessage);
    }
  };

  statusColClicked = async (event) => {
    let { api, rowIndex, colDef } = event;
    if (colDef.headerName == "Action") {
      let { projects } = this.state;
      try {
        // if (this.state.isEdit === false) {
        //     return;
        // }
        let rowNode = api.getRowNode(rowIndex.toString());
        let status =
          rowNode.data.status.toLowerCase() === "inactive" ||
          rowNode.data.status.toLowerCase() === "deactivate"
            ? "ACTIVE"
            : "INACTIVE";
        projects = _.map(projects, (item) => {
          if (
            item.id == rowNode.data.id ||
            (item.uuid && rowNode.data.uuid && item.uuid == rowNode.data.uuid)
          ) {
            item.status = status;
          }
          return item;
        });
        this.setState({ projects });
        rowNode.setData({
          companyName: rowNode.data.companyName,
          id: rowIndex.toString(),
          projectCode: rowNode.data.projectCode,
          projectStatus: rowNode.data.projectStatus,
          projectTitle: rowNode.data.projectTitle,
          status: status,
        });
      } catch (error) {
        console.error("message", error?.message);
        const errorMessage = error?.message || "System error!";
        this.setState({ errorMessage });
        showToast("error", errorMessage);
      }
    }
  };

  statusInvoiceColClicked = async (event) => {
    let { api, rowIndex, colDef } = event;
    if (colDef.headerName == "Action") {
      let { entities } = this.state;
      try {
        // if (this.state.isEdit === false) {
        //     return;
        // }
        let rowNode = api.getRowNode(rowIndex.toString());
        let status =
          rowNode.data.status.toLowerCase() === "inactive" ||
          rowNode.data.status.toLowerCase() === "deactivate"
            ? "ACTIVE"
            : "INACTIVE";
            entities = _.map(entities, (item) => {
          if (
            item.id == rowNode.data.id ||
            (item.uuid && rowNode.data.uuid && item.uuid == rowNode.data.uuid)
          ) {
            item.status = status;
          }
          return item;
        });
        this.setState({ entities });
        rowNode.setData({
          companyName: rowNode.data.companyName,
          id: rowIndex.toString(),
          projectCode: rowNode.data.projectCode,
          projectStatus: rowNode.data.projectStatus,
          projectTitle: rowNode.data.projectTitle,
          status: status,
        });
      } catch (error) {
        console.error("message", error?.message);
        const errorMessage = error?.message || "System error!";
        this.setState({ errorMessage });
        showToast("error", errorMessage);
      }
    }
  };

  // setEdit() {
  //     // let newRowData = this.state.projects.map((row, index) => {
  //     //     return row;
  //     // });
  //     this.setState({ isEdit: true/*, projects: newRowData*/ })
  // }
  setEdit() {
    this.setState({ isEdit: true });
    this.state.paymentColDefs.push({
      headerName: this.props.t("Action"),
      field: "status",
      // width: "227px",
      suppressSizeToFit: false,
      cellRenderer: ({ value }) => {
        if (
          value?.toLowerCase() === "deactivate" ||
          value?.toLowerCase() === "inactive"
        ) {
          return '<span style="color:navy; cursor: pointer;"><i class="fa fa-plus" style="font-size:15px;color:navy"></i>&emsp;Activate</span>';
        }
        return '<span style="color:red; cursor: pointer;"><i class="fa fa-close" style="font-size:15px;color:red"></i>&emsp;Deactivate</span>';
      },
    });
    if(this.gridApi) {
      this.gridApi.setColumnDefs(this.state.paymentColDefs);
    }
    
    this.state.invoiceColDefs.push({
        headerName: this.props.t("Action"),
        field: "status",
        // width: "227px",
        suppressSizeToFit: false,
        cellRenderer: ({ value }) => {
          if (
            value?.toLowerCase() === "deactivate" ||
            value?.toLowerCase() === "inactive"
          ) {
            return '<span style="color:navy; cursor: pointer;"><i class="fa fa-plus" style="font-size:15px;color:navy"></i>&emsp;Activate</span>';
          }
          return '<span style="color:red; cursor: pointer;"><i class="fa fa-close" style="font-size:15px;color:red"></i>&emsp;Deactivate</span>';
        },
      });
      if(this.gridInvoiceApi) {
        this.gridInvoiceApi.setColumnDefs(this.state.invoiceColDefs);
      }
  }

  cancelEdit() {
    this.setState({ isEdit: false });
    let index = this.state.paymentColDefs.filter(
      (item) => item.headerName === this.props.t("Action")
    );
    if (index.length > 0) {
      index = this.state.paymentColDefs.indexOf(index[0]);
    }
    if (index > -1) {
      this.state.paymentColDefs.splice(index, 1);
    }
    if(this.gridApi) {
      this.gridApi.setColumnDefs(this.state.paymentColDefs);
    }
    
    index = this.state.invoiceColDefs.filter(
        (item) => item.headerName === this.props.t("Action")
      );
      if (index.length > 0) {
        index = this.state.invoiceColDefs.indexOf(index[0]);
      }
      if (index > -1) {
        this.state.invoiceColDefs.splice(index, 1);
      }
      if(this.gridInvoiceApi) {
        this.gridInvoiceApi.setColumnDefs(this.state.invoiceColDefs);
      }
    this.retrieveEntityDetails();
  }

  handleDoNothing() {}

  onValueChangeIsBuyer(event) {
    this.setState({
      buyer: !this.state.buyer,
    });
  }
  onValueChangeIsSupplier(event) {
    this.setState({
      supplier: !this.state.supplier,
    });
  }
  onValueChangeIsDeveloper(event) {
    this.setState({
      supplier: !this.state.supplier,
    });
  }

  handleAddProject = (selectedProjects) => {
    if (selectedProjects.length) {
      const selectedNodes = selectedProjects;
      let selectedData = selectedNodes?.[0]["data"];
      selectedData["status"] = "ACTIVE";
      let updateProject = [];
      updateProject = [...this.state.projects, selectedData];
      this.setState({ projects: updateProject, addNewProjectModal: false });
    }
  };

  handleAddEntity = (selectedEntities) => {
    if (selectedEntities.length) {
      const selectedNodes = selectedEntities;
      let selectedData = selectedNodes?.[0]["data"];
      selectedData["status"] = "ACTIVE";
      let updateEntity = [];
      updateEntity = [...this.state.entities, selectedData];
      this.setState({ entities: updateEntity, addNewEntityModal: false });
    }
  };

  handleAddNewProject(modal) {
    this.setState({ addNewProjectModal: modal });
  }

  handleAddNewEntity(modal) {
    this.setState({ addNewEntityModal: modal });
  }

  render() {
    const { t, i18n } = this.props;

    console.log("user", user);

    const columnDefs = [
      {
        headerName: t("Payment and Financing"),
        field: "financingType",
      },
      {
        headerName: t("Active"),
        // field: "active",
        checkboxSelection: true,
        cellStyle: (params) => {
          if (this.state.isEdit) {
            return "";
          } else {
            return { "pointer-events": "none", opacity: "0.4" };
          }
        },
      },
    ];
    const rowData = [
      {
        financingType: "Developer Financing",
        active: false,
      },
      {
        financingType: "Invoice Financing",
        active: false,
      },
    ];
    const defaultColDef = {
      editable: false,
      sizeColumnsToFit: true,
      flex: 1,
    };
    // var gridApi = null;

    // const onGridReady = ({ api }) => {
    //   gridApi = api;
    //   console.log('developerFinancingModule', this.state.developerFinancingModule);
    //   let state = this.state;
    //   gridApi.forEachNode(function (node) {
    //       if(node.data.financingType === "Developer Financing" && state.developerFinancingModule) {
    //         node.setSelected(true);
    //       }
    //       if(node.data.financingType === "Invoice Financing" && state.invoiceFinancingModule) {
    //         node.setSelected(true);
    //       }
    //   });
    // };    

    const handleTwoFAReset = () => {
      UserDataService.resetTwoFA({ uuid: user.uuid })
        .then((response) => {
          if (response.data.status === "OK") {
            showToast("success", "Two FA Reset Successful");
          } else {
            showToast("error", response.data.message);
          }
        })
        .catch((error) => {
          showToast(
            "error",
            error.response ? error.response.data.message : error.message
          );
        });
    };

    return (
      <React.Fragment>
        <AvForm
          onValidSubmit={this.handleValidSubmit}
          onInvalidSubmit={this.handleInvalidSubmit}
        >
          <Container fluid={true} className={classes["custom-container"]}>
            <HeaderMain
              title={t("FinancialInstitutionDetail")}
              className="mb-3"
            />
            <HeaderSecondary title={t("GeneralInformation")} className="mb-3" />
            <Card className="mt-3">
              <CardHeader tag="h6">{t("FinancialInstitution")}</CardHeader>
              <CardBody className={`${classes["mbMinus2"]}`}>
                <Row className={`${classes["rowClass"]}`}>
                  <Col>
                    <Row className={`label-required`}>
                      <Label
                        for="FICode"
                        className={`${classes["paddingCenter"]} ${classes["fiCode"]} mr-5 ml-1`}
                      >
                        {t("FICode")}
                      </Label>
                      <FormGroup>
                        <AvField
                          type="text"
                          name="FICode"
                          //label={t('FICode')}
                          placeholder={t("EnterFICode")}
                          className={`${classes["inputClassNew"]}`}
                          value={this.state.FICode}
                          // onChange={this.changeFICodeHandler}
                          // validate={{
                          //     required: { value: true, errorMessage: t('EnterFICode') },
                          //     minLength: { value: 2, errorMessage: t('FICodeValidation') },
                          //     maxLength: { value: 250, errorMessage: t('FICodeValidation') }
                          // }}
                          // required
                          disabled
                        />
                      </FormGroup>
                    </Row>
                  </Col>
                  <Col>
                    <Row className={`label-required`}>
                      <Label
                        for="FIName"
                        className={`${classes["paddingCenter"]} ${classes["fiName"]} mr-4`}
                      >
                        {t("FIName")}
                      </Label>
                      <FormGroup>
                        <AvField
                          type="text"
                          name="FIName"
                          className={`${classes["inputClassNew"]}`}
                          placeholder={t("EnterFIName")}
                          value={this.state.FIName}
                          // label={t('FIName')}
                          //onChange={this.changeFINameHandler}
                          // validate={{
                          //     required: { value: true, errorMessage: t('EnterFIName') },
                          //     minLength: { value: 2, errorMessage: t('FINameValidation') },
                          //     maxLength: { value: 50, errorMessage: t('FINameValidation') }
                          // }}
                          // required
                          disabled
                        />
                      </FormGroup>
                    </Row>
                    <Row className={`label`}>
                      <Label
                        for="Status"
                        className={`${classes["paddingCenter"]} ${classes["status"]}`}
                      >
                        {t("Status")}
                      </Label>
                      <FormGroup>
                        <AvField
                          type="text"
                          name="Status"
                          className={`${classes["inputClassNewStatus"]}`}
                          placeholder={t("Enter Status")}
                          value={this.state.status}
                          // label={t('Status')}
                          // onChange={this.changeStatusHandler}
                          // validate={{
                          //     required: { value: true, errorMessage: t('EnterFIName') },
                          //     minLength: { value: 2, errorMessage: t('FINameValidation') },
                          //     maxLength: { value: 50, errorMessage: t('FINameValidation') }
                          // }}
                          disabled
                        />
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {/* <FIAddress
              countryList={this.state.countryList}
              addressLine1={this.state.addressLine1}
              addressLine2={this.state.addressLine2}
              country={this.state.country}
              changeCountryHandler={this.changeCountryHandler}
              changeAddressHandler={this.changeAddressHandler}
              changePostalCodeHandler={this.changePostalCodeHandler}
              postalCode={this.state.postalCode}
              isEdit={this.state.isEdit}
            /> */}

            <Row className="mt-3">
              <Col>
                <Nav tabs className={classes.navTabs}>
                  {tabList.map((tab) => (
                    <NavItem key={tab.id}>
                      <NavLink
                        href="#"
                        className={
                          this.state.activeTab === tab.id ? "active" : null
                        }
                        onClick={() => this.handleClickActiveTab(tab.id)}
                      >
                        <i
                          className={`${
                            tab.icon || "fa fa-fw fa-file-text"
                          } mr-2`}
                        />
                        <span className={classes.navTabs}>{tab.name}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                {this.state.activeTab === 1 && (
                  <Card>
                    {/* <CardHeader tag="h6">{t("ContactInformation")}</CardHeader> */}
                    <CardBody className={`${classes["mbMinus2"]}`}>
                      <Row className={`${classes["rowClass"]}`}>
                        <Col>
                          <Row className={`label-required`}>
                            <Label
                              for="userName"
                              className={`${classes["paddingCenter"]} mr-5 ml-1`}
                            >
                              {t("UserName")}
                            </Label>
                            <FormGroup>
                              <AvField
                                type="text"
                                name="userName"
                                // label={`${t('UserName')}`}
                                className={`${classes["inputClassNew"]}`}
                                placeholder={t("EnterUserName")}
                                value={this.state.userName}
                                onChange={this.changeUserNameHandler}
                                validate={{
                                  required: {
                                    value: true,
                                    errorMessage: t("EnterUserName"),
                                  },
                                  minLength: {
                                    value: 2,
                                    errorMessage: t("EntityRepNameValidation"),
                                  },
                                  maxLength: {
                                    value: 250,
                                    errorMessage: t("EntityRepNameValidation"),
                                  },
                                }}
                                disabled={!this.state.isEdit}
                                required
                              />
                            </FormGroup>
                          </Row>
                          <Row className="label-required">
                            {/* <Label htmlFor="workNumber" className={`${classes["paddingCenter"]} mr-5 ml-1`}>
                                        {t("Phone")}
                                    </Label> */}
                            <FormGroup>
                              <Row>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={3}
                                  className="pr-0 ml-2.5"
                                >
                                  <label
                                    htmlFor="workNumber"
                                    className={`${classes["paddingCenter"]}`}
                                  >
                                    {t("Phone")}
                                  </label>
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={3}
                                  className={`${classes["dialCode"]} pr-0`}
                                >
                                  <AvField
                                    type="select"
                                    name="entityRepDialog"
                                    className={`${classes["paddingCenterWidth"]}`}
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage: t("DialCodeRequired"),
                                      },
                                    }}
                                    value={this.state.countryCode}
                                    onChange={this.onChangeValue("countryCode")}
                                    disabled={!this.state.isEdit}
                                  >
                                    <option value="" hidden defaultValue>
                                      {t("DialCode")}
                                    </option>
                                    {DialCodes.dialCodes.map((code) => (
                                      <option
                                        key={uuidv4()}
                                        value={code.value}
                                        data-subtext={code.label}
                                      >
                                        {this.state.entityRepDialog ===
                                        code.value
                                          ? `+${code.value}`
                                          : `${code.label} (+${code.value})`}
                                      </option>
                                    ))}
                                  </AvField>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                  <FormGroup className="label-required">
                                    <AvField
                                      type="text"
                                      name="entityRepPhone"
                                      placeholder={t("EnterEntityRepPhone")}
                                      className={`${classes["paddingCenterInputWidth"]}`}
                                      value={this.state.workPhone}
                                      onChange={this.changeWorkPhoneHandler}
                                      disabled={!this.state.isEdit}
                                      validate={{
                                        number: {
                                          value: true,
                                          errorMessage: t(
                                            "EntityRepPhoneValidValidation"
                                          ),
                                        },
                                        required: {
                                          value: true,
                                          errorMessage: t(
                                            "EntityRepPhoneValidValidation"
                                          ),
                                        },
                                        minLength: {
                                          value: 8,
                                          errorMessage: t(
                                            "EntityRepPhoneLengthValidation"
                                          ),
                                        },
                                        maxLength: {
                                          value: 30,
                                          errorMessage: t(
                                            "EntityRepPhoneLengthValidation"
                                          ),
                                        },
                                      }}
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </FormGroup>
                          </Row>
                        </Col>
                        <Col>
                          <Row className={`label-required`}>
                            <Label
                              for="email"
                              className={`${classes["paddingCenter"]} ${classes["email"]} mr-5`}
                            >
                              {t("Email")}
                            </Label>
                            <FormGroup>
                              <AvField
                                type="email"
                                name="email"
                                className={`${classes["inputClassNew"]}`}
                                // label={`${t('Email')}`}
                                disabled={!this.state.isEdit}
                                placeholder={t("EnterFIEntityEmail")}
                                value={this.state.email}
                                onChange={this.changeEmailHandler}
                                validate={{
                                  email: {
                                    value: true,
                                    errorMessage: t(
                                      "EnterFIEntityEmailValidValidation"
                                    ),
                                  },
                                  required: {
                                    value: true,
                                    errorMessage: t(
                                      "EnterFIEntityEmailValidValidation"
                                    ),
                                  },
                                  minLength: {
                                    value: 2,
                                    errorMessage: t(
                                      "EnterFIEntityEmailLengthValidation"
                                    ),
                                  },
                                  maxLength: {
                                    value: 250,
                                    errorMessage: t(
                                      "EnterFIEntityEmailLengthValidation"
                                    ),
                                  },
                                }}
                                required
                              />
                            </FormGroup>
                          </Row>
                          <Row className={`label`}>
                            <Label
                              for="destination"
                              className={`${classes["paddingCenter"]} ${classes["addressLine"]} mr-4`}
                            >
                              {t("Designation")}
                            </Label>
                            <FormGroup className="label-required">
                              <AvField
                                type="text"
                                name="destination"
                                // label={`${t('Destination')}`}
                                className={`${classes["inputClassNew"]}`}
                                placeholder={t("Enter Designation")}
                                value={this.state.destination}
                                onChange={this.changeDestinationHandler}
                                // validate={{
                                //     required: { value: true, errorMessage: t("EnterDestination") },
                                //     minLength: { value: 2, errorMessage: t("DestinationValidation") },
                                //     maxLength: { value: 250, errorMessage: t("DestinationValidation") },
                                // }}
                                disabled={!this.state.isEdit}
                                //required
                              />
                            </FormGroup>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )}
                {this.state.activeTab === 2 && (
                  <Col lg={12} className="px-0">
                    <Card>
                      {/* <CardHeader tag="h6" className={classes.cardHeaderHeight}>
                        {t("Security and Login")}
                      </CardHeader> */}
                      <CardBody>
                        <Row>
                          <Col md={10}>
                            <div className="mb-2">
                              <p
                                className={classes.inputText1}
                                name="resetPassword"
                              >
                                {t("Reset user's password")}
                              </p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <Link to={`/users/password/reset/${user.uuid}`}>
                              <button
                                disabled={!this.state.isEdit}
                                type="button"
                                className={`btn btn-primary float-right my-2 py-1 ${classes.buttonHeight}`}
                              >
                                {t("Reset")}
                              </button>
                            </Link>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={10}>
                            <div className="my-2">
                              <p
                                className={classes.inputText1}
                                name="twoFactor"
                              >
                                {t("Reset user's two FA Authentication")}
                              </p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <button
                              disabled={!this.state.isEdit}
                              type="button"
                              id="modal"
                              className={`btn btn-primary float-right my-2 py-1 ${classes.buttonHeight}`}
                            >
                              {t("Reset")}
                            </button>
                            <UncontrolledModal
                              target="modal"
                              className="modal-outline-success"
                            >
                              <ModalHeader tag="h6">
                                <span className="text-primary">
                                  {t("Reset Two FA")}
                                </span>
                              </ModalHeader>
                              <ModalBody>
                                {t(
                                  "Are you sure you want to reset user's two FA"
                                )}
                                ?
                              </ModalBody>
                              <ModalFooter>
                                <UncontrolledModal.Close color="link">
                                  <span>Close</span>
                                </UncontrolledModal.Close>
                                <span onClick={handleTwoFAReset}>
                                  <UncontrolledModal.Close color="primary">
                                    {t("Reset")}
                                  </UncontrolledModal.Close>
                                </span>
                              </ModalFooter>
                            </UncontrolledModal>
                            {/* </Link> */}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                )}
              </Col>
            </Row>
            <Card className="mt-3">
              <CardHeader tag="h6">{t("FI Portal")}</CardHeader>

              <Col lg={12}>
                <CardBody className={`${classes["cardBody"]} mb-3`}>
                  <Row>
                    <Col md={10} lg={10}>
                      <Label for="financingRequestType">
                        {t("Do you want to activate FI Portal for this FI ?")}
                      </Label>
                    </Col>
                    <Col md={2} lg={2}>
                      <FormGroup>
                        <div className="radioButtons">
                          <CustomInput
                            type="radio"
                            id="yesRule"
                            name="fiPortal"
                            value="yes"
                            inline
                            onChange={this.changeFIPortalRadio}
                            className={classes["custom-control"]}
                            label="Yes"
                            disabled={!this.state.isEdit}
                            checked={this.state.fiPortal}
                          ></CustomInput>
                          <CustomInput
                            type="radio"
                            className={classes["custom-control"]}
                            id="noRule"
                            name="fiPortal"
                            value="no"
                            inline
                            onChange={this.changeFIPortalRadio}
                            label="No"
                            checked={!this.state.fiPortal}
                            disabled={!this.state.isEdit}
                          ></CustomInput>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Card>
            <Card className="mt-3">
              <CardHeader tag="h6">{t("Remarks")}</CardHeader>
              <CardBody className={`${classes["cardBody"]} mb-3`}>
                <Input
                  type="textarea"
                  name="remark"
                  placeholder={t("Enter remarks")}
                  value={this.state.remark || ""}
                  onChange={this.changeRemark}
                  disabled={!this.state.isEdit}
                />
              </CardBody>
            </Card>
            <Card className="mt-3">
              <CardHeader tag="h6">{t("Module Subscription")}</CardHeader>
              <CardBody
                className={`${classes["cardBody"]} ${classes["agGridCard"]}`}
              >
                <div
                  className="ag-theme-custom-react"
                  style={{ height: "131px", width: "100%" }}
                >
                  <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    rowSelection="multiple"
                    onSelectionChanged={(params) =>
                      this.handleCheckboxSelection(params)
                    }
                    // onGridReady={(params) => onGridReady(params)}
                    onGridReady={this.onGridReady}
                    suppressRowClickSelection={!this.state.isEdit}
                  />
                </div>
              </CardBody>
            </Card>

            <br />
            {this.state.developerFinancingModule && (
                <Card className="mt-3">
                <CardHeader tag="h6">{t("Developer Financing")}</CardHeader>
                <CardBody className={`${classes["cardBody"]} mb-3`}>
                  {this.state.isEdit && (
                    <>
                      <ButtonToolbar className="ml-auto d-flex justify-content-end">
                        <ButtonGroup>
                          <Button
                            color="primary"
                            className="mb-2 mr-2 px-3"
                            id="addNewModal"
                            onClick={() => this.handleAddNewProject(true)}
                          >
                            <i className="fa fa-plus" /> Add New
                          </Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                      {this.state.addNewProjectModal && (
                        <AddProjectsModal
                          closeModal={() => this.handleAddNewProject(false)}
                          successAction={this.handleAddProject}
                          columnDefs={this.state.tableColDefs}
                          defaultColDef={this.state.defaultColDef}
                        />
                      )}
                    </>
                  )}
                  <Card className="mt-3">
                    <CardHeader tag="h6">
                      {t("Entity and Project Tagging")}
                    </CardHeader>
                    <CardBody
                      className={`${classes["cardBody"]}  ${classes["agGridCard"]}`}
                    >
                      <div
                        className="ag-theme-custom-react"
                        style={{ height: "300px", width: "100%" }}
                      >
                        <AgGridReact
                          columnDefs={this.state.paymentColDefs}
                          defaultColDef={this.state.defaultColDefPaymentTable}
                          rowData={this.state.projects}
                          pagination={false}
                          onCellClicked={this.statusColClicked}
                          onGridReady={this.onDeveloperGridReady}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            )}
            
            {this.state.invoiceFinancingModule && (
                <Card className="mt-3">
                <CardHeader tag="h6">{t("Invoice Financing")}</CardHeader>
                <CardBody className={`${classes["cardBody"]} mb-3`}>
                  {this.state.isEdit && (
                    <>
                      <ButtonToolbar className="ml-auto d-flex justify-content-end">
                        <ButtonGroup>
                          <Button
                            color="primary"
                            className="mb-2 mr-2 px-3"
                            id="addNewModal"
                            onClick={() => this.handleAddNewEntity(true)}
                          >
                            <i className="fa fa-plus" /> Add New
                          </Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                      {this.state.addNewEntityModal && (
                        <AddEntitiesModal
                          closeModal={() => this.handleAddNewEntity(false)}
                          successAction={this.handleAddEntity}
                          columnDefs={this.state.invoiceTableColDefs}
                          defaultColDef={this.state.defaultColDef}
                        />
                      )}
                    </>
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
                          columnDefs={this.state.invoiceColDefs}
                          defaultColDef={this.state.defaultColDefPaymentTable}
                          onGridReady={this.onInvoiceGridReady}
                          rowData={this.state.entities}
                          pagination={false}
                          onCellClicked={this.statusInvoiceColClicked}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            )}
            
          </Container>

          <StickyFooter>
            <Row className="justify-content-between mx-0 px-3">
              <div>
                <Button
                  color="secondary"
                  className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQueryBack"]}`}
                  onClick={() =>
                    this.state.isEdit
                      ? this.cancelEdit()
                      : this.props.history.goBack()
                  }
                >
                  {t("Back")}
                </Button>
              </div>
              <div>
                {this.state.status?.toLowerCase() === "associated" ? (
                  <Button
                    color="danger"
                    className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQuery"]}`}
                    id="modal2"
                    onClick={this.handleDoNothing}
                  >
                    Deactivate
                  </Button>
                ) : (
                  this.state.status?.toLowerCase() !== "associated" && (
                    <Button
                      color="primary"
                      className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQuery"]}`}
                      id="modal2"
                      onClick={this.handleDoNothing}
                    >
                      Activate
                    </Button>
                  )
                )}
                {/* {this.state.active === true && */}
                <UncontrolledModal
                  target="modal2"
                  className="modal-outline" /*onClick={this.handleDoNothing}*/
                >
                  <ModalHeader tag="h6">
                    <span className="text-primary">
                      {this.state.status?.toLowerCase() === "associated"
                        ? "Deactivate "
                        : "Activate "}{" "}
                      Project Payment Integration
                    </span>
                  </ModalHeader>
                  <ModalBody>
                    After{" "}
                    {this.state.status?.toLowerCase() === "associated"
                      ? "deactivating "
                      : "activating "}{" "}
                    a Financial institution, all the payments requests will be{" "}
                    {this.state.status.toLowerCase() === "associated"
                      ? "cancelled"
                      : "activated"}
                    . Do you want to continue?
                  </ModalBody>
                  <ModalFooter>
                    <UncontrolledModal.Close color="secondary">
                      Cancel
                    </UncontrolledModal.Close>
                    <span
                      onClick={(e) => this.handleFIStatus(e, this.state.status)}
                    >
                      <UncontrolledModal.Close color="primary">
                        {t("Yes")}
                      </UncontrolledModal.Close>
                    </span>
                  </ModalFooter>
                </UncontrolledModal>
                {/* } */}
                {this.state.isEdit === false && (
                  <>
                    <Button
                      color="facebook"
                      className={`${classes["inputTextButton"]} mb-2 mr-2 px-3 ${classes["btnQueryEdit"]}`}
                      onClick={this.setEdit}
                    >
                      Edit <i className="fa fa-pencil" />
                    </Button>
                  </>
                )}
                {this.state.isEdit === true && (
                  <Button
                    color="primary"
                    className={`${classes["inputTextButton"]}  mb-2 mr-2 px-3 ${classes["btnQueryEdit"]}`}
                  >
                    {t("Save")}
                  </Button>
                )}
              </div>
            </Row>
          </StickyFooter>
        </AvForm>
        <Prompt
          when={this.state.isEdit}
          message="Are you sure you want to leave this page as all your input will be lost?"
        />
      </React.Fragment>
    );
  }
}

const ViewFIEntityDetails = withTranslation()(ViewFIEntityDetails1);
export default ViewFIEntityDetails;
