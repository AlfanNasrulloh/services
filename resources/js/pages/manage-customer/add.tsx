import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '#',
    },
    {
        title: 'Add Service',
        href: '/add-service',
    },
];

const AddService = () => {
    const { data, setData, post, processing, errors } = useForm<{
        description: string;
        price: string;
        photo: File | null;
    }>({
        description: '',
        price: '',
        photo: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/add-service', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Service" />
            <div className="w-full px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Service</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        {data.photo && (
                            <img
                                src={URL.createObjectURL(data.photo)}
                                alt="Preview"
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

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default AddService;
