import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Download, Printer, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { downloadProposalPDF, printProposal } from "@/lib/pdfUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Proposals() {
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data: proposals, isLoading, refetch } = trpc.proposals.list.useQuery();
  const deleteProposalMutation = trpc.proposals.delete.useMutation({
    onSuccess: () => {
      toast.success("Proposal deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete proposal");
    },
  });
  const duplicateProposalMutation = trpc.proposals.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Proposal duplicated successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to duplicate proposal");
    },
  });

  const handleDelete = (id: number) => {
    deleteProposalMutation.mutate({ id });
  };

  const handleDuplicate = (id: number) => {
    duplicateProposalMutation.mutate({ id });
  };

  const handleDownloadPDF = async (proposal: any) => {
    try {
      await downloadProposalPDF({
        id: proposal.id,
        clientName: proposal.clientName || "Client",
        clientEmail: proposal.clientEmail,
        clientPhone: proposal.clientPhone,
        projectAddress: proposal.projectAddress,
        projectType: proposal.projectType,
        area: parseFloat(proposal.area as string) || 0,
        budget: parseFloat(proposal.budget as string) || 0,
        estimatedTimeline: proposal.estimatedTimeline || "",
        selectedServices: proposal.selectedServices || [],
        pricingSummary: proposal.pricingSummary || { subtotal: 0, gst: 0, total: 0 },
        termsAndConditions: proposal.termsAndConditions || "",
        createdAt: new Date(proposal.createdAt),
      });
      toast.success("Proposal PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = async (proposal: any) => {
    try {
      await printProposal({
        id: proposal.id,
        clientName: proposal.clientName || "Client",
        clientEmail: proposal.clientEmail,
        clientPhone: proposal.clientPhone,
        projectAddress: proposal.projectAddress,
        projectType: proposal.projectType,
        area: parseFloat(proposal.area as string) || 0,
        budget: parseFloat(proposal.budget as string) || 0,
        estimatedTimeline: proposal.estimatedTimeline || "",
        selectedServices: proposal.selectedServices || [],
        pricingSummary: proposal.pricingSummary || { subtotal: 0, gst: 0, total: 0 },
        termsAndConditions: proposal.termsAndConditions || "",
        createdAt: new Date(proposal.createdAt),
      });
      toast.success("Opening print dialog");
    } catch (error) {
      toast.error("Failed to print proposal");
    }
  };



  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
            <p className="text-slate-600 mt-2">Create and manage your professional proposals</p>
          </div>
          <Button onClick={() => setLocation("/proposals/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Proposals List */}
        <Card>
          <CardHeader>
            <CardTitle>All Proposals</CardTitle>
            <CardDescription>
              {proposals?.length || 0} proposal{proposals?.length !== 1 ? "s" : ""} created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : proposals && proposals.length > 0 ? (
              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        Proposal #{proposal.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                        <span>Project Type: {proposal.projectType}</span>
                        <span>Total: ₹{proposal.pricingSummary?.total || "0"}</span>
                        <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(proposal)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(proposal)}
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(proposal.id)}
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/proposals/${proposal.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(proposal.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No proposals yet. Create your first proposal to get started.</p>
                <Button onClick={() => setLocation("/proposals/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Proposal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this proposal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
