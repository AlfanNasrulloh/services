import { useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Booking = {
    id: number,
    description: string,
    price: number,
    photo?: string,
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Booking', href: '#' },
    { title: 'Booking Service', href: '/add-booking' },
];

const AddBooking = () => {
    const { services } = usePage<{ services: Booking[] }>().props;
    
    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        date_booking: '',
    });
    
    const selectedService = services?.find(s => s.id === Number(data.service_id));

    const handleSubmit = (e: React.FormEvent) => {
        // console.log(data.date_booking)
        // console.log(data.service_id)
        e.preventDefault();
        post('/add-booking', {
        onError: (errors) => {
            console.error('Form Error:', errors);
        },
        onSuccess: () => {
            console.log('Success!');
        },
    });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Service" />
            <div className="w-full px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Booking Services</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={data.service_id}
                            onChange={(e) => setData('service_id', e.target.value)}
                        >
                            <option value="">Service Active</option>
                            {services?.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.description}
                                </option>
                            ))}
                        </select>
                        {errors.service_id && <p className="text-sm text-red-600 mt-1">{errors.service_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detail Service</label>
                        {selectedService ? (
                            <div className="border-2 p-4 rounded bg-gray-50">
                            <p className='font-bold '>Description :</p> {selectedService.description}
                            <p className='font-bold '>Price : </p> Rp. {Number(selectedService.price).toLocaleString('id-ID')}
                            <p className='font-bold '>Action Service : </p>
                            {selectedService.photo ? (
                                <img
                                src={`/storage/${selectedService.photo}`}
                                alt="Service"
                                className="mt-2 w-32 h-32 object-cover rounded"
                                />
                            ) : (
                                <p className="italic text-gray-500">No image</p>
                            )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Select a service to see the details.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                        <input
                            type="date"
                            className="w-50% px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={data.date_booking}
                            onChange={(e) => setData('date_booking', e.target.value)}
                        />
                        {errors.date_booking && <p className="text-sm text-red-600 mt-1">{errors.date_booking}</p>}
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

export default AddBooking;
