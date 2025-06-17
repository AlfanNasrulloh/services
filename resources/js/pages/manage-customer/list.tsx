import { Head, usePage, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type PageProps } from '@/types';
import { PencilIcon, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import Swal from 'sweetalert2'
import { useState } from 'react';

type Service = {
    id: number;
    description: string;
    price: string;
    photo?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '#',
    },
    {
        title: 'Manage Service',
        href: '/list-service',
    },
];

const List = () => {
    const { services } = usePage<PageProps<{ services: Service[] }>>().props;
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { data, setData, processing, errors, reset } = useForm({
    description: '',
    price: '',
    photo: null as File | null,
});


    const handleEdit = (service: Service) => {
        Swal.fire({
            title: 'Edit Service?',
            text: 'Are you sure you want to edit this service?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Edit',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedService(service);
                setData({
                    description: service.description,
                    price: service.price,
                    photo: null,
                });
                setEditOpen(true);
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        // console.log(data.price);
        e.preventDefault();
        if (!selectedService) return;
        router.post(`/services/${selectedService.id}`, {
        ...data,
        _method: 'PUT',
            }, {
            forceFormData: true,
            onSuccess: () => {
                setEditOpen(false);
                setSelectedService(null);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Delete Service?',
            text: 'Are you sure you want to delete this service?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Ya, Deleted',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
            router.delete(`/services/${id}`);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Service List" />
            <div className="w-full px-6 py-8">
                <h2 className="text-3xl font-bold mb-6">Services List</h2>
                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Photo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No services available.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id}>
                                    <td className="px-6 py-4">
                                        {service.photo ? (
                                            <img
                                                src={`/storage/${service.photo}`}
                                                alt="Service"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">{service.description}</td>
                                    <td className="px-6 py-4 text-gray-800">Rp. {Number(service.price).toLocaleString('id-ID')}</td>
                                    {/* <td className="px-6 py-4 text-gray-800">Status belakangan lah</td> */}
                                    <td className="px-6 py-4 flex items-center gap-5 mt-7">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                            title="Edit"
                                        >
                                            <PencilIcon size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="text-red-600 hover:text-red-800 cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {isEditOpen && selectedService && (
                    <div className="w-full px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Service</h2>
                        <form className="space-y-5" onSubmit={handleUpdate}>
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 text-base"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full rounded-md shadow-sm border border-gray-300 focus:ring focus:ring-blue-200"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                                {data.photo ? (
                                    <img
                                        src={URL.createObjectURL(data.photo)}
                                        alt="Preview"
                                        className="mt-4 w-32 h-32 object-cover rounded-md border mb-5"
                                    />
                                ) : selectedService?.photo && (
                                    <img
                                        src={`/storage/${selectedService.photo}`}
                                        alt="Current"
                                        className="mt-4 w-32 h-32 object-cover rounded-md border mb-5"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                                />
                                {errors.photo && (
                                    <p className="text-sm text-red-600 mt-1">{errors.photo}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                type="button"
                                onClick={() => {
                                    setEditOpen(false);
                                    setSelectedService(null);
                                    reset();
                                }}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
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


export default List;