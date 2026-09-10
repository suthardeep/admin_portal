import React, { useState } from 'react';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { MPicker } from '@/components/media-picker/MPicker';
import { MediaPicker } from '@/components/media-picker/MediaPicker';



const CategoryInputRow: React.FC<{
  label: string;
  value: string;
  image: any[];
  onNameChange: (value: string) => void;
  onImageChange: (value: any) => void;
  placeholder: string;
  showRemove?: boolean;
  onRemove?: () => void;
}> = ({ label, value, image, onNameChange, onImageChange, placeholder, showRemove, onRemove }) => (
  <div className="grid grid-cols-[auto_1fr] gap-3">
    <div className="space-y-1.5">
      <Label required={true} className='font-light'>{label} Image</Label>
      <MediaPicker
        value={image}
        ids={[]}
        urls={[]}
        label=''
        onChange={onImageChange}
        maxFiles={1}
        iconType="upload"
        dragDropText="Drag & Drop or Choose file to upload"
        sizeConfig={{ height: "h-[36px]" }}
        className="w-full"
        textConfig={{ size: "xl", show: true }}
        variant='inline'
        required={true}
      />
    </div>
    
    <div className="flex gap-2 items-end">
      <div className="flex-1 space-y-1.5">
        <Label required={true} className='font-light'>{label} Name</Label>
        <Input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
          placeholder={placeholder}
          className="h-[36px] w-full"
        />
      </div>
      {showRemove && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center h-[36px] text-base-content hover:text-base-content/80 mb-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          </svg>
        </button>
      )}
    </div>
  </div>
);



export default CategoryInputRow