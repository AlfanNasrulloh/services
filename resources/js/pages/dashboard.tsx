import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head } from '@inertiajs/react';

type User = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users List',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { user } = usePage<PageProps<{ user: User[] }>>().props;
    
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage user" />.
                <div className="w-full px-6">
                    <h2 className="text-2xl font-bold mb-6">User List</h2>
    
                    {user?.length ? (
                        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200">
                            <table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="text-left px-6 py-3">Name</th>
                                        <th className="text-left px-6 py-3">Email</th>
                                        <th className="text-left px-6 py-3">Role</th>
                                        <th className="text-left px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.map((user: User) => (
                                        <tr
                                            key={user.id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {user.role ?? '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="text-blue-600 hover:underline text-sm font-medium"
                                                    onClick={() => console.log(`Open user ${user.id}`)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No user found.</p>
                    )}
                </div>
            </AppLayout>
        );
    };