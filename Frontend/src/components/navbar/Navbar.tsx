import { Menubar } from 'primereact/menubar'
// import { InputText } from 'primereact/inputtext'
// import { Badge } from 'primereact/badge'
import type { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import AvatarMenu from './AvatarMenu'
import { getMenuItems } from './MenuItems'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../../services/authServices';

interface User {
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    // role: string,
}

const Navbar = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);

    const showToast = () => toast({ severity: 'success', summary: 'Success', detail: 'Success Message', life: 3000 });
    const isLoggedIn = !!user;

    const itemRenderer = (item: MenuItem & { badge?: number; shortcut?: string }) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {/* {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && (
                <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                    {item.shortcut}
                </span>
            )} */}
        </a>
    );

    const items = getMenuItems(itemRenderer, navigate, showToast)

    const start = (
        <img
            alt="logo"
            src="https://primefaces.org/cdn/primereact/images/logo.png"
            height="40"
            width="50"
            className="mr-4 relative md:left-20"
        />
    );

    const end = (
        isLoggedIn ? (
            <div className="flex items-center gap-6 md:pr-16">
                <AvatarMenu user={user} avatarUrl={user?.profilePicture || ''} />
            </div>
        ) : (
            <div className="flex items-center gap-6 md:pr-32">
                <Button
                    label="Log In"
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-0 rounded-lg text-white text-base font-medium font-sans transition-all duration-200 !p-3"
                />
            </div>
        )
    );

    // TODO: change later on to be more centralized, maybe via context / redux store
    const getUserDetails = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getUserDetails();
        }
    }, []);

    return (
        <div className="">
            <Menubar model={items} start={start} end={end} className="shadow-sm" />
        </div>
    );
};

export default Navbar;