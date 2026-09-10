import React, { useMemo, useState } from "react";
import { Table } from "@/components/table/Table";
import { ColumnDef } from "@/components/table/table.types";
import BrandDocumentsModal from "./BrandDocumentsModal";
import { toProperCase } from "@/utils/stringHelpers";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploaded?: boolean;
}

interface Brand {
  id: string;
  brandName: string;
  category: string | string[];
  nature: string;
  documents: Document[];
}

interface BrandsTableProps {
  brands: Brand[];
  onDocumentClick: (document: Document) => void;
  className?: string;
}

const BrandsTable: React.FC<BrandsTableProps> = ({
  brands,
  onDocumentClick,
  className,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const columns: ColumnDef<Brand>[] = useMemo(
    () => [
      {
        key: "brandName",
        header: "BRAND NAME",
        cellType: "text",
        cellClassName: "align-top",
        render: (row) => (
          <span className="text-sm font-normal text-base-content ">
            {row.brandName}
          </span>
        ),
      },
      {
        key: "category",
        header: "CATEGORY",
        cellType: "text",
        cellClassName: "align-top",
        render: (row) => (
          <span className="text-sm font-normal  text-base-content ">
            {Array.isArray(row.category) ? row.category.join(", ") : row.category}
          </span>
        ),
      },
      {
        key: "nature",
        header: "NATURE",
        cellType: "text",
        cellClassName: "align-top",
        render: (row) => (
          <span className="text-sm font-normal text-base-content">
            {toProperCase(row.nature)}
          </span>
        ),
      },
      {
        key: "documents",
        header: "DOCUMENTS",
        cellType: "text",
        align: "center",
        render: (row) => (
          <span className="text-sm font-normal text-base-content">
            {row.documents.length}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className={className}>
        <Table<Brand>
          title="Brands"
          data={brands}
          columns={columns}
          rowKey="id"
          hoverable
          rowActions={[
            {
              label: "View Documents",
              icon: "Eye",
              onClick: (row) => setSelectedBrand(row),
            },
          ]}
        />
      </div>

      <BrandDocumentsModal
        isOpen={!!selectedBrand}
        onClose={() => setSelectedBrand(null)}
        brandName={selectedBrand?.brandName || ""}
        documents={selectedBrand?.documents || []}
        onDocumentClick={onDocumentClick}
      />
    </>
  );
};

export default BrandsTable;
