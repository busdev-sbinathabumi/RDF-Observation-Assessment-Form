import React from 'react';
import { FormHeaderData } from '../types.ts';

interface FormHeaderProps {
  data: FormHeaderData;
  onChange: (field: keyof FormHeaderData, value: string) => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
      <div>
        <label htmlFor="assessmentDate" className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Penilaian
        </label>
        <input
          type="date"
          id="assessmentDate"
          value={data.assessmentDate}
          onChange={(e) => onChange('assessmentDate', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="areaLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Area/Lokasi
        </label>
        <input
          type="text"
          id="areaLocation"
          value={data.areaLocation}
          onChange={(e) => onChange('areaLocation', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Gudang A"
          required
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="assessorName" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Asesor
        </label>
        <input
          type="text"
          id="assessorName"
          value={data.assessorName}
          onChange={(e) => onChange('assessorName', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nama lengkap asesor"
          required
        />
      </div>
    </div>
  );
};