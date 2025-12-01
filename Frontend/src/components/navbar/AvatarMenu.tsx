import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
}

interface AvatarMenuProps {
    user: User | null
    avatarUrl: string
}

const AvatarMenu = ({ user, avatarUrl }: AvatarMenuProps) => {
    const avatarMenu = useRef<Menu>(null);
    const navigate = useNavigate();

    const avatarItems: MenuItem[] = [
        { label: 'Profile', icon: 'pi pi-user', command: () => navigate('/profile/me') },
        { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => navigate('/dashboard') },
        { label: 'Settings', icon: 'pi pi-cog', command: () => navigate('/settings') },
        { separator: true },
        {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            command: () => {
                localStorage.removeItem('accessToken')
                navigate('/login')
            }
        }
    ]

    const toggleAvatarMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        avatarMenu.current?.toggle(e);
    }

    return (
        <div className="flex items-center gap-3 p-2 w-full rounded hover:cursor-pointer hover:bg-gray-100" onClick={toggleAvatarMenu}>
            <Avatar
                image={avatarUrl}
                shape="circle"
                size='normal'
                className="cursor-pointer"
            />
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'User'
                    }
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                </p>
            </div>

            <Menu model={avatarItems} popup ref={avatarMenu} />
        </div>
    );
};

export default AvatarMenu;