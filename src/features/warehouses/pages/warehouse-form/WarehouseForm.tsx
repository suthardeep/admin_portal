import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import { MobileNumberInput } from '@/components/base/MobileNumberInput';
import Dropdown from '@/components/base/Dropdown';
import Chip from '@/components/base/Chip';
import ErrorText from '@/components/base/ErrorText';
import { createWarehouseSchema, editWarehouseSchema, type WarehouseFormData } from '../../schemas/warehouse.schema';
import { useGetAllCategoriesQuery } from '@/features/categories/api/queryHooks';
import { 
  useCreateWarehouseMutation, 
  useUpdateWarehouseMutation, 
  useGetWarehouseByIdQuery 
} from '../../api/queryHooks';
import type { CreateWarehousePayload } from '../../types/warehouse';
import { ROUTES } from '@/constants/routes';
import SizeDetailsMultiStep from '../../components/SizeDetailsMultipStep';
import { getCityStateFromPincode } from '@/api/external-api/getCityStateFromPincode';

interface WarehouseFormProps {
  mode: 'create' | 'edit';
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const params = mode === 'edit' ? useParams({ from: '/_app/warehouses/edit/$warehouseId' }) : null;
  const warehouseId = params?.warehouseId;

  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategoriesQuery({
    page: 1,
    pageSize: 100,
  });

  // Fetch warehouse details for edit mode
  const { data: warehouseDetails, isLoading: loadingWarehouse } = useGetWarehouseByIdQuery(
    warehouseId || ''
  );

  const createMutation = useCreateWarehouseMutation();
  const updateMutation = useUpdateWarehouseMutation();

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(mode === 'create' ? createWarehouseSchema : editWarehouseSchema),
    defaultValues: {
      name: '',
      managerName: '',
      managerEmail: '',
      managerMobile: '',
      managerPassword: '',
      numberOfDeliveryStaff: 0,
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
      categories: [],
      totalSqFt: 0,
      totalZones: 1,
      zones: [
        {
          name: 'Zone 1',
          aisles: [
            {
              name: 'Aisle A1',
              bays: [
                {
                  name: 'Bay A1-1',
                  levels: [
                    {
                      name: 'Level 1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    mode: 'onSubmit',
  });

  const { watch, setValue, formState: { errors }, handleSubmit, reset } = form;
  const warehouseData = watch();

  // Update form when warehouse details are loaded (edit mode)
  useEffect(() => {
    if (mode === 'edit' && warehouseDetails?.data) {
      const warehouse = warehouseDetails.data;
      
      // Convert API zones (with IDs) to form zones (without IDs)
      const formZones = warehouse.zones?.map(zone => ({
        name: zone.name,
        aisles: zone.aisles?.map(aisle => ({
          name: aisle.name,
          bays: aisle.bays?.map(bay => ({
            name: bay.name,
            levels: bay.levels?.map(level => ({
              name: level.name
            })) || []
          })) || []
        })) || []
      })) || [];

      reset({
        name: warehouse.name || '',
        managerName: warehouse.managerName || '',
        managerEmail: warehouse.managerEmail || '',
        managerMobile: warehouse.managerMobile || '',
        managerPassword: '', // Don't prefill password for security
        numberOfDeliveryStaff: warehouse.numberOfDeliveryStaff || 0,
        address: warehouse.address || {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
        },
        categories: warehouse.categories || [],
        totalSqFt: warehouse.totalSqFt || 0,
        totalZones: warehouse.totalZones || 1,
        zones: formZones,
      });
      
      // Set selected categories
      if (warehouse.categories) {
        setSelectedCategories(warehouse.categories.map(cat => cat.id));
      }
    }
  }, [warehouseDetails, mode, reset]);

  // Handle pincode blur to auto-fill city and state
  const handlePincodeBlur = async () => {
    const result = await getCityStateFromPincode(warehouseData.address.pincode);
    if (result?.city && result?.state) {
      setValue('address.city', result.city);
      setValue('address.state', result.state);
    }
  };

  // Prepare category options for dropdown
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categoriesData]);

  // Get selected category details for display
  const selectedCategoryDetails = useMemo(() => {
    if (!warehouseData.categories) return [];
    return warehouseData.categories;
  }, [warehouseData.categories]);

  // Handle category removal
  const handleRemoveCategory = (categoryId: string) => {
    const updated = selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(updated);
    
    // Update form with remaining category objects
    const updatedCategories = (warehouseData.categories || []).filter(cat => cat.id !== categoryId);
    setValue('categories', updatedCategories);
  };

  const onSubmit = async (data: WarehouseFormData) => {
    console.log('🚀 Form submission started');
    console.log('📋 Form data:', data);
    console.log('❌ Form errors:', errors);

    // Clean up optional fields
    const cleanedData = {
      ...data,
      address: {
        ...data.address,
        // Remove addressLine2 if it's empty
        ...(data.address.addressLine2 && data.address.addressLine2.trim() !== ''
          ? { addressLine2: data.address.addressLine2 }
          : {}),
      },
    };

    try {
      if (mode === 'create') {
        console.log('✨ Creating warehouse...');
        // Ensure password is provided for create mode
        if (!cleanedData.managerPassword) {
          console.error('Password is required for create mode');
          return;
        }
        await createMutation.mutateAsync(cleanedData as CreateWarehousePayload);
        navigate({ to: ROUTES.WAREHOUSE.LIST });
      } else if (mode === 'edit' && warehouseId) {
        console.log('✏️ Updating warehouse...');
        // Remove password from payload if it's empty in edit mode
        const updateData = { ...cleanedData };
        if (!updateData.managerPassword || updateData.managerPassword.trim() === '') {
          delete updateData.managerPassword;
        }
        await updateMutation.mutateAsync({
          warehouseId,
          data: updateData,
        });
        navigate({ to: ROUTES.WAREHOUSE.LIST });
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      // Error handling is done in the mutation hooks
    }
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.WAREHOUSE.LIST });
  };

  // Error handler for form validation
  const onError = (errors: any) => {
    console.log('❌ Form validation failed!');
    console.log('🐛 All errors:', errors);
    console.log('🐛 Error keys:', Object.keys(errors));

    // Log each error field
    Object.keys(errors).forEach(key => {
      console.log(`🔴 ${key}:`, errors[key]);
    });

    // Also log current form values for debugging
    console.log('📋 Current form values:', warehouseData);
  };

  if (mode === 'edit' && loadingWarehouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="shimmer h-10 w-32 rounded-lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full ">
      <div className="mx-auto space-y-6">

        {/* First Section - Basic Details */}
        <div className="rounded-lg bg-[#ffff] shadow-sm">
          <div className="p-4 border-b border-body-content/20">
            <h2 className="text-base font-semibold text-base-content">
              {mode === 'create' ? 'New Warehouse' : 'Edit Warehouse'}
            </h2>
          </div>
          <div className="p-5">
            {/* Grid for inputs - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
              {/* Warehouse Name */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Warehouse Name
                </Label>
                <Input
                  type="text"
                  value={warehouseData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('name', e.target.value)
                  }
                  placeholder="Enter warehouse name"
                  className={`h-[36px] w-full ${errors.name ? 'border-error' : ''}`}
                />
                {errors.name && (
                  <ErrorText className="mt-1 !text-error">{errors.name.message}</ErrorText>
                )}
              </div>

              {/* Number of Delivery Staff */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Number of Delivery Staff
                </Label>
                <Input
                  type="number"
                  value={warehouseData.numberOfDeliveryStaff === 0 ? '' : warehouseData.numberOfDeliveryStaff}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('numberOfDeliveryStaff', e.target.value === '' ? 0 : parseInt(e.target.value))
                  }
                  placeholder="Enter number of delivery staff"
                  className={`h-[36px] w-full ${errors.numberOfDeliveryStaff ? 'border-red-500' : ''}`}
                />
                {errors.numberOfDeliveryStaff && (
                  <ErrorText className="mt-1 !text-error">{errors.numberOfDeliveryStaff.message}</ErrorText>
                )}
              </div>

              {/* Manager Name */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Manager Name
                </Label>
                <Input
                  type="text"
                  value={warehouseData.managerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('managerName', e.target.value)
                  }
                  placeholder="Enter manager name"
                  className={`h-[36px] w-full ${errors.managerName ? 'border-red-500' : ''}`}
                />
                {errors.managerName && (
                  <ErrorText className="mt-1 !text-error">{errors.managerName.message}</ErrorText>
                )}
              </div>

              {/* Email ID */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Manager Email
                </Label>
                <Input
                  type="email"
                  value={warehouseData.managerEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('managerEmail', e.target.value)
                  }
                  placeholder="Enter manager email address"
                  className={`h-[36px] w-full ${errors.managerEmail ? 'border-red-500' : ''}`}
                />
                {errors.managerEmail && (
                  <ErrorText className="mt-1 !text-error">{errors.managerEmail.message}</ErrorText>
                )}
              </div>

              {/* Manager Password */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={mode === 'create'}>
                  Manager Password {mode === 'edit' && <span className="text-xs text-body-content/60">(leave blank to keep current)</span>}
                </Label>
                <Input
                  type="password"
                  value={warehouseData.managerPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('managerPassword', e.target.value)
                  }
                  placeholder={mode === 'create' ? "Enter manager password" : "Enter new password (optional)"}
                  className={`h-[36px] w-full ${errors.managerPassword ? 'border-red-500' : ''}`}
                />
                {errors.managerPassword && (
                  <ErrorText className="mt-1 !text-error">{errors.managerPassword.message}</ErrorText>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Address Line 1
                </Label>
                <Input
                  type="text"
                  value={warehouseData.address.addressLine1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('address.addressLine1', e.target.value)
                  }
                  placeholder="Enter address line 1"
                  className={`h-[36px] w-full ${errors.address?.addressLine1 ? 'border-red-500' : ''}`}
                />
                {errors.address?.addressLine1 && (
                  <ErrorText className="mt-1 !text-error">{errors.address.addressLine1.message}</ErrorText>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <Label className="text-base font-light">
                  Address Line 2
                </Label>
                <Input
                  type="text"
                  value={warehouseData.address.addressLine2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('address.addressLine2', e.target.value)
                  }
                  placeholder="Enter address line 2"
                  className={`h-[36px] w-full ${errors.address?.addressLine2 ? 'border-red-500' : ''}`}
                />
                {errors.address?.addressLine2 && (
                  <ErrorText className="mt-1 !text-error">{errors.address.addressLine2.message}</ErrorText>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  Pincode
                </Label>
                <Input
                  type="text"
                  value={warehouseData.address.pincode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('address.pincode', e.target.value)
                  }
                  onBlur={handlePincodeBlur}
                  placeholder="Enter pincode"
                  maxLength={6}
                  className={`h-[36px] w-full ${errors.address?.pincode ? 'border-red-500' : ''}`}
                />
                {errors.address?.pincode && (
                  <ErrorText className="mt-1 !text-error">{errors.address.pincode.message}</ErrorText>
                )}
              </div>

              {/* City */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  City
                </Label>
                <Input
                  type="text"
                  value={warehouseData.address.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('address.city', e.target.value)
                  }
                  placeholder="Enter city"
                  className={`h-[36px] w-full ${errors.address?.city ? 'border-red-500' : ''}`}
                />
                {errors.address?.city && (
                  <ErrorText className="mt-1 !text-error">{errors.address.city.message}</ErrorText>
                )}
              </div>

              {/* State */}
              <div className="space-y-1">
                <Label className="text-base font-light" required={true}>
                  State
                </Label>
                <Input
                  type="text"
                  value={warehouseData.address.state}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('address.state', e.target.value)
                  }
                  placeholder="Enter state"
                  className={`h-[36px] w-full ${errors.address?.state ? 'border-red-500' : ''}`}
                />
                {errors.address?.state && (
                  <ErrorText className="mt-1 !text-error">{errors.address.state.message}</ErrorText>
                )}
              </div>

              {/* Mobile No */}
              <div>
                <MobileNumberInput
                  label="Manager Mobile"
                  value={warehouseData.managerMobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue('managerMobile', e.target.value)
                  }
                  placeholder="Enter manager mobile number"
                  maxLength={13}
                  required={true}
                  error={errors.managerMobile?.message}
                  isVerified={false}
                  showStatus={false}
                  labelClassName="text-base font-light"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Two Sections with CUSTOM WIDTHS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Section - Size Details (Takes 60% = 3 columns) */}
          <div className="lg:col-span-3">
            <SizeDetailsMultiStep 
              initialData={mode === 'edit' && warehouseDetails?.data ? {
                totalSqFt: warehouseDetails.data.totalSqFt,
                totalZones: warehouseDetails.data.totalZones,
                zones: warehouseDetails.data.zones
              } : undefined}
              onComplete={(data) => {
             
                // Update form with size details
                setValue('totalSqFt', parseFloat(data.size) || 0);
                setValue('totalZones', parseInt(data.totalZone) || 1);
                
                // Convert the component's data structure to match our schema
                const formattedZones = data.zones.map(zone => {
                  const zoneAisles = data.aisles.filter(aisle => aisle.zoneId === zone.id);
                  return {
                    name: zone.name,
                    aisles: zoneAisles.length > 0 ? zoneAisles.map(aisle => {
                      const aisleBays = data.bays.filter(bay => bay.aisleId === aisle.id);
                      return {
                        name: aisle.name,
                        bays: aisleBays.length > 0 ? aisleBays.map(bay => {
                          const bayLevels = data.levels.filter(level => level.bayId === bay.id);
                          return {
                            name: bay.name,
                            levels: bayLevels.length > 0 ? bayLevels.map(level => ({
                              name: level.name
                            })) : [{ name: 'Level 1' }] // Default level if none exist
                          };
                        }) : [{ // Default bay if none exist
                          name: 'Bay 1',
                          levels: [{ name: 'Level 1' }]
                        }]
                      };
                    }) : [{ // Default aisle if none exist
                      name: 'Aisle 1',
                      bays: [{
                        name: 'Bay 1',
                        levels: [{ name: 'Level 1' }]
                      }]
                    }]
                  };
                });
                
                console.log('📐 Formatted zones for form:', formattedZones);
                setValue('zones', formattedZones);
              }}
            />
          </div>

          {/* Section - Add Categories (Takes 40% = 2 columns) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm h-full">
              <div className="p-4 border-b border-body-content/20">
                <h2 className="text-base font-semibold text-base-content">Add Categories</h2>
              </div>
              <div className="p-6">
                {/* Categories Dropdown */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-light" required={true}>Categories</Label>
                    {loadingCategories ? (
                      <div className="shimmer h-9 w-full rounded-lg" />
                    ) : (
                      <Dropdown
                        placeholder="Select categories"
                        options={categoryOptions}
                        value={selectedCategories}
                        onChange={(values) => {
                          if (Array.isArray(values)) {
                            setSelectedCategories(values);
                            // Update form with category objects
                            const newCategories = values.map(id => {
                              const category = categoriesData?.data?.find(cat => cat.id === id);
                              return category ? { id: category.id, name: category.name } : null;
                            }).filter((category): category is { id: string; name: string } => category !== null);
                            setValue('categories', newCategories);
                          }
                        }}
                        multiple={true}
                        searchable={true}
                        searchPlaceholder="Search categories..."
                        noOptionsText="No categories found"
                        className="w-full"
                      />
                    )}
                  </div>

                  {/* Selected Categories Display */}
                  {selectedCategoryDetails.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedCategoryDetails.map((category: any, index: number) => {
                          const colors: Array<"blue" | "purple" | "green" | "orange" | "pink" | "indigo" | "teal" | "yellow"> =
                            ["blue", "purple", "green", "orange", "pink", "indigo", "teal", "yellow"];
                          const chipColor = colors[index % colors.length];

                          return (
                            <Chip
                              key={category.id}
                              label={category.name}
                              color={chipColor}
                              isCollapsible={true}
                              onCollapse={() => handleRemoveCategory(category.id)}
                              closeIcon="CircleX"
                              className="rounded-sm px-2.5 py-1.5"
                              labelClassName="!font-normal"
                              iconClassName="ml-2 text-base-content"
                              iconStrokeWidth={2.5}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            color="primary"
            disabled={createMutation.isPending || updateMutation.isPending}
            onClick={() => {
              console.log('🔘 Submit button clicked');
              console.log('📋 Current form values:', warehouseData);
              console.log('❌ Current form errors:', errors);
            }}
          >
            {createMutation.isPending || updateMutation.isPending 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Warehouse' : 'Update Warehouse')
            }
          </Button>
        </div>

      </div>
    </form>
  );
};

export default WarehouseForm;