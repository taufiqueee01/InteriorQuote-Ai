import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-slate-600">Full Name</Label>
                  <p className="text-slate-900 font-medium mt-1">{user?.name || "-"}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Email</Label>
                  <p className="text-slate-900 font-medium mt-1">{user?.email || "-"}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account security and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Login Method</h3>
              <p className="text-sm text-slate-600">
                {user?.loginMethod === "manus" ? "Manus OAuth" : "Email & Password"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Account Status</h3>
              <p className="text-sm text-slate-600">Active</p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your InteriorQuote AI experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Default GST Rate</h3>
              <Input
                type="number"
                placeholder="18"
                defaultValue="18"
                className="max-w-xs"
              />
              <p className="text-xs text-slate-600 mt-1">
                This will be used as default GST percentage in quotations
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Currency</h3>
              <p className="text-sm text-slate-600">Indian Rupee (₹)</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Actions that cannot be undone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Sign Out</h3>
              <p className="text-sm text-slate-600 mb-4">
                Sign out from your account on this device
              </p>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>InteriorQuote AI v1.0</p>
            <p>Professional quotation and proposal generator for interior designers</p>
            <p className="text-xs text-slate-500 mt-4">
              © 2026 InteriorQuote AI. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
