import React from "react";
import { InputText } from "primereact/inputtext";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";
import { PaymentMethod, PaymentStatus } from "../tables/PaymentTable";

type PaymentDetailsProps = {
    visible: boolean;
    onHide: () => void;
    payment: any | null;
    onEdit: (payment: any) => void;
    onDelete: (payment: any) => Promise<void>;
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    visible,
    onHide,
    payment,
    onEdit,
    onDelete,
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Payment Details"
            onEdit={() => onEdit(payment)}
            onDelete={() => onDelete(payment)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Payment ID</label>
                <InputText
                    value={payment?.paymentID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Booking</label>
                <InputText
                    value={payment?.booking || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <InputText
                    value={payment?.amount || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Method</label>
                    <InputText
                        value={payment ? PaymentMethod[payment.method] : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <InputText
                        value={payment ? PaymentStatus[payment.status] : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                <InputText
                    value={payment?.transactionReference || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Payment Date</label>
                <InputText
                    value={payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={payment?.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default PaymentDetails;