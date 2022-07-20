import { Button } from '@components/ui/common';
import { useState } from 'react';

const OPTIONS = ['all', 'purchased', 'activated', 'deactivated'];
export default function CourseFilter({ onSearchSubmit, onFilterSelected }) {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="flex flex-col md:flex-row items-center justify-center my-4">
            <div className="flex mr-2 relative rounded-md">
                <input
                    value={searchTerm}
                    onChange={({ target: { value } }) => setSearchTerm(value)}
                    type="text"
                    name="account"
                    id="account"
                    className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0x2341ab..."
                />
                <Button
                    className={'ml-2'}
                    onClick={() => onSearchSubmit(searchTerm)}
                >
                    Search
                </Button>
            </div>
            <div className="relative text-gray-700 md:mt-2 mt-4">
                <select
                    className="w-72 h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
                    placeholder="Regular input"
                    onChange={({ target: { value } }) =>
                        onFilterSelected(value)
                    }
                >
                    {OPTIONS.map((item) => {
                        return (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        );
                    })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
