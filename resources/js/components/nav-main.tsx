import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    return (
        <div className="space-y-1">
            {items.map((item) =>
                item.items ? (
                    <Disclosure as="div" key={item.title} defaultOpen={item.isActive} className='mt-4'>
                        {({ open }) => (
                            <>
                                <Disclosure.Button
                                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded transition-colors
                                        ${
                                            item.isActive
                                                ? 'bg-gray-200 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                    {item.title}
                                    <ChevronDown
                                        className={`ml-auto h-4 w-4 transition-transform ${
                                            open ? 'rotate-180' : ''
                                        }`}
                                    />
                                </Disclosure.Button>

                                <Disclosure.Panel as="div" className="pl-8 space-y-1">
                                    {item.items?.map((subItem) => (
                                        <Link
                                            key={subItem.title}
                                            href={subItem.href ?? '#'}
                                            className={`mt-2 block px-2 py-1 text-sm rounded transition-colors
                                                ${
                                                    subItem.isActive
                                                        ? 'bg-gray-200 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {subItem.icon && (
                                                <subItem.icon className="w-4 h-4 inline mr-2" />
                                            )}
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ) : (
                    <Link
                        key={item.title}
                        href={item.href ?? '#'}
                        className={`flex items-center px-4 py-2 text-sm rounded transition-colors
                            ${
                                item.isActive
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.title}
                    </Link>
                )
            )}
        </div>
    );
}
