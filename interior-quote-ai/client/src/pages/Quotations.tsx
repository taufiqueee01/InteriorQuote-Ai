import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Download, Printer, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { downloadQuotationPDF, printQuotation } from "@/lib/pdfUtils";
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

export default function Quotations() {
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data: quotations, isLoading, refetch } = trpc.quotations.list.useQuery();
  const deleteQuotationMutation = trpc.quotations.delete.useMutation({
    onSuccess: () => {
      toast.success("Quotation deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete quotation");
    },
  });
  const duplicateQuotationMutation = trpc.quotations.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Quotation duplicated successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to duplicate quotation");
    },
  });

  const handleDelete = (id: number) => {
    deleteQuotationMutation.mutate({ id });
  };

  const handleDuplicate = (id: number) => {
    duplicateQuotationMutation.mutate({ id });
  };

  const handleDownloadPDF = async (quotation: any) => {
    try {
      await downloadQuotationPDF({
        id: quotation.id,
        clientName: quotation.clientName || "Client",
        clientEmail: quotation.clientEmail,
        clientPhone: quotation.clientPhone,
        projectType: quotation.projectType,
        area: parseFloat(quotation.area as string) || 0,
        budget: parseFloat(quotation.budget as string) || 0,
        estimatedTimeline: quotation.estimatedTimeline || "",
        selectedServices: quotation.selectedServices || [],
        lineItems: quotation.lineItems || [],
        subtotal: quotation.subtotal || 0,
        gstAmount: quotation.gstAmount || 0,
        finalTotal: quotation.finalTotal || 0,
        createdAt: new Date(quotation.createdAt),
      });
      toast.success("Quotation PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = async (quotation: any) => {
    try {
      await printQuotation({
        id: quotation.id,
        clientName: quotation.clientName || "Client",
        clientEmail: quotation.clientEmail,
        clientPhone: quotation.clientPhone,
        projectType: quotation.projectType,
        area: parseFloat(quotation.area as string) || 0,
        budget: parseFloat(quotation.budget as string) || 0,
        estimatedTimeline: quotation.estimatedTimeline || "",
        selectedServices: quotation.selectedServices || [],
        lineItems: quotation.lineItems || [],
        subtotal: quotation.subtotal || 0,
        gstAmount: quotation.gstAmount || 0,
        finalTotal: quotation.finalTotal || 0,
        createdAt: new Date(quotation.createdAt),
      });
      toast.success("Opening print dialog");
    } catch (error) {
      toast.error("Failed to print quotation");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-slate-600 mt-2">Create and manage your quotations</p>
          </div>
          <Button onClick={() => setLocation("/quotations/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Quotation
          </Button>
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>
              {quotations?.length || 0} quotation{quotations?.length !== 1 ? "s" : ""} created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : quotations && quotations.length > 0 ? (
              <div className="space-y-3">
                {quotations.map((quotation) => (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        Quotation #{quotation.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                        <span>Project Type: {quotation.projectType}</span>
                        <span>Total: ₹{quotation.finalTotal || "0"}</span>
                        <span>Created: {new Date(quotation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(quotation)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(quotation)}
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(quotation.id)}
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/quotations/${quotation.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(quotation.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No quotations yet. Create your first quotation to get started.</p>
                <Button onClick={() => setLocation("/quotations/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Quotation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quotation? This action cannot be undone.
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
