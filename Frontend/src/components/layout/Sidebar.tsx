import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authServices';
import { hasRole } from '../../utils/auth';
import AvatarMenu from '../navbar/AvatarMenu';

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
}

interface MenuItem {
    label: string;
    icon: string;
    path?: string;
    badge?: string;
    badgeClass?: string;
    children?: MenuItem[];
}

const AppSidebar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        userMgmt: true,
        hotelsMgmt: true,
    });

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

    const handleMenuClick = (path?: string) => {
        if (!path) return;
        navigate(path);
        setVisible(false);
    };

    const isActive = (path?: string) => location.pathname === path;

    const toggleMenu = (key: string) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const menuItems: MenuItem[] = useMemo(() => {
        const base: MenuItem[] = [
            { label: 'Dashboard', icon: 'pi pi-home', path: '/dashboard' },
            { label: 'Profile', icon: 'pi pi-user', path: '/profile/me' },
        ];

        if (hasRole(['Admin'])) {
            base.push(
                {
                    label: 'User Management',
                    icon: 'pi pi-users',
                    children: [
                        { label: 'Users', icon: 'pi pi-user', path: '/users' },
                        { label: 'Roles', icon: 'pi pi-cog', path: '/roles' },
                        { label: 'Guests', icon: 'pi pi-users', path: '/guests' },
                    ],
                },
                {
                    label: 'Hotel Management',
                    icon: 'pi pi-building',
                    children: [
                        { label: 'Hotels', icon: 'pi pi-building', path: '/hotels' },
                        { label: 'Rooms', icon: 'pi pi-address-book', path: '/rooms' },
                        { label: 'Room Types', icon: 'pi pi-address-book', path: '/room-types' },
                        { label: 'Bookings', icon: 'pi pi-calendar', path: '/bookings' },
                        { label: 'Payments', icon: 'pi pi-money-bill', path: '/payments' },
                    ],
                }
            );
        }

        return base;
    }, []);

    const renderMenuButton = (item: MenuItem, index: number) => {
        const hasChildren = !!item.children?.length;
        const key =
            item.label === 'User Management'
                ? 'userMgmt'
                : item.label === 'Hotel Management'
                    ? 'hotelsMgmt'
                    : item.label;

        const isOpen = openMenus[key];

        return (
            <div key={index}>
                <button
                    onClick={() =>
                        hasChildren
                            ? collapsed
                                ? setCollapsed(false)
                                : toggleMenu(key)
                            : handleMenuClick(item.path)
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isActive(item.path) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                    <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'space-x-3'}`}
                    >
                        <i className={`${item.icon} text-lg`} />
                        {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && hasChildren && (
                        <i className={`pi ${isOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-500 text-sm`} />
                    )}
                </button>

                {!collapsed && hasChildren && (
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-6 mt-1 space-y-1">
                            {item.children?.map((child, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleMenuClick(child.path)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-200 cursor-pointer ${isActive(child.path)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <i className={`${child.icon} text-base`} />
                                        <span>{child.label}</span>
                                    </div>
                                    {child.badge && (
                                        <Badge
                                            value={child.badge}
                                            className={child.badgeClass || 'p-badge-secondary'}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 w-full z-50">
                <Menubar
                    start={<Button icon="pi pi-align-left" text onClick={() => setVisible(true)} />}
                    end={<AvatarMenu user={user} avatarUrl={user?.profilePicture || ''} />}
                    className="border-none shadow-sm"
                />
            </div>

            <div className={`hidden md:flex fixed left-0 top-0 h-full ${collapsed ? 'w-20' : 'w-64'} bg-white shadow-lg border-r border-gray-200 flex-col z-40 transition-all duration-300`}>
                <Link to="/" className="block">
                    <div className="flex items-center justify-between gap-3 p-6 border-b border-gray-200 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            {!collapsed && (
                                <span className="text-lg font-semibold text-gray-800">Home</span>
                            )}
                        </div>

                        <Button
                            icon="pi pi-bars"
                            text
                            rounded
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                setCollapsed((prev) => !prev);
                            }}
                        />
                    </div>
                </Link>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map(renderMenuButton)}
                </nav>

                {!collapsed && (
                    <>
                        <Divider />
                        <div className="px-4 mb-4">
                            <AvatarMenu user={user} avatarUrl={user?.profilePicture || ''} />
                        </div>
                    </>
                )}
            </div>

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
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : 'User'}
                            </h3>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="px-4 py-6 space-y-2">
                    {menuItems.map(renderMenuButton)}

                    <Divider />

                    <Button
                        label="Sign Out"
                        icon="pi pi-sign-out"
                        onClick={handleLogout}
                        size="small"
                        className="w-full p-button-outlined p-button-secondary"
                    />
                </nav>
            </Sidebar>
        </>
    );
};

export default AppSidebar;