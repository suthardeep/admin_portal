import React, { useState } from 'react';
import { Icon } from '@/components/base/Icon';
import { Button } from '@/components/base/Button';
import { Label } from '@/components/base/Label';
import DeleteDialog from '@/components/compound/DeleteDialog';

interface BannerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: {
    id: string;
    title: string;
    mediaUrl: string;
    active: boolean;
    startTime: string;
    endTime: string;
    note?: string;
    roundness: number;
    ratio: string;
    stateIds: string[];
  };
  onEdit: () => void;
  onDelete: () => void;
}

const BannerDetailsModal: React.FC<BannerDetailsModalProps> = ({
  isOpen,
  onClose,
  banner,
  onEdit,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      {/* Backdrop with scroll effect */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Side Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Modal Header - Sticky */}
        <div className="flex items-center justify-between p-3 border-b border-base-content/20 bg-white flex-shrink-0">
          <h2 className="text-lg font-semibold text-base-content">
            Banner Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-base-200 rounded-lg transition-colors duration-200"
          >
            <Icon name="X" className="w-5 h-5 text-base-content" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 bg-white">
          {/* Banner Image with Status Badge */}
          <div className="relative rounded-lg overflow-hidden mb-4 transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={banner.mediaUrl}
              alt={banner.title}
              className="w-full h-52 object-cover"
            />
            {/* Status Badge */}
            <div className="absolute bottom-2 right-2">
              <span
                className={`rounded px-2 py-1 text-xs font-medium relative ${
                  banner.active
                    ? 'bg-base-1 text-success'
                    : 'bg-base-1 text-error'
                }`}
              >
                <span className={`absolute inset-0 rounded ${banner.active ? 'bg-success/10' : 'bg-error/10'}`}></span>
                <span className="relative z-10">{banner.active ? 'Active' : 'Inactive'}</span>
              </span>
            </div>
          </div>

          {/* Banner Title */}
          <h3 className="text-lg font-semibold text-base-content mb-2">
            {banner.title}
          </h3>

          {/* Date Range */}
          <p className="text-sm text-body-content mb-4">
            {banner.startTime} - {banner.endTime}
          </p>

          {/* Note Section */}
          <div className="mb-4">
            <Label required={true}>Note</Label>
            <p className="text-sm text-base-content leading-relaxed">
              {banner.note || 'No note provided'}
            </p>
          </div>

          {/* Roundness and Ratio */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xl font-semibold text-base-content mb-1">
                {banner.roundness}
              </p>
              <Label required={true}>Roundness</Label>
            </div>
            <div className="border-l border-base-content/20 pl-4">
              <p className="text-xl font-semibold text-base-content mb-1">
                {banner.ratio}
              </p>
              <Label required={true}>Ratio</Label>
            </div>
          </div>

          {/* Targeted States */}
          <div className="mb-4">
            <h4 className="text-base font-semibold text-base-content mb-1">
              {banner.stateIds?.join(', ') || 'N/A'}
            </h4>
            <Label required={true}>Targeted States</Label>
          </div>
        </div>

        {/* Modal Footer - Sticky */}
        <div className="p-3 border-t border-base-content/20 bg-white flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="px-6 py-2 text-sm min-w-[80px]"
          >
            Delete
          </Button>
          <Button
            variant="filled"
            onClick={onEdit}
            className="px-6 py-2 text-sm min-w-[80px]"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        close={() => setShowDeleteDialog(false)}
        onDelete={handleDelete}
        title="Delete Banner"
        name={banner.title}
        isDeleting={false}
      />
    </>
  );
};

export default BannerDetailsModal;

// Example usage:
/*
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedBanner, setSelectedBanner] = useState(null);

const handleBannerClick = (banner) => {
  setSelectedBanner({
    ...banner,
    note: 'Lorem ipsum dolor sit amet consectetur. Eget vivamus quisque pellentesque egestas cursus tincidunt. Est fames augue quam mauris volutpat volutpat vestibulum. Potenti orci condimentum neque sagittis. Integer tortor augue nibh duis blandit tempor ac sodales.',
    roundness: 12,
    ratio: '16:9, 1:1',
    targetedStates: 'Gujarat, Goa, Delhi',
  });
  setIsModalOpen(true);
};

<BannerDetailsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  banner={selectedBanner}
  onEdit={() => {
    navigate({ to: `/banners/edit/${selectedBanner.id}` });
    setIsModalOpen(false);
  }}
  onDelete={() => {
    // Handle delete
    setIsModalOpen(false);
  }}
/>
*/