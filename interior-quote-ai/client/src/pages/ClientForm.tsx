import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/clients/:id");
  const clientId = params?.id ? parseInt(params.id) : null;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectAddress: "",
    notes: "",
  });

  const { data: client, isLoading } = trpc.clients.getById.useQuery(
    { id: clientId! },
    { enabled: !!clientId }
  );

  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Client created successfully");
      setLocation("/clients");
    },
    onError: () => {
      toast.error("Failed to create client");
    },
  });

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      toast.success("Client updated successfully");
      setLocation("/clients");
    },
    onError: () => {
      toast.error("Failed to update client");
    },
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        projectAddress: client.projectAddress || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    if (clientId) {
      updateMutation.mutate({
        id: clientId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading_ = isLoading || createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {clientId ? "Edit Client" : "Add New Client"}
          </h1>
          <p className="text-slate-600 mt-2">
            {clientId ? "Update client information" : "Create a new client profile"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>
              Enter the client's details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && clientId ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectAddress">Project Address</Label>
                  <Input
                    id="projectAddress"
                    placeholder="123 Main St, City, State 12345"
                    value={formData.projectAddress}
                    onChange={(e) => setFormData({ ...formData, projectAddress: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes about this client..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading_}
                  >
                    {isLoading_ ? "Saving..." : clientId ? "Update Client" : "Create Client"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/clients")}
                    disabled={isLoading_}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
