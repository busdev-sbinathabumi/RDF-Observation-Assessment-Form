import React from 'react';
import { FollowUpData } from '../types.ts';

interface FollowUpSectionProps {
  data: FollowUpData;
  onChange: (field: keyof FollowUpData, value: string) => void;
}

export const FollowUpSection: React.FC<FollowUpSectionProps> = ({ data, onChange }) => {
  return (
    <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">5. Catatan & Tindak Lanjut</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Assessment Summary
          </label>
          <textarea
            id="summary"
            rows={3}
            value={data.summary}
            onChange={(e) => onChange('summary', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ringkasan umum dari hasil penilaian..."
          />
        </div>
        <div>
          <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">
            Rekomendasi Tindakan Perbaikan
          </label>
          <textarea
            id="recommendations"
            rows={3}
            value={data.recommendations}
            onChange={(e) => onChange('recommendations', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Langkah-langkah perbaikan yang disarankan..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="personInCharge" className="block text-sm font-medium text-gray-700 mb-1">
              Penanggung Jawab
            </label>
            <input
              type="text"
              id="personInCharge"
              value={data.personInCharge}
              onChange={(e) => onChange('personInCharge', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama penanggung jawab"
            />
          </div>
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
              Target Tanggal Penyelesaian
            </label>
            <input
              type="date"
              id="targetDate"
              value={data.targetDate}
              onChange={(e) => onChange('targetDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};