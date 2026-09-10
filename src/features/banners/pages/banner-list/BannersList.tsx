import React, { useState } from 'react';
import { Icon } from '@/components/base/Icon';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { TablePagination } from '@/components/table/TablePagination';
import BannerDetailsModal from '../../components/BannerDetailsModal';
import { useGetBannersQuery, useDeleteBannerMutation } from '../../api/queryHooks';
import type { Banner } from '../../types/banner';
import { prettyDate } from '@/utils/formatDateTime';
import  useDebounce  from '@/hooks/useDebounce';
import { ROUTES } from '@/constants/routes';

const BannersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const pageSize = 6;

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch banners from API
  const { data: bannersData, isLoading } = useGetBannersQuery({
    page: currentPage,
    pageSize,
    search: debouncedSearch,
  });

  // Delete mutation
  const deleteMutation = useDeleteBannerMutation();

  const banners = bannersData?.data || [];
  const paginationMeta = bannersData?.meta || {
    currentPage: 1,
    pageSize: 6,
    totalRows: 0,
    totalPages: 1,
    currentRows: 0,
    hasPrevPage: false,
    hasNextPage: false,
  };

  const handleCreateBanner = () => {
    navigate({ to: ROUTES.CMS.BANNERS.CREATE });
  };

  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleEditBanner = (bannerId: string) => {
    setIsModalOpen(false);
    navigate({ to: ROUTES.CMS.BANNERS.EDIT(bannerId) });
  };

  const handleDeleteBanner = async () => {
    if (selectedBanner) {
      await deleteMutation.mutateAsync(selectedBanner.id);
      setIsModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col h-full mx-auto max-w-7xl w-full">
        {/* Header Section - Fixed */}
        <div className="bg-base-1 border-b border-base-content/20  flex-shrink-0">
          <div className="p-3 flex items-center justify-between">
            <p className="text-xl font-semibold text-base-content">Banners</p>

            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative w-64">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Select..."
                  inputSize="sm"
                  leftElement={
                    <Icon name="Search" className="w-4 h-4 text-body-content" />
                  }
                  label=""
                  required={false}
                  className="w-full"
                />
              </div>

              {/* Create Banner Button */}
              <Button
                variant="filled"
                onClick={handleCreateBanner}
                className="flex items-center gap-2 h-9"
              >
                <Icon name="Plus" className="w-4 h-4 text-white" />
                Create Banner
              </Button>
            </div>
          </div>
        </div>

        {/* Banner Cards Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-base-2 p-2">
                    <div className="shimmer aspect-[16/9] rounded-md mb-2" />
                    <div className="shimmer h-4 w-3/4 rounded mb-2" />
                    <div className="shimmer h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      onClick={() => handleBannerClick(banner)}
                      className="group relative overflow-hidden rounded-lg bg-base-2 p-2 cursor-pointer"
                    >
                      {/* Banner Image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-base-3 rounded-md">
                        <img
                          src={banner.mediaUrl}
                          alt={banner.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

                        {/* Status Badge - Bottom Right of Image */}
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

                        {/* Edit Icon - appears on hover - top right */}
                        <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="rounded-full bg-primary p-1.5 shadow-lg">
                            <Icon name="Edit" className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Banner Info */}
                      <div className="p-2">
                        <h3 className="mb-1.5 text-sm font-semibold text-base-content line-clamp-1">
                          {banner.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-body-content">
                          <Icon name="Clock" className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">
                            {prettyDate(new Date(banner.startTime).getTime(), { showTime: false })} to {prettyDate(new Date(banner.endTime).getTime(), { showTime: false })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {banners.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="rounded-full bg-base-300 p-6 mb-4">
                      <Icon name="ImageOff" className="w-12 h-12 text-disabled-content" />
                    </div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">
                      No banners found
                    </h3>
                    <p className="text-body-content mb-6">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'Get started by creating your first banner'}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="filled"
                        onClick={handleCreateBanner}
                        className="flex items-center gap-2"
                      >
                        <Icon name="Plus" className="w-5 h-5" />
                        Create Banner
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pagination - Fixed at Bottom */}
        <div className="border-t border-base-content/20 bg-base-1 flex-shrink-0">
          <TablePagination
            meta={paginationMeta}
            onPageChange={handlePageChange}
            showTotal={true}
            sticky={false}
          />
        </div>
      </div>

      {/* Banner Details Modal */}
      {selectedBanner && (
        <BannerDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          banner={selectedBanner}
          onEdit={() => handleEditBanner(selectedBanner.id)}
          onDelete={handleDeleteBanner}
        />
      )}
    </div>
  );
};

export default BannersPage;