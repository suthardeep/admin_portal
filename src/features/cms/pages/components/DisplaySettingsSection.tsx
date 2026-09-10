import React from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import { Icon } from '@/components/base/Icon';
import Dropdown from '@/components/base/Dropdown';
import ErrorText from '@/components/base/ErrorText';
import AddContentItemModal from './AddContentItemModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DisplaySettingsSectionProps {
  form: any;
}

interface SortableItemProps {
  item: { id: string; name: string };
  index: number;
  onDelete: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, index, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border-2 border-dashed border-base-content/30 rounded-lg bg-white hover:border-base-content/50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <Icon name="DragDrop" className="w-5 h-5 text-base-content/40" />
      </div>
      <span className="flex-1 text-sm text-base-content">{item.name}</span>
      <button
        type="button"
        onClick={onDelete}
        className="text-base-content/40 hover:text-error transition-colors"
      >
        <Icon name="Trash2" className="w-5 h-5 text-base-content/55" />
      </button>
    </div>
  );
};

const DisplaySettingsSection: React.FC<DisplaySettingsSectionProps> = ({
  form,
}) => {
  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const displayTypeOptions = [
    { label: 'Slider', value: 'SLIDER' },
    { label: 'Horizontal list', value: 'HORIZONTAL_LIST' },
    { label: 'Grid', value: 'GRID' },
    { label: 'Single slide', value: 'SINGLE_SLIDE' },
  ];

  const handleAddContentItem = (data: {
    sourceType: string;
    selectedItems: Array<{ id: string; name: string }>;
    conditions?: any[]
  }) => {
    // Set source type
    setValue('contentConfig.sourceType', data.sourceType);

    // Set selected items
    setValue('contentConfig.selectedItems', data.selectedItems);

    // Set conditions if they exist
    if (data.conditions && data.conditions.length > 0) {
      setValue('contentConfig.conditions', data.conditions);
    }

    setIsAddItemModalOpen(false);
  };


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const items = formData.contentConfig?.selectedItems || [];
      const oldIndex = items.findIndex((item: { id: string }) => item.id === active.id);
      const newIndex = items.findIndex((item: { id: string }) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      setValue('contentConfig.selectedItems', reorderedItems);
    }
  };

  return (
    <>
      {/* Display Settings Section */}
      <div className="rounded-md bg-base-100 shadow-sm bg-white">
        <div className="p-4 border-b border-body-content/20">
          <h2 className="text-base font-semibold text-base-content">Display Settings</h2>
        </div>

        <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-light" required={true}>Display type</Label>
          <Dropdown
            value={formData.displaySettings.displayType}
            onChange={(value) => setValue('displaySettings.displayType', value)}
            options={displayTypeOptions}
            placeholder="Slider/Horizontal list/Grid/Single slide"
            inputSize="md"
            containerClassName="w-full"
          />
          {errors?.displaySettings?.displayType && (
            <ErrorText className="text-error!">{errors.displaySettings.displayType.message}</ErrorText>
          )}
        </div>

        {(formData.displaySettings.displayType === 'SLIDER' || formData.displaySettings.displayType === 'slider') && (
          <>
            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Interval (seconds)</Label>
              <Input
                type="number"
                value={formData.displaySettings.interval ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setValue('displaySettings.interval', val === '' ? undefined as any : parseInt(val));
                }}
                placeholder="Enter time"
                inputSize="md"
                label=""
                required={false}
              />
              {errors?.displaySettings?.interval && (
                <ErrorText className="text-error!">{errors.displaySettings.interval.message}</ErrorText>
              )}
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.displaySettings.autoPlay}
                  onChange={(e) => setValue('displaySettings.autoPlay', e.target.checked)}
                  className="w-4 h-4 rounded border-input-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-base-content">Auto Play</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.displaySettings.showDots}
                  onChange={(e) => setValue('displaySettings.showDots', e.target.checked)}
                  className="w-4 h-4 rounded border-input-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-base-content">Show Dots</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.displaySettings.showArrows}
                  onChange={(e) => setValue('displaySettings.showArrows', e.target.checked)}
                  className="w-4 h-4 rounded border-input-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-base-content">Show Arrows</span>
              </label>
            </div>
          </>
        )}

        {/* Horizontal List - Show numberOfLines, spacing, itemWidth, autoPlay */}
        {(formData.displaySettings.displayType === 'HORIZONTAL_LIST' || formData.displaySettings.displayType === 'list') && (
          <>
            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Number of items in the row</Label>
              <Input
                type="number"
                value={formData.displaySettings.numberOfLines ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setValue('displaySettings.numberOfLines', val === '' ? undefined as any : parseInt(val));
                }}
                placeholder="Enter number"
                inputSize="md"
                label=""
                required={false}
              />
              {errors?.displaySettings?.numberOfLines && (
                <ErrorText className="text-error!">{errors.displaySettings.numberOfLines.message}</ErrorText>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-light" required={true}>Spacing (px)</Label>
                <Input
                  type="number"
                  value={formData.displaySettings.spacing ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setValue('displaySettings.spacing', val === '' ? undefined as any : parseInt(val));
                  }}
                  placeholder="Enter spacing"
                  rightElement={<Icon name="Space" className="w-4 h-4 text-base-content/50" />}
                  inputSize="md"
                  label=""
                  required={false}
                />
                {errors?.displaySettings?.spacing && (
                  <ErrorText className="text-error!">{errors.displaySettings.spacing.message}</ErrorText>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-light" required={true}>Item Width</Label>
                <Input
                  type="number"
                  value={formData.displaySettings.itemWidth ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setValue('displaySettings.itemWidth', val === '' ? undefined as any : parseInt(val));
                  }}
                  placeholder="Enter width"
                  rightElement={<Icon name="Maximize2" className="w-4 h-4 text-base-content/50" />}
                  inputSize="md"
                  label=""
                  required={false}
                />
                {errors?.displaySettings?.itemWidth && (
                  <ErrorText className="text-error!">{errors.displaySettings.itemWidth.message}</ErrorText>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.displaySettings.autoPlay}
                  onChange={(e) => setValue('displaySettings.autoPlay', e.target.checked)}
                  className="w-4 h-4 rounded border-input-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-base-content">Auto Play</span>
              </label>
            </div>
          </>
        )}

        {/* Grid - Show columnsMax, rowsMax, gridSpacing */}
        {(formData.displaySettings.displayType === 'GRID' || formData.displaySettings.displayType === 'grid') && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-light" required={true}>Max Columns (1-6)</Label>
                <Input
                  type="number"
                  value={formData.displaySettings.columnsMax ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setValue('displaySettings.columnsMax', val === '' ? undefined as any : parseInt(val));
                  }}
                  placeholder="Enter max columns"
                  rightElement={<Icon name="Columns" className="w-4 h-4 text-base-content/50" />}
                  inputSize="md"
                  label=""
                  required={false}
                />
                {errors?.displaySettings?.columnsMax && (
                  <ErrorText className="text-error!">{errors.displaySettings.columnsMax.message}</ErrorText>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-light" required={true}>Max Rows (1-10)</Label>
                <Input
                  type="number"
                  value={formData.displaySettings.rowsMax ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setValue('displaySettings.rowsMax', val === '' ? undefined as any : parseInt(val));
                  }}
                  placeholder="Enter max rows"
                  rightElement={<Icon name="Rows" className="w-4 h-4 text-base-content/50" />}
                  inputSize="md"
                  label=""
                  required={false}
                />
                {errors?.displaySettings?.rowsMax && (
                  <ErrorText className="text-error!">{errors.displaySettings.rowsMax.message}</ErrorText>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Grid Spacing (px)</Label>
              <Input
                type="number"
                value={formData.displaySettings.gridSpacing ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setValue('displaySettings.gridSpacing', val === '' ? undefined as any : parseInt(val));
                }}
                placeholder="Enter spacing"
                rightElement={<Icon name="Space" className="w-4 h-4 text-base-content/50" />}
                inputSize="md"
                label=""
                required={false}
              />
              {errors?.displaySettings?.gridSpacing && (
                <ErrorText className="text-error!">{errors.displaySettings.gridSpacing.message}</ErrorText>
              )}
            </div>
          </>
        )}
        </div>
      </div>

{/* Add Content Items Section */}
      <div className="rounded-lg bg-base-100 shadow-sm bg-white">
        <div className="p-4 border-b border-base-content/20 flex items-center justify-between">
          <h2 className="text-base font-semibold text-base-content">Content Items</h2>
          {formData.contentConfig?.selectedItems && formData.contentConfig.selectedItems.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size='sm'
              onClick={() => setIsAddItemModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" className="w-4 h-4" />
              Add Item
            </Button>
          )}
        </div>

        <div className="p-6">
          {formData.contentConfig?.selectedItems && formData.contentConfig.selectedItems.length > 0 ? (
            <>
              {/* Info text */}
              <p className="text-sm text-base-content/70 mb-4 leading-relaxed">
                Content items added to this section. These items will be displayed based on your display settings.
              </p>

              {/* Items list */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.contentConfig.selectedItems.map((item: { id: string }) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="h-40 overflow-y-auto space-y-3 pr-2">
                    {formData.contentConfig.selectedItems.map((item: { id: string; name: string }, index: number) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        index={index}
                        onDelete={() => {
                          const newItems = formData.contentConfig.selectedItems.filter((_: any, i: number) => i !== index);
                          setValue('contentConfig.selectedItems', newItems);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center border- border-input-border rounded-lg p-8 bg-base-200/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddItemModalOpen(true)}
                className="mb-3"
              >
                <Icon name="Plus" className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <p className="text-sm text-base-content/80 font-light text-center">
                No items added yet. Click "Add Item" above to get started
              </p>
            </div>
          )}
        </div>

        {/* Display validation errors */}
        <div className="px-6 pb-4 space-y-2">
          {errors?.contentConfig?.sourceType && (
            <ErrorText className="text-error!">{errors.contentConfig.sourceType.message}</ErrorText>
          )}
          {errors?.contentConfig?.selectedItems && (
            <ErrorText className="text-error!">
              {typeof errors.contentConfig.selectedItems === 'string'
                ? errors.contentConfig.selectedItems
                : errors.contentConfig.selectedItems.message || 'Please add items to this section'}
            </ErrorText>
          )}
          {errors?.contentConfig?.conditions && (
            <ErrorText className="text-error!">
              {Array.isArray(errors.contentConfig.conditions)
                ? errors.contentConfig.conditions.map((err: any, idx: number) => {
                    const msg = err?.field?.message || err?.operator?.message || err?.value?.message;
                    return msg ? `Condition ${idx + 1}: ${msg}` : null;
                  }).filter(Boolean).join(' | ')
                : errors.contentConfig.conditions.message || 'Invalid conditions format'}
            </ErrorText>
          )}
        </div>
      </div>
      {/* Add Content Item Modal */}
      <AddContentItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSave={handleAddContentItem}
        currentSourceType={formData.contentConfig?.sourceType}
        currentSelectedItems={formData.contentConfig?.selectedItems || []}
        currentConditions={formData.contentConfig?.conditions || []}
      />
    </>
  );
};

export default DisplaySettingsSection;