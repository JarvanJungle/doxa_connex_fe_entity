import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";

export const CheckboxHeader = (params) => {
    const {
        displayName, api, column, enableSorting, setSort
    } = params;

    const [isChecked, setChecked] = useState(false);
    const [listNode, setListNode] = useState([]);

    const selectAll = () => listNode.forEach((node) => node.setSelected(true));

    const checkSelectAll = () => {
        const currentPage = api.paginationGetCurrentPage();
        const pageSize = api.paginationGetPageSize();
        const listItem = listNode
            .filter((item, index) => ((currentPage) * pageSize <= index
                && index < (currentPage) * pageSize + pageSize));
        const isSelectAll = listItem.some((item) => !item.selected);
        if (!isSelectAll) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    };

    const onClickCheckAll = () => {
        const currentPage = api.paginationGetCurrentPage();
        const pageSize = api.paginationGetPageSize();
        const listItem = listNode
            .filter((item, index) => ((currentPage) * pageSize <= index
                && index < (currentPage) * pageSize + pageSize));
        if (!isChecked) {
            listNode.forEach((node) => {
                listItem.forEach((item) => {
                    if (item === node) {
                        node.setSelected(true);
                    }
                });
            });
        } else {
            listNode.forEach((node) => {
                listItem.forEach((item) => {
                    if (item === node) {
                        node.setSelected(false);
                    }
                });
            });
        }
        checkSelectAll();
        // setChecked(!isChecked);
        // if (isChecked) {
        //     api.deselectAll();
        // } else {
        //     selectAll();
        // }
    };

    const onRowChanged = () => {
        const rows = [];
        api.forEachNode((node) => rows.push(node));
        setListNode(rows);
    };

    const onSelectionChanged = (data) => {
        const rows = [];
        data.api.forEachNode((node) => rows.push(node));
        const currentPage = data.api.paginationGetCurrentPage();
        const pageSize = data.api.paginationGetPageSize();
        const listItem = rows
            .filter((item, index) => ((currentPage) * pageSize <= index
                && index < (currentPage) * pageSize + pageSize));
        const isSelectAll = listItem.some((item) => !item.selected);
        if (!isSelectAll) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    };

    const onClickSorting = (e) => {
        if (enableSorting) {
            const currentSort = !column.isSortAscending() && !column.isSortDescending();
            let nextSortOrder;
            if (currentSort) {
                nextSortOrder = "asc";
            } else {
                nextSortOrder = column.isSortDescending() ? "" : "desc";
            }
            setSort(nextSortOrder, e.shiftKey);
        }
    };

    useEffect(() => {
        api.addEventListener("paginationChanged", onRowChanged);
        api.addEventListener("rowSelected", onSelectionChanged);
    }, []);

    useEffect(() => {
        checkSelectAll();
    }, [listNode]);

    return (
        <div className="d-flex align-items-center">
            <Checkbox className="mr-2" checked={isChecked} onChange={onClickCheckAll} />
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={onClickSorting} className="ag-header-cell-text">{displayName}</div>
            {enableSorting && (column.isSortAscending() || column.isSortDescending()) && (
                <span className="ag-header-icon ag-header-label-icon">
                    <i className={`ag-icon ag-icon-${column.isSortAscending() ? "asc" : "desc"}`} />
                </span>
            )}
        </div>
    );
};

export default CheckboxHeader;
