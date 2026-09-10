import React from 'react';
import { UseFormSetValue, FieldErrors, Control } from 'react-hook-form';
import { Button } from '@/components/base/Button';
import { Icon } from '@/components/base/Icon';
import { ErrorText } from '@/components/base/ErrorText';
import AddSectionModal from './AddSectionModal';
import { HomeScreenFormData } from '../schemas/home.schema';
import { useGetSectionsQuery } from '@/features/cms/api/queryHooks';
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
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/constants/routes';

interface SortableSectionItemProps {
  sectionId: string;
  title: string;
  index: number;
  onDelete: () => void;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({ sectionId, title, index, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

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
      <span className="flex-1 text-sm text-base-content">{title}</span>
      <button
        type="button"
        onClick={onDelete}
        className="text-base-content/40 hover:text-error transition-colors"
      >
        <Icon name="Trash2" className="w-5 h-5" />
      </button>
    </div>
  );
};

interface ContentSectionProps {
  formData: HomeScreenFormData;
  setValue: UseFormSetValue<HomeScreenFormData>;
  errors: FieldErrors<HomeScreenFormData>;
  control: Control<HomeScreenFormData>;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  setValue,
  errors,
  control,
}) => {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = React.useState(false);

  // Fetch sections to display titles
  const { data: sectionsResponse } = useGetSectionsQuery({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to get section title by ID
  const getSectionTitle = React.useCallback((sectionId: string) => {
    const sections = (sectionsResponse as any)?.data || [];
    const section = sections.find((s: any) => s.id === sectionId);
    return section?.title || sectionId;
  }, [sectionsResponse]);

  const handleAddSections = (data: { selectedSections: string[]; sectionNames: string[] }) => {
    const updatedSections = [...(formData.sections || []), ...data.selectedSections];
    setValue('sections', updatedSections);
    setIsAddSectionModalOpen(false);
  };

  const handleDeleteSection = (index: number) => {
    const updatedSections = formData.sections.filter((_: any, i: number) => i !== index);
    setValue('sections', updatedSections);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sections = formData.sections || [];
      const oldIndex = sections.findIndex((sectionId: string) => sectionId === active.id);
      const newIndex = sections.findIndex((sectionId: string) => sectionId === over.id);

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);
      setValue('sections', reorderedSections);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-base-100 shadow-sm bg-white">
        <div className="p-4 border-b border-base-content/20 flex items-center justify-between">
          <h2 className="text-base font-semibold text-base-content">Content Section</h2>
          {formData.sections && formData.sections.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddSectionModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" className="w-4 h-4" />
              Add Section
            </Button>
          )}
        </div>

        <div className="p-6">
          {formData.sections && formData.sections.length > 0 ? (
            <>
              {/* Info text */}
         <p className="text-sm text-base-content/70 mb-4 leading-relaxed">
  You can add and organise sections to show on your home screen. Just head over to the{" "}
  <Link
    to={ROUTES.CMS.SECTIONS.LIST}
    className="text-primary   hover:text-primary/80"
  >
    Sections page
  </Link>{" "}
  to manage them!
</p>

              {/* Sections list with drag and drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.sections}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="h-40 overflow-y-auto space-y-3 pr-2">
                    {formData.sections.map((sectionId: string, index: number) => (
                      <SortableSectionItem
                        key={sectionId}
                        sectionId={sectionId}
                        title={getSectionTitle(sectionId)}
                        index={index}
                        onDelete={() => handleDeleteSection(index)}
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
                onClick={() => setIsAddSectionModalOpen(true)}
                className="mb-3"
              >
                <Icon name="Plus" className="w-4 h-4 mr-2" />
                Add Section
              </Button>
              <p className="text-sm text-base-content/80 font-light text-center">
                No sections added yet. Click "Add Section" above to get started
              </p>
            </div>
          )}
          
          {errors.sections && (
            <ErrorText className="text-red-500 text-xs mt-2">
              {errors.sections.message}
            </ErrorText>
          )}
        </div>
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onSave={handleAddSections}
        excludedSectionIds={formData.sections || []}
      />
    </>
  );
};

export default ContentSection;
