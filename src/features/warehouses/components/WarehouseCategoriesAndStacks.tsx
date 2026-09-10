import React, { useState, useMemo } from 'react';
import  Chip  from '@/components/base/Chip';
import { Table } from '@/components/table/Table';
import { ColumnDef, FilterConfig } from '@/components/table/table.types';
import type { WarehouseCategory, Zone } from '../types/warehouse';

interface StackLocation {
  id: string;
  zone: string;
  aisle: string;
  bay: string;
  level: string;
  zoneId: string;
  aisleId: string;
  bayId: string;
  levelId: string;
}

interface WarehouseCategoriesAndStacksProps {
  categories?: WarehouseCategory[];
  zones?: Zone[];
  isLoading?: boolean;
  onEditCategories?: () => void;
  onEditStacks?: () => void;
}

const WarehouseCategoriesAndStacks: React.FC<WarehouseCategoriesAndStacksProps> = ({
  categories = [],
  zones = [],
  isLoading = false,
  onEditCategories,
  onEditStacks,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total stacks by dimension
  const stackStats = useMemo(() => {
    let totalZones = zones.length;
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

    return { totalZones, totalAisles, totalBays, totalLevels };
  }, [zones]);

  // Flatten all stack locations for the table
  const allStacks = useMemo(() => {
    const stacks: StackLocation[] = [];

    zones.forEach((zone) => {
      zone.aisles?.forEach((aisle) => {
        aisle.bays?.forEach((bay) => {
          bay.levels?.forEach((level) => {
            stacks.push({
              id: `${zone.id}-${aisle.id}-${bay.id}-${level.id}`,
              zone: zone.name,
              aisle: aisle.name,
              bay: bay.name,
              level: level.name,
              zoneId: zone.id,
              aisleId: aisle.id,
              bayId: bay.id,
              levelId: level.id,
            });
          });
        });
      });
    });

    return stacks;
  }, [zones]);

  // Define category chip colors
  const categoryColors: Array<"blue" | "purple" | "green" | "orange" | "pink" | "indigo" | "teal" | "yellow"> = [
    "blue",
    "purple",
    "green",
    "orange",
    "pink",
    "indigo",
    "teal",
    "yellow",
  ];

  // Define columns for the stacks table
  const columns: ColumnDef<StackLocation>[] = useMemo(() => [
    {
      key: "zone",
      header: "ZONE",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-body-content">{row.zone}</span>
      ),
    },
    {
      key: "aisle",
      header: "AISLE",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-body-content">{row.aisle}</span>
      ),
    },
    {
      key: "bay",
      header: "BAY",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-body-content">{row.bay}</span>
      ),
    },
    {
      key: "level",
      header: "LEVEL",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-body-content">{row.level}</span>
      ),
    },
  ], []);

  // Define filters for the stacks table


  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Categories Section Skeleton - 40% */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b border-body-content/20">
              <div className="shimmer h-6 w-32 rounded-lg" />
            </div>
            <div className="p-6 space-y-4">
              <div className="shimmer h-20 rounded-lg" />
            </div>
          </div>
          <div className="rounded-lg bg-white shadow-sm mt-6">
            <div className="p-4 border-b border-body-content/20">
              <div className="shimmer h-6 w-32 rounded-lg" />
            </div>
            <div className="p-6">
              <div className="shimmer h-32 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Detailed Stacks Section Skeleton - 60% */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b border-body-content/20">
              <div className="shimmer h-6 w-40 rounded-lg" />
            </div>
            <div className="p-6">
              <div className="shimmer h-64 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Column - 40% (Categories + Total Stacks) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Categories Section */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="p-4 border-b border-body-content/20 flex items-center justify-between">
            <h2 className="text-base font-semibold text-base-content">Categories</h2>
            {onEditCategories && (
              <button
                onClick={onEditCategories}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="p-6">
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => {
                  const chipColor = categoryColors[index % categoryColors.length];
                  return (
                    <Chip
                      key={category.id}
                      label={category.name}
                      color={chipColor}
                      className="rounded-sm px-2.5 py-1.5"
                      labelClassName="!font-normal"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-body-content mb-1">No categories assigned</p>
                <p className="text-xs text-body-content/60">
                  Add categories to organize your inventory
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Total Stacks Section */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="p-4 border-b border-body-content/20">
            <h2 className="text-base font-semibold text-base-content">Total stacks</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1">
                <div className="text-lg font-medium text-base-content">
                  {stackStats.totalZones}
                </div>
                <div className="text-sm text-body-content">Zone</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-medium text-base-content">
                  {stackStats.totalAisles}
                </div>
                <div className="text-sm text-body-content">Aisle</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-medium text-base-content">
                  {stackStats.totalBays}
                </div>
                <div className="text-sm text-body-content">Bay</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-medium text-base-content">
                  {stackStats.totalLevels}
                </div>
                <div className="text-sm text-body-content">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 60% (Detailed Stacks Table) */}
      <div className="lg:col-span-3">
        <Table<StackLocation>
          title="Detailed stacks"
          data={allStacks}
          columns={columns}
          containsAction={false}
          searchPlaceholder="Search stacks..."
          onSearch={handleSearch}
          rowKey="id"
          hoverable
          loading={isLoading}
          emptyMessage="No stack locations configured"
          emptyIcon="Package"
        />
      </div>
    </div>
  );
};

export default WarehouseCategoriesAndStacks;