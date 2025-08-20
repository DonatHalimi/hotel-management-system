import React from 'react';
import type { MenuItem } from 'primereact/menuitem';

export const getMenuItems = (
    itemRenderer: (item: MenuItem & { badge?: number; shortcut?: string }) => React.ReactNode,
    navigate: (path: string) => void,
    showToast: () => void
): MenuItem[] => [
        { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
        // { label: 'Features', icon: 'pi pi-star' },
        { label: 'Show Toast', icon: 'pi pi-bell', command: showToast },
        { label: 'Posts', icon: 'pi pi-users', command: () => navigate('/posts') },
        // {
        //     label: 'Projects',
        //     icon: 'pi pi-search',
        //     items: [
        //         { label: 'Core', icon: 'pi pi-bolt', template: itemRenderer },
        //         { label: 'Blocks', icon: 'pi pi-server', template: itemRenderer },
        //         { label: 'UI Kit', icon: 'pi pi-pencil', template: itemRenderer },
        //         { separator: true } as MenuItem,
        //         {
        //             label: 'Templates',
        //             icon: 'pi pi-palette',
        //             items: [
        //                 { label: 'Apollo', icon: 'pi pi-palette', template: itemRenderer },
        //                 { label: 'Ultima', icon: 'pi pi-palette', template: itemRenderer }
        //             ] as MenuItem[]
        //         }
        //     ] as MenuItem[]
        // },
        { label: 'Contact', icon: 'pi pi-envelope', template: itemRenderer },
    ];