import React, { useState } from "react";
import { Table } from "@/components/table/Table";
import { ColumnDef, FilterConfig } from "@/components/table/table.types";
import { PaginationMeta } from "@/types/baseApi";

interface LogEntry {
  id: string;
  title: string;
  module: string;
  when: string;
}

interface LogsTableProps {
  data?: LogEntry[];
  title?: string;
}

const LogsTable: React.FC<LogsTableProps> = ({ 
  data = [],
  title = "Logs"
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // You can make this configurable if needed

  const columns: ColumnDef<LogEntry>[] = [
    {
      key: "title",
      header: "TITLE",
      cellType: "text",
    },
    {
      key: "module",
      header: "MODULE",
      cellType: "text",
    },
    {
      key: "when",
      header: "WHEN",
      cellType: "text",
      sortable: true,
    },
  ];

  const filters: FilterConfig[] = [];

  // Calculate pagination metadata
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const paginationMeta: PaginationMeta = {
    currentPage,
    pageSize,
    totalRows,
    totalPages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    currentRows: paginatedData.length,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (

    <div className="max-h-[700px] overflow-y-auto">
    <Table<LogEntry>
      title={title}
      data={paginatedData}
      columns={columns}
      rowKey="id"
      searchable
      filters={filters}
      
      selectedRows={selectedRows}
      onSelectionChange={(set) =>
        setSelectedRows(new Set(set as Set<string>))
      }
      hoverable
      rowActions={[
        {
          label: "View Details",
          icon: "Eye",
          onClick: (row) => console.log("View log:", row),
        },
      ]}

      pagination={{
        meta: paginationMeta,
        onPageChange: handlePageChange,
        showTotal: true,
      }}
    />

  </div>
  );
};

export default LogsTable;