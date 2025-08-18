import { Menubar } from 'primereact/menubar'
// import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import type { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import AvatarMenu from './AvatarMenu'
import { getMenuItems } from './MenuItems'

const Navbar = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const showToast = () => toast({ severity: 'success', summary: 'Success', detail: 'Success Message', life: 3000 })

    const itemRenderer = (item: MenuItem & { badge?: number; shortcut?: string }) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && (
                <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                    {item.shortcut}
                </span>
            )}
        </a>
    )

    const items = getMenuItems(itemRenderer, navigate, showToast)

    const start = (
        <img
            alt="logo"
            src="https://primefaces.org/cdn/primereact/images/logo.png"
            height="40"
            width="50"
            className="mr-4"
        />
    )

    const end = (
        <div className="flex items-center gap-2">
            {/* <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto rounded-md !p-2" /> */}
            <AvatarMenu avatarUrl="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" />
        </div>
    )

    return (
        <div className="px-5 py-3">
            <Menubar model={items} start={start} end={end} className="shadow-sm" />
        </div>
    );
};

export default Navbar;