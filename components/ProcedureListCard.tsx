
import React from 'react';
import { ProcedureListData } from '../types';

const ProcedureListCard: React.FC<{ data: ProcedureListData }> = ({ data }) => {
    if (!data.procedures || data.procedures.length === 0) {
        return (
            <div className="mt-4 border rounded-lg bg-stone-50 overflow-hidden shadow-sm">
                 <header className="p-3 flex items-center gap-2 bg-stone-100 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-bold text-slate-700 text-sm">Covered Procedures</h3>
                </header>
                <div className="p-4">
                    <p className="text-sm text-slate-600">No specific procedures are listed for this plan.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 border rounded-lg bg-stone-50 overflow-hidden shadow-sm">
            <header className="p-3 flex items-center gap-2 bg-stone-100 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-bold text-slate-700 text-sm">Covered Procedures</h3>
            </header>
            <div className="p-4 max-h-64 overflow-y-auto">
                <ul className="space-y-3 text-sm">
                     {data.procedures.map((procedure, index) => (
                        <li key={index} className="text-slate-800">
                           <span className="font-semibold">{procedure.name}</span>
                           {procedure.details && (
                               <p className="text-xs text-slate-600 pl-2">{procedure.details}</p>
                           )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProcedureListCard;