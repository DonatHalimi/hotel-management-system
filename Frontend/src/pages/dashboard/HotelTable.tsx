import React, { useCallback, useMemo, useState } from 'react';
import DataTableWrapper, { showConfirmDialog, showConfirmPopup, type ColumnDef } from '../../components/table/DataTableWrapper';
import axiosInstance from '../../config/axiosInstance';
import { Button as PrimeButton } from 'primereact/button';
import { hasRole } from '../../utils/auth';
import HotelDialog from './HotelDialog';

type FetchResult = { data: any[]; total: number };

const getId = (row: any) => row.hotelID ?? row.HotelID ?? row.id ?? row.Id ?? row._id;

const fetchHotels = async (page: number, rows: number): Promise<FetchResult> => {
    const pageOneBased = page + 1;
    const res = await axiosInstance.get('/hotels', { params: { page: pageOneBased, pageSize: rows } });

    const totalFromHeader =
        Number(res.headers['x-total-count'] ?? res.headers['x-totalrecords'] ?? res.headers['x-total'] ?? res.headers['x-total-pages']) ||
        undefined;

    const payload = res.data;
    const items = Array.isArray(payload) ? payload : (payload.data ?? payload);
    const total =
        totalFromHeader ??
        (Array.isArray(payload) ? payload.length : (payload.total ?? (payload.data?.length ?? items.length)));

    return {
        data: items ?? [],
        total,
    };
};

const HotelTable: React.FC = () => {
    const [selected, setSelected] = useState<any[] | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editInitial, setEditInitial] = useState<any | null>(null);

    const columns: ColumnDef[] = useMemo(() => [
        { field: 'name', header: 'Name', sortable: true, body: (r) => r.name ?? '—' },
        { field: 'city', header: 'City', sortable: true, body: (r) => r.city ?? '—' },
        { field: 'country', header: 'Country', body: (r) => r.country ?? '—' },
        { field: 'email', header: 'Email', body: (r) => r.email ?? '—' },
        { field: 'phone', header: 'Phone', body: (r) => r.phoneNumber ?? '—' },
        { field: 'rooms', header: 'Rooms', body: (r) => (Array.isArray(r.rooms) ? r.rooms.length : (r.roomCount ?? '—')) },
        {
            field: 'features',
            header: 'Features',
            body: (r) => {
                const flags: string[] = [];
                if (r.hasWifi) flags.push('Wi-Fi');
                if (r.hasParking) flags.push('Parking');
                if (r.hasPool) flags.push('Pool');
                if (r.hasGym) flags.push('Gym');
                if (r.hasSpa) flags.push('Spa');
                if (r.petFriendly) flags.push('Pets');
                return flags.length ? flags.join(', ') : '—';
            },
        },
    ], []);

    const openCreate = () => setCreateVisible(true);

    // open edit inline - fetch latest server data and show dialog
    const openEditInline = useCallback(async (row: any) => {
        const id = getId(row);
        if (!id) {
            console.warn('Unable to determine id for edit', row);
            return;
        }

        setEditingId(id);
        try {
            const res = await axiosInstance.get(`/hotels/${id}`);
            setEditInitial(res.data);
            setEditVisible(true);
        } catch (err) {
            console.error('Failed to load hotel for edit', err);
            alert('Failed to load item for edit');
        }
    }, []);

    const handleDelete = useCallback((event: React.MouseEvent, row: any) => {
        showConfirmPopup(event, {
            message: `Delete hotel "${row.name}"? This cannot be undone.`,
            accept: async () => {
                try {
                    await axiosInstance.delete(`/hotels/${getId(row)}`);
                    setRefreshKey(k => k + 1);
                } catch {
                    alert('Delete failed');
                }
            },
        });
    }, [setRefreshKey]);


    const handleBulkDelete = useCallback(() => {
        if (!selected || selected.length === 0) return;

        showConfirmDialog({
            header: "Confirm bulk delete",
            message: `Delete ${selected.length} selected hotels? This cannot be undone.`,
            accept: async () => {
                const ids = (selected ?? []).map(getId).filter(Boolean);
                try {
                    await axiosInstance.delete('/hotels/bulk', { data: { ids } });
                    setSelected(null);
                    setRefreshKey(k => k + 1);
                } catch {
                    alert('Bulk delete failed');
                }
            },
        });
    }, [selected, setRefreshKey]);

    const actions = (row: any) => {
        const allow = hasRole(['Admin']);
        if (!allow) return null;
        return (
            <div className="flex gap-2">
                <PrimeButton icon="pi pi-pencil" className="p-button-text" onClick={() => openEditInline(row)} aria-label="Edit" />
                <PrimeButton icon="pi pi-trash" onClick={(e) => handleDelete(e, row)} aria-label="Delete" className="p-button-text p-button-danger" />
            </div>
        );
    };

    const topActions = (
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold mr-4">Hotels</h1>

            {hasRole(['Admin']) && (
                <>
                    <PrimeButton label="Create hotel" icon="pi pi-plus" onClick={openCreate} />
                    <PrimeButton
                        label={`Delete selected (${selected?.length ?? 0})`}
                        icon="pi pi-trash"
                        onClick={handleBulkDelete}
                        disabled={!selected || selected.length === 0}
                        className="p-button-danger"
                    />
                </>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded shadow p-4">
            <DataTableWrapper
                columns={columns}
                fetchData={fetchHotels}
                lazy
                rowsPerPage={10}
                actions={actions}
                selection={selected}
                onSelectionChange={(s) => setSelected(s)}
                selectionMode="multiple"
                topActions={topActions}
                refreshKey={refreshKey}
            />

            <HotelDialog
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onSaved={() => setRefreshKey(k => k + 1)}
                mode="create"
            />

            <HotelDialog
                visible={editVisible}
                onHide={() => {
                    setEditVisible(false);
                    setEditingId(null);
                    setEditInitial(null);
                }}
                onSaved={() => setRefreshKey(k => k + 1)}
                mode="edit"
                id={editingId}
                initial={editInitial}
            />
        </div>
    );
};

export default HotelTable;
