import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROJECT_TYPES = ["1BHK", "2BHK", "3BHK", "Villa", "Office", "Restaurant", "Shop"];
const SERVICES = [
  "Interior Design",
  "Furniture Planning",
  "Material Selection",
  "Site Visits",
  "3D Rendering",
  "Execution Support",
  "Lighting Design",
  "False Ceiling Design",
  "Custom Work",
];

export default function ProposalForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/proposals/:id");
  const proposalId = params?.id ? parseInt(params.id) : null;

  const { data: clients } = trpc.clients.list.useQuery();
  const { data: proposal, isLoading: proposalLoading } = trpc.proposals.getById.useQuery(
    { id: proposalId! },
    { enabled: !!proposalId }
  );

  const [formData, setFormData] = useState({
    clientId: 0,
    quotationId: 0,
    projectType: "",
    area: 0,
    budget: 0,
    estimatedTimeline: "",
    selectedServices: [] as string[],
    termsAndConditions: "",
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        clientId: proposal.clientId,
        quotationId: proposal.quotationId || 0,
        projectType: proposal.projectType,
        area: proposal.area ? parseFloat(proposal.area as string) : 0,
        budget: proposal.budget ? parseFloat(proposal.budget as string) : 0,
        estimatedTimeline: proposal.estimatedTimeline || "",
        selectedServices: proposal.selectedServices || [],
        termsAndConditions: proposal.termsAndConditions || "",
      });
    }
  }, [proposal]);

  const createMutation = trpc.proposals.create.useMutation({
    onSuccess: () => {
      toast.success("Proposal created successfully");
      setLocation("/proposals");
    },
    onError: () => {
      toast.error("Failed to create proposal");
    },
  });

  const updateMutation = trpc.proposals.update.useMutation({
    onSuccess: () => {
      toast.success("Proposal updated successfully");
      setLocation("/proposals");
    },
    onError: () => {
      toast.error("Failed to update proposal");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }
    if (!formData.projectType) {
      toast.error("Please select a project type");
      return;
    }

    const pricingSummary = {
      subtotal: formData.budget * 0.85,
      gst: formData.budget * 0.15,
      total: formData.budget,
    };

    const data = {
      clientId: formData.clientId,
      quotationId: formData.quotationId || undefined,
      projectType: formData.projectType,
      area: formData.area,
      budget: formData.budget,
      estimatedTimeline: formData.estimatedTimeline,
      selectedServices: formData.selectedServices,
      pricingSummary,
      termsAndConditions: formData.termsAndConditions,
    };

    if (proposalId) {
      updateMutation.mutate({ id: proposalId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = proposalLoading || createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {proposalId ? "Edit Proposal" : "Create New Proposal"}
          </h1>
          <p className="text-slate-600 mt-2">
            {proposalId ? "Update proposal details" : "Create a professional proposal in minutes"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Project Details</CardTitle>
              <CardDescription>Select client and project information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select
                    value={formData.clientId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="1000"
                    value={formData.area || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="50000"
                    value={formData.budget || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="timeline">Estimated Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 3 months"
                    value={formData.estimatedTimeline}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedTimeline: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Scope of Work - Services</CardTitle>
              <CardDescription>Select the services included in this proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.selectedServices.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            selectedServices: [...formData.selectedServices, service],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            selectedServices: formData.selectedServices.filter(
                              (s) => s !== service
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={service} className="font-normal cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>Add terms and conditions for this proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your terms and conditions here..."
                value={formData.termsAndConditions}
                onChange={(e) =>
                  setFormData({ ...formData, termsAndConditions: e.target.value })
                }
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-right">
                <div className="flex justify-between text-sm">
                  <span>Subtotal (85%):</span>
                  <span className="font-medium">₹{(formData.budget * 0.85).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (15%):</span>
                  <span className="font-medium">₹{(formData.budget * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{formData.budget.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : proposalId ? "Update Proposal" : "Create Proposal"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/proposals")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
