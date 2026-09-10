import { createFileRoute } from '@tanstack/react-router';
import WarehouseList from '@/features/warehouses/pages/warehouse-list';

export const Route = createFileRoute('/_app/warehouses/')({
  component: WarehouseList,
  staticData: {
    pageTitle: 'Warehouses',
  },
});
