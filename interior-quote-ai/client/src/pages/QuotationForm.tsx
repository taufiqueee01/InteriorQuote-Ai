import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
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

interface LineItem {
  id?: number;
  itemName: string;
  quantity: number;
  rate: number;
  gstPercentage: number;
  discount: number;
}

export default function QuotationForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/quotations/:id");
  const quotationId = params?.id ? parseInt(params.id) : null;

  const { data: clients } = trpc.clients.list.useQuery();
  const { data: quotation, isLoading: quotationLoading } = trpc.quotations.getById.useQuery(
    { id: quotationId! },
    { enabled: !!quotationId }
  );
  const { data: quotationItems } = trpc.quotationItems.getByQuotationId.useQuery(
    { quotationId: quotationId! },
    { enabled: !!quotationId }
  );

  const [formData, setFormData] = useState({
    clientId: 0,
    projectType: "",
    area: 0,
    budget: 0,
    estimatedTimeline: "",
    selectedServices: [] as string[],
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { itemName: "", quantity: 1, rate: 0, gstPercentage: 18, discount: 0 },
  ]);

  useEffect(() => {
    if (quotation) {
      setFormData({
        clientId: quotation.clientId,
        projectType: quotation.projectType,
        area: quotation.area ? parseFloat(quotation.area as string) : 0,
        budget: quotation.budget ? parseFloat(quotation.budget as string) : 0,
        estimatedTimeline: quotation.estimatedTimeline || "",
        selectedServices: quotation.selectedServices || [],
      });
    }
    if (quotationItems) {
      setLineItems(
        quotationItems.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          quantity: parseFloat(item.quantity as string),
          rate: parseFloat(item.rate as string),
          gstPercentage: parseFloat(item.gstPercentage as string),
          discount: parseFloat(item.discount as string),
        }))
      );
    }
  }, [quotation, quotationItems]);

  const createMutation = trpc.quotations.create.useMutation({
    onSuccess: () => {
      toast.success("Quotation created successfully");
      setLocation("/quotations");
    },
    onError: () => {
      toast.error("Failed to create quotation");
    },
  });

  const updateMutation = trpc.quotations.update.useMutation({
    onSuccess: () => {
      toast.success("Quotation updated successfully");
      setLocation("/quotations");
    },
    onError: () => {
      toast.error("Failed to update quotation");
    },
  });

  const calculateTotals = () => {
    let subtotal = 0;
    lineItems.forEach((item) => {
      const itemTotal = item.quantity * item.rate - item.discount;
      subtotal += itemTotal;
    });

    const gstAmount = subtotal * 0.18; // Assuming 18% GST
    const finalTotal = subtotal + gstAmount;

    return { subtotal, gstAmount, finalTotal };
  };

  const { subtotal, gstAmount, finalTotal } = calculateTotals();

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
    if (lineItems.some((item) => !item.itemName)) {
      toast.error("Please fill all line item names");
      return;
    }

    const data = {
      clientId: formData.clientId,
      projectType: formData.projectType,
      area: formData.area,
      budget: formData.budget,
      estimatedTimeline: formData.estimatedTimeline,
      selectedServices: formData.selectedServices,
      subtotal,
      gstAmount,
      finalTotal,
    };

    if (quotationId) {
      updateMutation.mutate({ id: quotationId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = quotationLoading || createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {quotationId ? "Edit Quotation" : "Create New Quotation"}
          </h1>
          <p className="text-slate-600 mt-2">
            {quotationId ? "Update quotation details" : "Create a professional quotation in minutes"}
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
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="50000"
                    value={formData.budget || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })
                    }
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
              <CardTitle>Services</CardTitle>
              <CardDescription>Select the services included in this quotation</CardDescription>
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

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add items to your quotation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Item Name</th>
                      <th className="text-right py-2 px-2">Qty</th>
                      <th className="text-right py-2 px-2">Rate</th>
                      <th className="text-right py-2 px-2">GST %</th>
                      <th className="text-right py-2 px-2">Discount</th>
                      <th className="text-right py-2 px-2">Total</th>
                      <th className="text-center py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => {
                      const itemTotal =
                        item.quantity * item.rate - item.discount;
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-2">
                            <Input
                              placeholder="Item name"
                              value={item.itemName}
                              onChange={(e) => {
                                const newItems = [...lineItems];
                                newItems[index].itemName = e.target.value;
                                setLineItems(newItems);
                              }}
                              className="h-8"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              placeholder="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...lineItems];
                                newItems[index].quantity = parseFloat(e.target.value) || 0;
                                setLineItems(newItems);
                              }}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.rate}
                              onChange={(e) => {
                                const newItems = [...lineItems];
                                newItems[index].rate = parseFloat(e.target.value) || 0;
                                setLineItems(newItems);
                              }}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              placeholder="18"
                              value={item.gstPercentage}
                              onChange={(e) => {
                                const newItems = [...lineItems];
                                newItems[index].gstPercentage = parseFloat(e.target.value) || 0;
                                setLineItems(newItems);
                              }}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.discount}
                              onChange={(e) => {
                                const newItems = [...lineItems];
                                newItems[index].discount = parseFloat(e.target.value) || 0;
                                setLineItems(newItems);
                              }}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-medium">
                            ₹{itemTotal.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setLineItems(lineItems.filter((_, i) => i !== index));
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLineItems([
                    ...lineItems,
                    { itemName: "", quantity: 1, rate: 0, gstPercentage: 18, discount: 0 },
                  ]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-right">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%):</span>
                  <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : quotationId ? "Update Quotation" : "Create Quotation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/quotations")}
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
