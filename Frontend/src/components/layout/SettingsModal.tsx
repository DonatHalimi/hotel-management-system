import { Dialog } from "primereact/dialog";
import { useState } from "react";

interface SettingsModalProps {
    visible: boolean;
    onHide: () => void;
}

const SettingsModal = ({ visible, onHide }: SettingsModalProps) => {
    const [activeTab, setActiveTab] = useState<"account" | "appearance" | "security">("account");

    return (
        <Dialog
            header="Settings"
            visible={visible}
            onHide={onHide}
            modal
            closable
            draggable={false}
            style={{ width: "640px", height: "420px" }}
        >
            <div className="flex h-full">
                <div className="w-44 border-r p-3">
                    <ul className="space-y-1 text-sm">
                        {[
                            ["account", "Account"],
                            ["appearance", "Appearance"],
                            ["security", "Security"],
                        ].map(([key, label]) => (
                            <li key={key}>
                                <button
                                    className={`w-full text-left px-2 py-2 rounded transition ${activeTab === key
                                        ? "bg-gray-200 font-medium"
                                        : "hover:bg-gray-100 cursor-pointer"
                                        }`}
                                    onClick={() => setActiveTab(key as any)}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                    {activeTab === "account" && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">Account</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Manage your personal information.
                            </p>

                            <div className="text-sm text-gray-500">
                                Name, email, profile picture, etc.
                            </div>
                        </>
                    )}

                    {activeTab === "appearance" && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">Appearance</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Control how the app looks.
                            </p>
                            <div className="text-sm text-gray-500">
                                Theme, density, layout mode…
                            </div>
                        </>
                    )}

                    {activeTab === "security" && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">Security</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Keep your account safe.
                            </p>
                            <div className="text-sm text-gray-500">
                                Password, sessions, 2FA…
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default SettingsModal;