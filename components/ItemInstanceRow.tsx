import React, { useState, useEffect } from 'react';
import { AssessmentItem, ItemInstance, Status } from '../types.ts';
import { Modal } from './Modal.tsx';
import { ImageInput } from './ImageInput.tsx';

interface ItemInstanceRowProps {
  item: AssessmentItem;
  instance: ItemInstance;
  sectionIndex: number;
  itemIndex: number;
  instanceIndex: number;
  isInvalid: boolean;
  onStatusChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, status: Status) => void;
  onDescriptionChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, description: string) => void;
  onPhotoChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, photo: File | null) => void;
  onRemove: (sectionIndex: number, itemIndex: number, instanceIndex: number) => void;
}

export const ItemInstanceRow: React.FC<ItemInstanceRowProps> = ({
  item, instance, sectionIndex, itemIndex, instanceIndex, isInvalid, 
  onStatusChange, onDescriptionChange, onPhotoChange, onRemove
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const isMultiInstance = item.instances.length > 1;

  useEffect(() => {
    return () => {
      if (modalImageUrl) {
        URL.revokeObjectURL(modalImageUrl);
      }
    };
  }, [modalImageUrl]);

  const handleThumbnailClick = (file: File) => {
    if (modalImageUrl) {
      URL.revokeObjectURL(modalImageUrl);
    }
    const newUrl = URL.createObjectURL(file);
    setModalImageUrl(newUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const itemText = isMultiInstance ? `${item.text} #${instanceIndex + 1}` : item.text;
  const itemIdText = isMultiInstance ? `${item.id}.${instanceIndex + 1}` : item.id;

  const statusButtonClasses = (status: Status, currentStatus: Status) => 
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      currentStatus === status
        ? (status === 'OK' ? 'bg-green-600 text-white shadow-sm' : 
           status === 'Not OK' ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-500 text-white shadow-sm')
        : `bg-slate-200 text-slate-700 ${
            status === 'OK' ? 'hover:bg-green-100' : 
            status === 'Not OK' ? 'hover:bg-red-100' : 'hover:bg-slate-300'}`
    }`;

  return (
    <React.Fragment>
      <div className={`border rounded-lg p-4 transition-all hover:shadow-md bg-white ${isInvalid ? 'border-red-500 border-2' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 mb-4 sm:mb-0">
            <p className="font-semibold text-gray-800">
              <span className={`mr-2 font-bold ${isInvalid ? 'text-red-500' : 'text-blue-600'}`}>{itemIdText}</span>
              {itemText}
            </p>
          </div>
          <div className="flex items-center flex-wrap justify-start sm:justify-end gap-2 flex-shrink-0">
            <button type="button" onClick={() => onStatusChange(sectionIndex, itemIndex, instanceIndex, 'OK')} className={statusButtonClasses('OK', instance.status)}>OK</button>
            <button type="button" onClick={() => onStatusChange(sectionIndex, itemIndex, instanceIndex, 'Not OK')} className={statusButtonClasses('Not OK', instance.status)}>Not OK</button>
            <button type="button" onClick={() => onStatusChange(sectionIndex, itemIndex, instanceIndex, 'N/A')} className={statusButtonClasses('N/A', instance.status)}>N/A</button>
            {isMultiInstance && (
              <button type="button" onClick={() => onRemove(sectionIndex, itemIndex, instanceIndex)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={`Hapus ${itemText}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi / Catatan {instance.status === 'Not OK' && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                value={instance.description}
                onChange={(e) => onDescriptionChange(sectionIndex, itemIndex, instanceIndex, e.target.value)}
                rows={3}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${isInvalid && instance.status === 'Not OK' ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Jelaskan masalah atau tambahkan catatan..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Foto</label>
              <ImageInput
                file={instance.photo}
                onChange={(file) => onPhotoChange(sectionIndex, itemIndex, instanceIndex, file)}
                onThumbnailClick={handleThumbnailClick}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalImageUrl && <img src={modalImageUrl} alt="Full size preview" className="max-w-full max-h-[80vh] mx-auto rounded-md object-contain" />}
      </Modal>
    </React.Fragment>
  );
};