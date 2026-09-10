// components/TextDecorationControl.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/base/Icon';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';
import { IconName } from 'demaze-ui-lib/components';

interface TextDecorationControlProps {
  label: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  onColorChange: (color: string) => void;
  onAlignmentChange: (alignment: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onFontWeightChange: (weight: 'normal' | 'medium' | 'semibold' | 'bold') => void;
}

const TextDecorationControl: React.FC<TextDecorationControlProps> = ({
  label,
  color,
  alignment,
  fontSize,
  fontWeight,
  onColorChange,
  onAlignmentChange,
  onFontSizeChange,
  onFontWeightChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAlignmentMenu, setShowAlignmentMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showFontWeightMenu, setShowFontWeightMenu] = useState(false);

  const alignmentRef = useRef<HTMLDivElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontWeightRef = useRef<HTMLDivElement>(null);

  const alignmentOptions = [
    { label: 'Left', value: 'left' as const, icon: 'AlignLeft' },
    { label: 'Center', value: 'center' as const, icon: 'AlignCenter' },
    { label: 'Right', value: 'right' as const, icon: 'AlignRight' },
  ];

  const fontSizeOptions = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const fontWeightOptions = [
    { label: 'Normal', value: 'normal' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Semibold', value: 'semibold' as const },
    { label: 'Bold', value: 'bold' as const },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alignmentRef.current && !alignmentRef.current.contains(event.target as Node)) {
        setShowAlignmentMenu(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target as Node)) {
        setShowFontSizeMenu(false);
      }
      if (fontWeightRef.current && !fontWeightRef.current.contains(event.target as Node)) {
        setShowFontWeightMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAlignmentIcon = () => {
    const option = alignmentOptions.find(opt => opt.value === alignment);
    return option?.icon || 'AlignLeft';
  };

  return (
    <>
      <div className="space-y-3">
        {/* Label OUTSIDE the dashed border */}
        <label className="text-base text-gray-700 font-normal">{label}</label>
        
        {/* Dashed border container */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            
            {/* Colorful gradient square button */}
            <button
              type="button"
              onClick={() => setShowColorPicker(true)}
              className="w-10 h-10 rounded flex-shrink-0 border border-gray-200"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)'
              }}
              aria-label="Choose color"
            />

            {/* Hex color input with # prefix */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded min-w-[110px]">
              <span className="text-sm text-gray-700">#</span>
              <input
                type="text"
                value={color.replace('#', '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                  if (val.length <= 6) onColorChange('#' + val);
                }}
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 uppercase"
                maxLength={6}
                placeholder="FFFFFF"
              />
            </div>

            {/* Alignment dropdown with three-line icon */}
            <div className="relative w-20" ref={alignmentRef}>
              <button
                type="button"
                onClick={() => setShowAlignmentMenu(!showAlignmentMenu)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                <Icon name={getAlignmentIcon() as IconName} className="w-5 h-5 text-gray-700" />
                <Icon name="ChevronDown" className="w-4 h-4 text-gray-500" />
              </button>
              
              {showAlignmentMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  {alignmentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onAlignmentChange(option.value);
                        setShowAlignmentMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        alignment === option.value ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <Icon name={option.icon as IconName} className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font size dropdown */}
            <div className="relative w-20" ref={fontSizeRef}>
              <button
                type="button"
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">{fontSize}</span>
                <Icon name="ChevronDown" className="w-4 h-4 text-gray-500" />
              </button>
              
              {showFontSizeMenu && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {fontSizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        onFontSizeChange(size);
                        setShowFontSizeMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        fontSize === size ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font weight dropdown with B */}
            <div className="relative w-20" ref={fontWeightRef}>
              <button
                type="button"
                onClick={() => setShowFontWeightMenu(!showFontWeightMenu)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                <span className="text-sm font-bold text-gray-700">B</span>
                <Icon name="ChevronDown" className="w-4 h-4 text-gray-500" />
              </button>
              
              {showFontWeightMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  {fontWeightOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onFontWeightChange(option.value);
                        setShowFontWeightMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        fontWeight === option.value ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showColorPicker && (
        <ColorPickerDialog
          isOpen={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          onSave={(colorData) => {
            onColorChange(colorData.color);
            setShowColorPicker(false);
          }}
          initialColor={color}
          title="Select Color"
        />
      )}
    </>
  );
};

export default TextDecorationControl;