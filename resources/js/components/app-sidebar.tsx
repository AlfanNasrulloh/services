import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookmarkCheck, LayoutGrid, MonitorCogIcon, NotebookIcon, PlusSquare, User } from 'lucide-react';
import AppLogo from './app-logo';

type User = {
    name: string;
    email: string;
    role: string;
};

type PageProps = {
    auth: {
        user?: User;
    };
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const userRole = auth?.user?.role || 'customer';

    const mainNavItems: NavItem[] = [
        {
            title: 'Booking',
            icon: BookmarkCheck,
            items: [
                {
                    title: 'Manage Booking List',
                    href: '/list-booking',
                    icon: NotebookIcon,
                },
                {
                    title: 'Add Booking',
                    href: '/add-booking',
                    icon: PlusSquare,
                },
            ],
        },
    ];
    
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Services',
            icon: MonitorCogIcon,
            items: [
                {
                    title: 'Manage Service List',
                    href: '/list-service',
                    icon: NotebookIcon,
                },
                {
                    title: 'Add Service',
                    href: '/add-service',
                    icon: PlusSquare,
                },
            ],
        },
        {
            title: 'Booking',
            icon: BookmarkCheck,
            items: [
                {
                    title: 'Manage Booking List',
                    href: '/list-booking',
                    icon: NotebookIcon,
                },
                {
                    title: 'Add Booking',
                    href: '/add-booking',
                    icon: PlusSquare,
                },
            ],
        },
    ];

    const navItems = userRole === 'admin'
        ? [...adminNavItems]
        : [...mainNavItems];

    const { url: currentPath } = usePage();
    const navItemsWithActive: NavItem[] = navItems.map((item: NavItem) => {
        if (item.items) {
            const updatedSubItems = item.items.map((subItem: NavItem) => ({
                ...subItem,
                isActive: subItem.href === currentPath,
            }));

            const isAnySubActive = updatedSubItems.some((sub: NavItem) => sub.isActive);

            return {
                ...item,
                isActive: isAnySubActive,
                items: updatedSubItems,
            };
        }

        return {
            ...item,
            isActive: item.href === currentPath,
        };
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* ✅ Gunakan navItemsWithActive */}
                <NavMain items={navItemsWithActive} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
