import { createFileRoute } from '@tanstack/react-router';
import WarehouseDetails from '@/features/warehouses/pages/warehouse-details/WarehouseDetails';

export const Route = createFileRoute('/_app/warehouses/$warehouseId')({
  component: RouteComponent,
  staticData: {
    pageTitle: 'Warehouse Details',
  },
});

function RouteComponent() {
  return <WarehouseDetails />;
}
