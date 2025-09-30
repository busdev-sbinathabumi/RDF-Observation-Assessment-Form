import React, { useMemo } from 'react';
import { AssessmentSection } from '../types.ts';

interface SummaryDashboardProps {
  sections: AssessmentSection[];
  filterOn: boolean;
  onFilterToggle: (isOn: boolean) => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ sections, filterOn, onFilterToggle }) => {
  const stats = useMemo(() => {
    let ok = 0;
    let notOk = 0;
    let na = 0;
    let notFilled = 0;
    
    sections.forEach(section => {
      section.items.forEach(item => {
        item.instances.forEach(instance => {
          switch (instance.status) {
            case 'OK': ok++; break;
            case 'Not OK': notOk++; break;
            case 'N/A': na++; break;
            default: notFilled++; break;
          }
        });
      });
    });

    return { ok, notOk, na, notFilled };
  }, [sections]);

  return (
    <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Assessment Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
        <div className="bg-green-100 text-green-800 p-3 rounded-lg">
          <p className="text-xl sm:text-2xl font-bold">{stats.ok}</p>
          <p className="text-sm">OK</p>
        </div>
        <div className="bg-red-100 text-red-800 p-3 rounded-lg">
          <p className="text-xl sm:text-2xl font-bold">{stats.notOk}</p>
          <p className="text-sm">Not OK</p>
        </div>
        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
          <p className="text-xl sm:text-2xl font-bold">{stats.na}</p>
          <p className="text-sm">N/A</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
          <p className="text-xl sm:text-2xl font-bold">{stats.notFilled}</p>
          <p className="text-sm">Belum Diisi</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <label htmlFor="filterToggle" className="text-sm font-medium text-gray-700 select-none">
          Hanya tampilkan item 'Not OK'
        </label>
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            name="filterToggle"
            id="filterToggle"
            checked={filterOn}
            onChange={(e) => onFilterToggle(e.target.checked)}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="filterToggle"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </div>
    </div>
  );
};