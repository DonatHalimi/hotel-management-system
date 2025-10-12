import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export type ColumnDef = {
    field: string;
    header: string;
    sortable?: boolean;
    body?: (row: any) => React.ReactNode | string | number | null;
    style?: React.CSSProperties;
    className?: string;
};

type FetchResult = { data: any[]; total: number };

type Props = {
    columns: ColumnDef[];
    fetchData?: (page: number, rows: number) => Promise<FetchResult>;
    data?: any[];
    lazy?: boolean;
    rowsPerPage?: number;
    actions?: (row: any) => React.ReactNode;
    emptyMessage?: string;
    selection?: any | any[];
    onSelectionChange?: (sel: any | any[]) => void;
    selectionMode?: 'checkbox' | 'single' | 'multiple';
    topActions?: React.ReactNode;
    refreshKey?: number;
};

const DataTableWrapper: React.FC<Props> = ({
    columns,
    fetchData,
    data: clientData,
    lazy = false,
    rowsPerPage = 10,
    actions,
    emptyMessage = 'No records found',
    selection,
    onSelectionChange,
    selectionMode,
    topActions,
    refreshKey
}) => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState(rowsPerPage);
    const [page, setPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [serverData, setServerData] = useState<any[]>([]);

    const showActions = Boolean(actions);

    const loadPage = async (p: number, r: number) => {
        if (!fetchData) return;
        setLoading(true);

        try {
            const res = await fetchData(p, r);
            setServerData(res.data);
            setTotalRecords(res.total);
        } catch (err) {
            console.error('Table fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lazy && fetchData) {
            loadPage(page, rows);
        } else if (!lazy && clientData) {
            setTotalRecords(clientData.length);
        }
    }, [page, rows, clientData, lazy, refreshKey]);

    const onPageChange = (e: { page: number; rows: number }) => {
        setPage(e.page);
        setRows(e.rows);
        if (lazy && fetchData) {
            loadPage(e.page, e.rows);
        }
    };

    const displayData = lazy ? serverData : clientData || [];

    return (
        <div className="w-full">
            <ConfirmDialog draggable={false} />

            <ConfirmPopup />

            <div className="flex items-center justify-between mb-2">
                {topActions}
            </div>

            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10 p-4">
                        <ProgressSpinner />
                    </div>
                )}

                <DataTable
                    value={displayData}
                    paginator={false}
                    emptyMessage={emptyMessage}
                    responsiveLayout="scroll"
                    selection={selection}
                    onSelectionChange={(e: any) => onSelectionChange && onSelectionChange(e.value)}
                    selectionMode={selectionMode || "multiple"}
                    className="min-w-full"
                >
                    {columns.map((c) => (
                        <Column
                            key={c.field}
                            field={c.field}
                            header={c.header}
                            sortable={c.sortable}
                            body={c.body ? (rowData: any) => c.body!(rowData) : undefined}
                            style={c.style}
                            className={c.className}
                        />
                    ))}

                    {showActions && (
                        <Column
                            header="Actions"
                            body={(rowData: any) => (actions ? actions(rowData) : null)}
                            style={{ width: 140 }}
                        />
                    )}
                </DataTable>
            </div>

            <div className="mt-3">
                <Paginator
                    first={page * rows}
                    rows={rows}
                    totalRecords={totalRecords}
                    onPageChange={(e) => onPageChange({ page: e.page, rows: e.rows })}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </div>
        </div>
    );
};

export default DataTableWrapper;

export const showConfirmPopup = (
    event: React.SyntheticEvent | Event,
    opts: {
        message: string;
        header?: string;
        icon?: React.ReactNode;
        acceptLabel?: string;
        rejectLabel?: string;
        accept?: () => void;
        reject?: () => void;
    }
) => {
    const target = (event as any).currentTarget || (event as any).target;
    confirmPopup({
        target,
        message: opts.message,
        header: opts.header,
        icon: opts.icon,
        acceptLabel: opts.acceptLabel || 'Yes',
        rejectLabel: opts.rejectLabel || 'No',
        accept: opts.accept,
        reject: opts.reject,
    });
};

export const showConfirmDialog = (opts: {
    message: string;
    header?: string;
    icon?: React.ReactNode;
    acceptLabel?: string;
    rejectLabel?: string;
    accept?: () => void;
    reject?: () => void;
}) => {
    confirmDialog({
        message: opts.message,
        header: opts.header,
        icon: opts.icon,
        acceptLabel: opts.acceptLabel || 'Yes',
        rejectLabel: opts.rejectLabel || 'No',
        accept: opts.accept,
        reject: opts.reject,
    });
};