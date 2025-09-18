import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authServices';
import AvatarMenu from '../navbar/AvatarMenu';
import { hasRole } from '../../utils/auth';

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
}

interface MenuItem {
    label: string;
    icon: string;
    path: string;
    badge?: string;
    badgeClass?: string;
}

const AppSidebar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        getUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const handleMenuClick = (path: string) => {
        navigate(path);
        setVisible(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const menuItems: MenuItem[] = useMemo(() => {
        const base: MenuItem[] = [
            { label: 'Dashboard', icon: 'pi pi-home', path: '/dashboard' },
            { label: 'Profile', icon: 'pi pi-user', path: '/profile/me' },
            { label: 'Reservations', icon: 'pi pi-calendar', path: '/reservations', badge: '3', badgeClass: 'p-badge-success' },
            // { label: 'Settings', icon: 'pi pi-cog', path: '/settings' },
            // { label: 'Support', icon: 'pi pi-question-circle', path: '/support' },
        ];

        if (hasRole(['Admin'])) {
            base.splice(3, 0, { label: 'Hotels', icon: 'pi pi-building', path: '/hotels' });
        }

        return base;
    }, []);

    return (
        <>
            <div className="md:hidden">
                <Button
                    icon="pi pi-bars"
                    onClick={() => setVisible(true)}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#374151' }}
                    className="fixed top-4 left-4 z-50 p-button-rounded p-button-text"
                />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex-col z-40">
                <div className="p-6 border-b border-gray-200">
                    Home
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleMenuClick(item.path)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <i className={`${item.icon} text-lg`} />
                                <span>{item.label}</span>
                            </div>

                            {item.badge && (
                                <Badge value={item.badge} className={item.badgeClass || 'p-badge-secondary'} />
                            )}
                        </button>
                    ))}
                </nav>

                <Divider />

                <div className="px-4 mb-4">
                    <div className="flex items-center gap-6 w-full">
                        <AvatarMenu user={user} avatarUrl={user?.profilePicture ?? ''} />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <Sidebar visible={visible} onHide={() => setVisible(false)} modal className="w-80">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Avatar
                            image={user?.profilePicture}
                            icon={!user?.profilePicture ? 'pi pi-user' : undefined}
                            size="large"
                            shape="circle"
                            className="bg-blue-500 text-white"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>

                <nav className="md:hidden px-4 py-6 space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleMenuClick(item.path)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <i className={`${item.icon} text-lg`} />
                                <span>{item.label}</span>
                            </div>

                            {item.badge && (
                                <Badge value={item.badge} className={item.badgeClass || 'p-badge-secondary'} />
                            )}
                        </button>
                    ))}

                    <Divider />

                    <Button label="Sign Out" icon="pi pi-sign-out" onClick={handleLogout} size="small" className="w-full p-button-outlined p-button-secondary" />
                </nav>
            </Sidebar>
        </>
    );
};

export default AppSidebar;