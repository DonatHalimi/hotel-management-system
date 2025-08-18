import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface AvatarMenuProps {
    avatarUrl: string
}

const AvatarMenu = ({ avatarUrl }: AvatarMenuProps) => {
    const avatarMenu = useRef<Menu>(null);
    const navigate = useNavigate();

    const avatarItems: MenuItem[] = [
        { label: 'Profile', icon: 'pi pi-user', command: () => navigate('/profile') },
        { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => navigate('/dashboard') },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                localStorage.removeItem('accessToken')
                navigate('/login')
            }
        }
    ]

    return (
        <div className="flex items-center gap-6 mr-8">
            <Avatar
                image={avatarUrl}
                shape="circle"
                onClick={(e) => avatarMenu.current?.toggle(e)}
                size='large'
                className="cursor-pointer"
            />
            <Menu model={avatarItems} popup ref={avatarMenu} />
        </div>
    );
};

export default AvatarMenu;