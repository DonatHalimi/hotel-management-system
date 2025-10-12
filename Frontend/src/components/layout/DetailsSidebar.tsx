import React, { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useToast } from "../../contexts/ToastContext";

type DetailsSidebarProps = {
    visible: boolean;
    onHide: () => void;
    title: string;
    onEdit?: () => void;
    onDelete?: () => Promise<void> | void;
    children: React.ReactNode;
};

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({
    visible,
    onHide,
    title,
    onEdit,
    onDelete,
    children,
}) => {
    const [confirmVisible, setConfirmVisible] = useState(false);
    const menuRef = useRef<Menu>(null);
    const { toast } = useToast();

    const items: MenuItem[] = [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => onEdit?.(),
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => setConfirmVisible(true),
        },
    ];

    const handleDelete = async () => {
        try {
            await onDelete?.();
            toast({ severity: "success", summary: "Deleted", detail: "Data deleted successfully" });
            setConfirmVisible(false);
            onHide();
        } catch (err) {
            toast({ severity: "error", summary: "Error", detail: "Failed to delete data" });
        }
    };

    return (
        <>
            <Sidebar
                visible={visible}
                position="right"
                onHide={onHide}
                className="!w-[500px]"
            >
                <div className="p-4 space-y-5">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <Button
                            icon="pi pi-ellipsis-v"
                            onClick={(e) => menuRef.current?.toggle(e)}
                            aria-label="Options"
                            className="p-button-text p-button-rounded"
                        />
                        <Menu model={items} popup ref={menuRef} />
                    </div>

                    <div className="space-y-4">{children}</div>
                </div>
            </Sidebar>

            <ConfirmDialog
                visible={confirmVisible}
                onHide={() => setConfirmVisible(false)}
                message="Are you sure you want to delete this item?"
                header="Confirm Deletion"
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-danger"
                accept={handleDelete}
                reject={() => setConfirmVisible(false)}
                draggable={false}
            />
        </>
    );
};

export default DetailsSidebar;
