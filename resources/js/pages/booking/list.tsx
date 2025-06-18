import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type PageProps } from '@/types';
import { PencilIcon, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

type Booking = {
    id: number;
    user: {
        name: string;
    };
    service: {
        id: number;
        description: string;
        price: string;
    };
    service_id: number;
    date_booking: string;
    status: string;
};

type Service = {
    id: number;
    description: string;
    price: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Booking', href: '#' },
    { title: 'Manage Booking', href: '/list-booking' },
];

const Booking = () => {
    const { bookings, services, userRole } = usePage<PageProps<{ bookings: Booking[]; services: Service[] }>>().props;
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const { data, setData, processing, errors, reset } = useForm({
        name: '',
        price: '',
        date_booking: '',
        status: '',
        service_id: '',
    });

    const handleEdit = (booking: Booking) => {
        Swal.fire({
            title: 'Edit booking?',
            text: 'Are you sure you want to edit this booking?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Edit',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedBooking(booking);
                setData({
                    name: booking.user.name,
                    price: booking.service.price,
                    date_booking: booking.date_booking,
                    status: booking.status,
                    service_id: booking.service.id.toString(),
                });
                setEditOpen(true);
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;

        router.post(`/bookings/${selectedBooking.id}`, {
            ...data,
            _method: 'PUT',
        }, {
            onSuccess: () => {
                setEditOpen(false);
                setSelectedBooking(null);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Booking?',
            text: 'Apakah Anda yakin ingin menghapus data booking ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/bookings/${id}`);
            }
        });
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selected = services.find((s) => s.id.toString() === selectedId);

        setData({
            ...data,
            service_id: selectedId,
            price: selected?.price || '',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking List" />
            <div className="w-full px-6 py-8">
                <h2 className="text-3xl font-bold mb-6">Daftar Booking</h2>

                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Booking Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                            {userRole === 'admin' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    Tidak ada data booking.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4">
                                        {userRole === 'admin' ? booking.user.name : 'user'}
                                    </td>
                                    <td className="px-6 py-4">{booking.service.description}</td>
                                    <td className="px-6 py-4">Rp. {Number(booking.service.price).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">{dayjs(booking.date_booking).format('DD MMM YYYY')}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${
                                                booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-500'
                                                    : 'bg-green-100 text-green-500'
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-5 mt-2">
                                        {userRole === 'admin' && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(booking)}
                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <PencilIcon size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {isEditOpen && selectedBooking && (
                    <div className="w-full px-6 py-8 mt-10 border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Booking</h2>
                        <form className="space-y-5" onSubmit={handleUpdate}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Service Selected</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    value={data.service_id}
                                    onChange={handleServiceChange}
                                >
                                    <option value="">Pilih Service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.description}
                                        </option>
                                    ))}
                                </select>
                                {errors.service_id && <p className="text-sm text-red-600 mt-1">{errors.service_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                                <input
                                    type="date"
                                    value={data.date_booking}
                                    onChange={(e) => setData('date_booking', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                {errors.date_booking && <p className="text-sm text-red-500">{errors.date_booking}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditOpen(false);
                                        setSelectedBooking(null);
                                        reset();
                                    }}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                                    disabled={processing}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Booking;