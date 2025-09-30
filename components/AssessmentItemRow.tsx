import React from 'react';
import { AssessmentItem, Status } from '../types.ts';
import { ItemInstanceRow } from './ItemInstanceRow.tsx';

interface AssessmentItemRowProps {
    item: AssessmentItem;
    sectionIndex: number;
    itemIndex: number;
    onStatusChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, status: Status) => void;
    onDescriptionChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, description: string) => void;
    onPhotoChange: (sectionIndex: number, itemIndex: number, instanceIndex: number, photo: File | null) => void;
    onAddItemInstance: (sectionIndex: number, itemIndex: number) => void;
    onRemoveItemInstance: (sectionIndex: number, itemIndex: number, instanceIndex: number) => void;
    validationErrors: string[];
}

export const AssessmentItemRow: React.FC<AssessmentItemRowProps> = ({ 
    item, sectionIndex, itemIndex, onStatusChange, onDescriptionChange, onPhotoChange,
    onAddItemInstance, onRemoveItemInstance, validationErrors
}) => {
  return (
    <div className="space-y-4">
      {item.instances.map((instance, instanceIndex) => {
        const instanceId = `${item.id}-${instanceIndex}`;
        const isInvalid = validationErrors.includes(instanceId);
        return (
          <ItemInstanceRow
            key={instanceIndex}
            item={item}
            instance={instance}
            sectionIndex={sectionIndex}
            itemIndex={itemIndex}
            instanceIndex={instanceIndex}
            isInvalid={isInvalid}
            onStatusChange={onStatusChange}
            onDescriptionChange={onDescriptionChange}
            onPhotoChange={onPhotoChange}
            onRemove={onRemoveItemInstance}
          />
        )
      })}

      {item.isRepeatable && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onAddItemInstance(sectionIndex, itemIndex)}
            className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-md hover:bg-slate-100 hover:border-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah {item.text}
          </button>
        </div>
      )}
    </div>
  );
};