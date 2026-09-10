import Header, { VendorInfo } from '@/features/vendors/pages/details/components/Header';
import { createFileRoute } from '@tanstack/react-router'
import DocumentsGrid from '@/features/vendors/pages/details/components/DocumentMatrix';
import BrandsTable from '@/features/vendors/pages/details/components/BrandsTable';
import { useState } from 'react';
import DocumentModal from '@/components/base/DocumentModal';
import { Button } from '@/components/base/Button';

export const Route = createFileRoute('/_app/vendors/vendor-details/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    type: "pdf" | "image";
    url: string;
  } | null>(null);

  const vendorInfo: VendorInfo = {
    profileImageUrl: "/avatar.jpg",
    name: "Jeel Thumar",
    phone: "+91 98765 43210",
    email: "example@mail.com",
    website: "www.jeel.com",
    businessName: "Jeelu shop",
    category: ["Toys", "Baby Products"],
    brandName: "Geppiy",
    aavakCoinSpend: 3201,
    totalOrders: 8731,
    totalIncome: 53201,
  };

  const documents = [
    {
      id: "1",
      name: "PAN card",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
      uploaded: true,
    },
    {
      id: "2",
      name: "Aadhar card",
      type: "pdf" as const,
      url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
      uploaded: true,
    },
    {
      id: "3",
      name: "Business Registration",
      type: "pdf" as const,
      url: "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf",
      uploaded: true,
    },
    {
      id: "4",
      name: "Bank Statement",
      type: "pdf" as const,
      url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
      uploaded: true,
    },
    {
      id: "5",
      name: "Trademark Registration",
      type: "pdf" as const,
      url: "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf",
      uploaded: false,
    },
    {
      id: "6",
      name: "ID Proof",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
      uploaded: true,
    },
    {
      id: "7",
      name: "Address Proof",
      type: "pdf" as const,
      url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
      uploaded: true,
    },
  ];

  const brands = [
    {
      id: "1",
      brandName: "Geppiy",
      category: ["Toys", "Baby Products", "Games"],
      nature: "Wholesale",
      documents: [
        {
          id: "b1-1",
          name: "Brand License",
          type: "pdf" as const,
          url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
          uploaded: true,
        },
        {
          id: "b1-2",
          name: "Certificate",
          type: "image" as const,
          url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
          uploaded: true,
        },
        {
          id: "b1-3",
          name: "Agreement",
          type: "pdf" as const,
          url: "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf",
          uploaded: false,
        },
        {
          id: "b1-4",
          name: "Tax Certificate",
          type: "pdf" as const,
          url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
          uploaded: true,
        },
      ],
    },
    {
      id: "2",
      brandName: "BabyJoy",
      category: ["Baby Products", "Healthcare"],
      nature: "Retail",
      documents: [
        {
          id: "b2-1",
          name: "License",
          type: "pdf" as const,
          url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
          uploaded: true,
        },
        {
          id: "b2-2",
          name: "ISO Certificate",
          type: "image" as const,
          url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
          uploaded: true,
        },
      ],
    },
    {
      id: "3",
      brandName: "ToyMaster",
      category: ["Educational Toys", "Learning Materials"],
      nature: "Distributor",
      documents: [
        {
          id: "b3-1",
          name: "Trade License",
          type: "pdf" as const,
          url: "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf",
          uploaded: true,
        },
        {
          id: "b3-2",
          name: "Registration",
          type: "pdf" as const,
          url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
          uploaded: true,
        },
        {
          id: "b3-3",
          name: "Quality Certificate",
          type: "image" as const,
          url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800",
          uploaded: false,
        },
      ],
    },
  ];

  const handleAccept = () => {
    console.log("Vendor accepted");
    // Add your accept logic here
  };

  const handleReject = () => {
    console.log("Vendor rejected");
    // Add your reject logic here
  };

  return (
    <div className="space-y-6">
      <div className="bg-white">
        <Header
          title="Vendor Details"
          vendorInfo={vendorInfo}
        />

        <div className="px-6 pb-6">
          <DocumentsGrid
            documents={documents}
            onDocumentClick={(doc) => setSelectedDocument(doc)}
          />
        </div>
      </div>

      <BrandsTable
        brands={brands}
        onDocumentClick={(doc) => setSelectedDocument(doc)}
      />

      {/* Action Buttons */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            color="neutral"
            size="lg"
            onClick={handleReject}
            className="min-w-[140px]"
          >
            Reject
          </Button>
          <Button
            variant="filled"
            color="primary"
            size="lg"
            onClick={handleAccept}
            className="min-w-[140px]"
          >
            Accept
          </Button>
        </div>
      </div>

      <DocumentModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        document={selectedDocument}
      />
    </div>
  );
}