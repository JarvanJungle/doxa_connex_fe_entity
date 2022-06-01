import React, { useEffect, useMemo, useState } from "react";
import {
    Container,
    Row,
    Card,
    CardBody,
    Col
} from "components";
import Chart from "react-apexcharts";
import { HeaderMain } from "routes/components/HeaderMain";
import { useTranslation } from "react-i18next";

import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import moment from "moment";
import uuid from "uuid/v4";
import { useSelector } from "react-redux";
import _ from "lodash";
import BankAccountService from "services/BankAccountService/BankAccountService";
import ProjectForecastService from "services/ProjectForecastService";
import UserService from "services/UserService";
import ExtVendorService from "services/ExtVendorService";
import InvoiceService from "services/InvoiceService/InvoiceService";
import PurchaseOrderService from "services/PurchaseOrderService/PurchaseOrderService";

import URL_CONFIG from "services/urlConfig";

import classes from "./Dashboard.scss";

const DashboardMain = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [cards, setCards] = useState();
    const [myTasks, setMyTasks] = useState();
    const [pieChartData, setPieChartData] = useState(
        {
            series: [0, 0, 0],
            options: {
                labels: ["Connected Vendor", "Unconnected Vendor", "Pending Connection"],
                dataLabels: {
                    enabled: false
                },
                legend: {
                    position: "bottom",
                    offsetY: 0,
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial",
                    formatter(seriesName, opts) {
                        return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]];
                    },
                    labels: {
                        colors: "dark",
                        useSeriesColors: false
                    },
                    markers: {
                        width: 12,
                        height: 12,
                        strokeWidth: 0,
                        strokeColor: "#fff",
                        radius: 0,
                        sharp: "square"
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }]
            }
        }
    );
    const [barChartData, setBarChartData] = useState({
        series: [],
        options: {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10
                }
            },
            xaxis: {
                type: "datetime",
                categories: []
            },
            legend: {
                position: "right",
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        }
    });
    const navigate = (url) => {
        const domain = `${window.location.protocol}//${window.location.host}`;
        if (url.indexOf(domain) === 0 || url[0] === "/") {
            history.push(url.replace(domain, ""));
        } else {
            window.location.href = url;
        }
    };

    const permissionReducer = useSelector((state) => state.permissionReducer);
    const currentCompanyUuid = useMemo(
        () => permissionReducer?.currentCompany?.companyUuid,
        [permissionReducer]
    );
    const isBuyer = useMemo(() => permissionReducer?.isBuyer, [permissionReducer]);

    const cardSummary = (rows) => rows
        ?.map((row) => row?.count || 0)
        ?.reduce((prev, cur) => prev + cur, 0);

    const initData = async () => {
        if (currentCompanyUuid) {
            const [BankAccounts, SupplierBankAccounts, ProjectForecasts, CompanyUsers, Vendors, BuyerPO, SupplierPO, BuyerInvoices, SupplierInvoices] = await Promise.all([
                BankAccountService.getAllBankAccount(currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                BankAccountService.getAllSupplierBankAccount(currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                ProjectForecastService.getProjects(currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                UserService.getEntityUsers().then((res) => res?.data?.data).catch(() => []),
                ExtVendorService.getExternalVendors(currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                PurchaseOrderService.getPOList(true, currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                PurchaseOrderService.getPOList(false, currentCompanyUuid).then((res) => res?.data?.data).catch(() => []),
                InvoiceService.getInvList(currentCompanyUuid, true).then((res) => res?.data?.data).catch(() => []),
                InvoiceService.getInvList(currentCompanyUuid, false).then((res) => res?.data?.data).catch(() => [])
            ]);
            setMyTasks([
                {
                    name: "Bank Account Pending Approval",
                    url: `${URL_CONFIG.BANK_ACCOUNT_ROUTES_PATH.BANK_ACCOUNT_LIST}?status=PENDING APPROVAL`,
                    hasPermission: true,
                    count: BankAccounts.filter((account) => account.status === "PENDING APPROVAL").length
                }, {
                    name: "Supplier Bank Account Pending Approval",
                    url: `${URL_CONFIG.SUPPLIER_BANK_ACCOUNT_ROUTES_PATH.SUPPLIER_BANK_ACCOUNT_LIST}?status=PENDING APPROVAL`,
                    hasPermission: true,
                    count: SupplierBankAccounts.filter((account) => account.status === "PENDING APPROVAL").length
                }, {
                    name: "Project Pending Forecast",
                    url: "/list-project-forecast?projectStatus=PENDING FORECAST",
                    hasPermission: true,
                    count: ProjectForecasts.filter((project) => project.projectStatus === "PENDING FORECAST").length
                }
            ]);
            setCards([
                {
                    name: "Active Users",
                    count: CompanyUsers.length
                }, {
                    name: "Ongoing Projects",
                    count: ProjectForecasts.length
                }, {
                    name: "Vendors",
                    count: Vendors.length
                }, {
                    name: "Purchase Orders",
                    count: BuyerPO.length + SupplierPO.length
                }, {
                    name: "Invoices",
                    count: BuyerInvoices.length + SupplierInvoices.length
                }
            ]);

            // setting PO chart data
            const connectedVendor = Vendors.filter((Vendor) => Vendor.connectionStatus === "CONNECTED").length;
            const unConnectedVendor = Vendors.filter((Vendor) => Vendor.connectionStatus === "NOT CONNECTED").length;
            const pendingVendor = Vendors.filter((Vendor) => Vendor.connectionStatus === "AWAITING APPROVAL").length;
            setPieChartData((prev) => ({
                ...prev,
                series: [connectedVendor, unConnectedVendor, pendingVendor]
            }));
            const POS = [...BuyerPO, SupplierPO];
            const closedPO = POS.filter((PO) => PO.status === "CLOSED")
                .map((PO) => PO.submittedOn)
                .sort((a, b) => {
                    if (a.valueOf() > b.valueOf()) return 1;
                    if (a.valueOf() === b.valueOf()) return 0;
                    return -1;
                })
                .map((date) => moment(date).format("M/D/YYYY"));
            const issuedPO = POS.map((PO) => PO.submittedOn)
                .sort((a, b) => {
                    if (a.valueOf() > b.valueOf()) return 1;
                    if (a.valueOf() === b.valueOf()) return 0;
                    return -1;
                }).map((date) => moment(date).format("M/D/YYYY"));
            const IssuedPOV = [];
            const IssuedXaxis = [];
            const ClosedPOV = [];
            const ClosedXaxis = [];
            while (issuedPO.length) {
                const date = issuedPO.shift();
                if (!IssuedXaxis.includes(date)) {
                    IssuedXaxis.push(date);
                    IssuedPOV.push(issuedPO.filter((issuedDate) => issuedDate === date).length + 1);
                }
            }

            while (closedPO.length) {
                const date = closedPO.shift();
                if (!ClosedXaxis.includes(date)) {
                    ClosedXaxis.push(date);
                    ClosedPOV.push(closedPO.filter((issuedDate) => issuedDate === date).length + 1);
                }
            }

            const Xaxis = _.uniq(IssuedXaxis.concat(ClosedXaxis).sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                if (dateA.valueOf() > dateB.valueOf()) return 1;
                if (dateA.valueOf() < dateB.valueOf()) return -1;
                return 0;
            }));
            const IssuedPOChartData = Xaxis.map((date) => {
                if (IssuedXaxis.includes(date)) {
                    return IssuedPOV[IssuedXaxis.indexOf(date)];
                } return 0;
            });
            const ClosedPOChartData = Xaxis.map((date) => {
                if (ClosedXaxis.includes(date)) {
                    return ClosedPOV[ClosedXaxis.indexOf(date)];
                } return 0;
            });
            setBarChartData((prev) => ({
                series: [{
                    name: "No. of POs Closed",
                    data: ClosedPOChartData
                }, {
                    name: "No. of POs Issued",
                    data: IssuedPOChartData
                }],
                options: {
                    ...prev.options,
                    xaxis: {
                        type: "datetime",
                        categories: Xaxis
                    }
                }
            }));
        }
    };

    useEffect(() => {
        initData().catch(console.error);
    },
    [currentCompanyUuid, isBuyer]);
    return (
        <>
            <Container fluid={false}>
                <HeaderMain title={t("Dashboard")} className="mb-3" />
                <Row>
                    {
                        cards?.map((card) => (
                            <Col key={uuid()}>
                                <Card className="card-doxa card-doxa--primary card-doxa-rounded">
                                    <CardBody>
                                        <div className="p-4">
                                            <p className="h4 text-center p-0 m-0">{card.count}</p>
                                            <p className="text-center p-0 m-0">{card.name}</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Card className="card-doxa card-doxa--primary card-doxa-rounded p-4">
                            <CardBody>
                                <div className="row">
                                    <p className="h3 text-left m-0 font-weight-bold">My Tasks</p>
                                    <span className="card-doxa-header-number">
                                        {cardSummary(myTasks)}
                                    </span>
                                </div>

                                {
                                    myTasks?.map((task) => task?.hasPermission && (
                                        <Row onClick={() => navigate(task.url)} key={uuid()} className={`d-flex justify-content-between align-items-end position-relative ${classes["link-item"]}`}>
                                            <div className="d-flex">
                                                <div className="d-flex align-items-center mr-2">
                                                    <FontAwesomeIcon icon={faFile} className={classes["icon-inside-circle"]} size="3x" transform="shrink-10.5" />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {task.name}
                                                </div>
                                            </div>
                                            <div className={`${classes.action}`}>
                                                {`${task.count ?? 0} Record${task.count > 1 ? "s" : ""}`}
                                            </div>
                                        </Row>
                                    ))
                                }
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-doxa card-doxa--primary card-doxa-rounded p-4">
                            <CardBody>
                                <div className="row justify-content-between">
                                    <p className="h6 text-left m-0 font-weight-bold row align-item-center">Vendor by Status</p>
                                    <div className="d-flex jutify-content-end">
                                        <button type="button" className={classes["chart-function-button"]}>
                                            <span><i className="fa fa-expand" /></span>
                                        </button>
                                        <button type="button" className={classes["chart-function-button"]}>
                                            <span><i className="fa fa-compress" aria-hidden="true" /></span>
                                        </button>
                                        <button type="button" className={classes["chart-function-button"]}>
                                            <span><i className="fa fa-refresh" aria-hidden="true" /></span>
                                        </button>
                                    </div>
                                </div>
                                <Chart
                                    options={pieChartData.options}
                                    series={pieChartData.series}
                                    type="donut"
                                    height={300}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div className="my-5">
                    <Card className="card-doxa card-doxa--primary card-doxa-rounded p-4">
                        <Row>
                            <Col>
                                <p className="h4 p-0 m-0">Purchase Orders</p>
                            </Col>
                            <Col>
                                <div className="row justify-content-end">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" className="btn btn-primary">Today</button>
                                        <button type="button" className="btn btn-primary">Monthly</button>
                                        <button type="button" className="btn btn-primary">Annual</button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <Chart
                                options={barChartData.options}
                                series={barChartData.series}
                                type="bar"
                                height={300}
                            />
                        </div>
                    </Card>
                </div>
            </Container>
        </>
    );
};
export default DashboardMain;
