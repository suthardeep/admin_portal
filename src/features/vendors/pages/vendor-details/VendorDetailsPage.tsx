import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetVendorDetailsQuery, useApproveVendorMutation, useRejectVendorMutation } from '../../api/queryHooks';
import Header, { VendorInfo } from '../details/components/Header';
import DocumentsGrid from '../details/components/DocumentMatrix';
import BrandsTable from '../details/components/BrandsTable';
import DocumentModal from '@/components/base/DocumentModal';
import RejectionModal from '../../components/RejectionModal';
import AddPenaltyModal from '../../components/AddPenaltyModal';
import AcceptVendorDialog from '../../components/AcceptVendorDialog';
import { Button } from '@/components/base/Button';
import { toast } from '@/components/compound/Sonner';

const VendorDetailsPage: React.FC = () => {
  const { vendorId } = useParams({ from: '/_app/vendors/$vendorId' });
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    type: "pdf" | "image";
    url: string;
  } | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  // Fetch vendor details
  const { data: vendor, isLoading, isError } = useGetVendorDetailsQuery(vendorId);

  // Mutations
  const approveVendorMutation = useApproveVendorMutation();
  const rejectVendorMutation = useRejectVendorMutation();

  const handleAccept = () => {
    approveVendorMutation.mutate(vendorId, {
      onSuccess: () => {
        toast.success('Vendor approved successfully');
        setIsAcceptDialogOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to approve vendor');
        console.error('Approval error:', error);
      },
    });
  };

  const handleRejectionSubmit = (data: { title: string; description: string }) => {
    rejectVendorMutation.mutate(
      {
        vendorId,
        data: {
          rejectionTitle: data.title,
          rejectionDescription: data.description,
        },
      },
      {
        onSuccess: () => {
          toast.success('Vendor rejected successfully');
          setIsRejectionModalOpen(false);
        },
        onError: (error) => {
          toast.error('Failed to reject vendor');
          console.error('Rejection error:', error);
        },
      }
    );
  };

  const handlePenaltySubmit = (data: { amount: number; reason: string }) => {
    // TODO: Implement penalty API when available
    console.log('Penalty data:', data);
    toast.success(`Penalty of ₹${data.amount} added successfully`);
    setIsPenaltyModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-body-content/20 border-t-base-content rounded-full animate-spin" />
          <p className="text-sm text-body-content">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-error">Failed to load vendor details</p>
          <p className="text-sm text-body-content mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // Transform API data to component format
  const vendorInfo: VendorInfo = {
    profileImageUrl: "", // Will show initials when empty
    name: vendor.fullName,
    phone: vendor.phone,
    email: vendor.email,
    website: vendor.brands[0]?.website || "", // Get from first brand
    businessName: vendor.businessDetails.name,
    category: vendor.brands[0]?.selectedCategories?.map(cat => cat.name) || [], // Get all category names from first brand
    brandName: vendor.brands[0]?.brandName || "",
    aavakCoinSpend: 0, // Not in current API response
    totalOrders: 0, // Not in current API response
    totalIncome: 0, // Not in current API response
    verificationStatus: vendor.verificationStatus,
  };

  // Transform documents from various sources
  const documents = [
    vendor.gstCertificate && {
      id: crypto.randomUUID(),
      name: "GST Certificate",
      type: "pdf" as const,
      url: vendor.gstCertificate,
      uploaded: true,
    },
    vendor.businessDetails.panCard && {
      id: crypto.randomUUID(),
      name: "Business PAN Card",
      type: "pdf" as const,
      url: vendor.businessDetails.panCard,
      uploaded: true,
    },
    vendor.businessDetails.registrationCertificate && {
      id: crypto.randomUUID(),
      name: "Registration Certificate",
      type: "pdf" as const,
      url: vendor.businessDetails.registrationCertificate,
      uploaded: true,
    },
    vendor.authorisedPersonDetails.panCard && {
      id: crypto.randomUUID(),
      name: "Authorised Person PAN",
      type: "pdf" as const,
      url: vendor.authorisedPersonDetails.panCard,
      uploaded: true,
    },
    vendor.authorisedPersonDetails.aadharCard && {
      id: crypto.randomUUID(),
      name: "Authorised Person Aadhar",
      type: "pdf" as const,
      url: vendor.authorisedPersonDetails.aadharCard,
      uploaded: true,
    },
    vendor.bankDetails.bankProof && {
      id: crypto.randomUUID(),
      name: "Bank Proof",
      type: "pdf" as const,
      url: vendor.bankDetails.bankProof,
      uploaded: true,
    },
  ].filter(Boolean) as { id: string; name: string; type: "pdf" | "image"; url: string; uploaded: boolean }[];

  // Transform brands
  const brands = vendor.brands.map((brand, index) => ({
    id: `brand-${index}`,
    brandName: brand.brandName,
    category: brand.selectedCategories.map(cat => cat.name), // Use category names from selectedCategories
    nature: brand.natureOfBusiness,
    documents: [
      brand.brandLogo && {
        id: crypto.randomUUID(),
        name: "Brand Logo",
        type: brand.brandLogo.endsWith('.pdf') ? "pdf" as const : "image" as const,
        url: brand.brandLogo,
        uploaded: true,
      },
      // Flatten all brand documents from all groups
      ...brand.brandDocuments.flatMap(group =>
        group.documents.map(doc => ({
          id: crypto.randomUUID(),
          name: `${group.groupName} - ${doc.name}`,
          type: doc.url.endsWith('.pdf') ? "pdf" as const : "image" as const,
          url: doc.url,
          uploaded: true,
        }))
      ),
    ].filter(Boolean) as { id: string; name: string; type: "pdf" | "image"; url: string; uploaded: boolean }[],
  }));

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
      {vendor.verificationStatus === 'under_review' && (
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              color="neutral"
              size="lg"
              onClick={() => setIsPenaltyModalOpen(true)}
              className="min-w-[140px]"
            >
              Add Penalty
            </Button>
            <Button
              variant="outline"
              color="neutral"
              size="lg"
              onClick={() => setIsRejectionModalOpen(true)}
              className="min-w-[140px]"
              disabled={rejectVendorMutation.isPending}
            >
              Reject
            </Button>
            <Button
              variant="filled"
              color="primary"
              size="lg"
              onClick={() => setIsAcceptDialogOpen(true)}
              className="min-w-[140px]"
            >
              Accept
            </Button>
          </div>
        </div>
      )}

      <DocumentModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        document={selectedDocument}
      />

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onSubmit={handleRejectionSubmit}
        isSubmitting={rejectVendorMutation.isPending}
      />

      <AddPenaltyModal
        isOpen={isPenaltyModalOpen}
        onClose={() => setIsPenaltyModalOpen(false)}
        onSubmit={handlePenaltySubmit}
        vendorInfo={{
          profileImageUrl: vendorInfo.profileImageUrl,
          name: vendorInfo.name,
          phone: vendorInfo.phone || '',
        }}
      />

      <AcceptVendorDialog
        isOpen={isAcceptDialogOpen}
        close={() => setIsAcceptDialogOpen(false)}
        onAccept={handleAccept}
        isAccepting={approveVendorMutation.isPending}
        vendorName={vendorInfo.name}
      />
    </div>
  );
};

export default VendorDetailsPage;
