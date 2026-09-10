// components/GradientColorInput.tsx
import React, { useState } from 'react';
import { Icon } from '@/components/base/Icon';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';

interface GradientColorInputProps {
  color: string;
  opacity: number;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

const GradientColorInput: React.FC<GradientColorInputProps> = ({
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  onRemove,
  showRemove = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-3">
          
          {/* Remove button (if applicable) */}
          {showRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Remove gradient color"
            >
              <Icon name="Minus" className="w-5 h-5" />
            </button>
          )}

          {/* Color square button with selected color */}
          <button
            type="button"
            onClick={() => setShowColorPicker(true)}
            className="w-10 h-10 rounded flex-shrink-0 border-2 border-gray-300"
            style={{
              backgroundColor: color
            }}
          />

          {/* # FFFFFF text */}
          <div className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded min-w-[110px]">
            <span className="text-sm text-gray-700">#</span>
            <input
              type="text"
              value={color.replace('#', '')}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                if (val.length <= 6) onColorChange('#' + val);
              }}
              className="flex-1 text-sm bg-transparent outline-none text-gray-700"
              maxLength={6}
              placeholder="FFFFFF"
            />
          </div>

          {/* Opacity Label */}
          <span className="text-sm text-gray-700 font-normal flex-shrink-0">Opacity</span>

          {/* Opacity Slider */}
          <div className="flex-1 min-w-[120px] max-w-[200px]">
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => onOpacityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#667eea'
              }}
            />
          </div>

          {/* Opacity percentage */}
          <div className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded w-20">
            <input
              type="number"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => {
                const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                onOpacityChange(val);
              }}
              className="w-full text-sm bg-transparent outline-none text-gray-700 text-right"
            />
            <span className="text-sm text-gray-700">%</span>
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
          title="Select Gradient Color"
        />
      )}
    </>
  );
};

export default GradientColorInput;