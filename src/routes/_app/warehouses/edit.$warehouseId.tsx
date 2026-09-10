import { createFileRoute } from '@tanstack/react-router';
import WarehouseForm from '@/features/warehouses/pages/warehouse-form/WarehouseForm';

export const Route = createFileRoute('/_app/warehouses/edit/$warehouseId')({
  component: RouteComponent,
  staticData: {
    pageTitle: 'Edit Warehouse',
  },
});

function RouteComponent() {
  return <WarehouseForm mode="edit" />;
}