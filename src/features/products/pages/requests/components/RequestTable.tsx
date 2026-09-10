import { Table } from '@/components/table/Table';
import { ColumnDef } from '@/components/table/table.types';
import { ProductRequest } from '@/features/products/types/product';
import React from 'react'
import { productRequests } from '@/features/products/utils/dummyData';
const RequestTable = () => {


    const columns: ColumnDef<ProductRequest>[] = [
  {
    key: "sku",
    header: "SKU",
    sortable: true,
    cellClassName:"text-primary"
  },
  {
    key: "product",
    header: "PRODUCT",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.image} className="w-10 h-10 rounded-md" alt={row.name} />
        <div>
          <div className="font-light">{row.name}</div>
          <div className="text-xs text-body-content">{row.category}</div>
        </div>
      </div>
    ),
  },
  {
    key: "basePrice",
    header: "Base price",
    sortable: true,
  },
  {
    key: "requestDate",
    header: "Request Date",
    sortable: true,
  },
  {
    key: "vendor",
    header: "Vendor",
  },

];
  return (
    <div>

        <Table

        data={productRequests}
        columns={columns}
        searchable

        title='New Requests'

        rowActions={[
            {
                label:'View' ,
                icon:'Eye'
            } ,
            {
                label:'Accept' ,
                icon:'Right'
            } ,
            {
                label:'Reject'
            }

        ]}


        // pagination={}

        
        ></Table>
      
    </div>
  )
}

export default RequestTable
