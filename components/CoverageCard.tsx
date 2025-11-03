import React from 'react';
import { CoverageData } from '../types';

// Helper to format the backend keys into human-readable labels
const formatLabel = (key: string): string => {
    return key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/(\b[a-z](?!\s))/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const CoverageCard: React.FC<{ data: CoverageData }> = ({ data }) => {
    // We will build the list of details to display dynamically
    const details: { [key: string]: string | undefined } = {
        'Covered': data.covered ? '✅ Yes' : '❌ No',
        ...data.limits,
    };

    return (
        <div className="mt-4 border rounded-lg bg-stone-50 overflow-hidden shadow-sm">
            <header className="p-3 flex items-center gap-2 bg-stone-100 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <h3 className="font-bold text-slate-700 text-sm">Coverage Summary Card</h3>
            </header>
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-200/60">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-slate-800">Coverage Detail</th>
                        <th className="px-4 py-2 font-semibold text-slate-800">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(details).map(([key, value]) => {
                        // Only render a row if the value is not null, undefined, or the string "NULL"
                        if (value === null || value === undefined || String(value).toUpperCase() === 'NULL') {
                            return null;
                        }
                        return (
                            <tr key={key} className="border-t border-stone-200">
                                <td className="px-4 py-2 text-slate-600">{formatLabel(key)}</td>
                                <td className="px-4 py-2 text-slate-800 font-medium">{String(value)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CoverageCard;