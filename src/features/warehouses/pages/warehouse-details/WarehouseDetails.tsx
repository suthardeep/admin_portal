import React, { useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWarehouseByIdQuery } from '../../api/queryHooks';
import WarehouseHeader from '../../components/WarehouseHeader';
import { ROUTES } from '@/constants/routes';
import type { WarehouseStats } from '../../components/WarehouseHeader';
import WarehouseCategoriesAndStacks from '../../components/WarehouseCategoriesAndStacks';

const WarehouseDetails: React.FC = () => {
  const navigate = useNavigate();
  const { warehouseId } = useParams({ from: '/_app/warehouses/$warehouseId' });

  const { data: warehouseData, isLoading } = useGetWarehouseByIdQuery(warehouseId);

  // Calculate stats from zones data
  const stats: WarehouseStats = useMemo(() => {
    if (!warehouseData?.data?.zones) {
      return {
        totalZones: 0,
        totalAisles: 0,
        totalBays: 0,
        totalLevels: 0,
        totalLocations: 0,
      };
    }

    const zones = warehouseData.data.zones;
    const totalZones = zones.length;

    let totalAisles = 0;
    let totalBays = 0;
    let totalLevels = 0;

    zones.forEach((zone) => {
      totalAisles += zone.aisles?.length || 0;
      zone.aisles?.forEach((aisle) => {
        totalBays += aisle.bays?.length || 0;
        aisle.bays?.forEach((bay) => {
          totalLevels += bay.levels?.length || 0;
        });
      });
    });

    const totalLocations = totalZones + totalAisles + totalBays + totalLevels;

    return {
      totalZones,
      totalAisles,
      totalBays,
      totalLevels,
      totalLocations,
    };
  }, [warehouseData?.data?.zones]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white">
          <div className="px-6 py-5 border-b border-body-content/20">
            <div className="shimmer h-6 w-48 rounded-lg" />
          </div>
          <div className="px-6 py-6">
            <div className="flex items-stretch gap-6">
              <div className="flex-[4] flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="shimmer size-16 rounded-lg" />
                    <div className="space-y-2">
                      <div className="shimmer h-5 w-32 rounded-lg" />
                      <div className="shimmer h-4 w-48 rounded-lg" />
                    </div>
                  </div>
                  <div className="shimmer h-16 w-64 rounded-lg" />
                </div>
                <div className="shimmer h-20 rounded-md" />
              </div>
              <div className="flex-1 min-w-[260px]">
                <div className="shimmer h-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!warehouseData?.data) {
    return (
      <div className="fall min-h-[400px]">
        <p className="text-nl-500 dark:text-nd-400">Warehouse not found</p>
      </div>
    );
  }

  const warehouse = warehouseData.data;

 return (
    <div className="space-y-6">
      {/* Warehouse Header */}
      <WarehouseHeader
        title={warehouse.name}
        subtitle={warehouse.code ? `Code: ${warehouse.code}` : undefined}
        showBackButton
        onBackClick={() => navigate({ to: ROUTES.WAREHOUSE.LIST })}
        warehouseInfo={{
          ...warehouse,
          stats,
        }}
        sticky
      />

      {/* Categories and Stacks Section */}
      <WarehouseCategoriesAndStacks
        categories={warehouse.categories}
        zones={warehouse.zones}
        isLoading={isLoading}
        // onEditCategories={handleEditCategories}
        // onEditStacks={handleEditStacks}
      />
    </div>
  );
};

export default WarehouseDetails;
