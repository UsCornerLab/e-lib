// src/pages/admin/NewUser.tsx
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Link } from "react-router";
import { useUsers } from "~/hooks/useUsers";

export default function NewUser() {
  const navigate = useNavigate();
  const { addUser } = useUsers();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: new Date().toISOString().split("T")[0],
    address: "",
    role: "user", // default role
  });

  const availableRoles = ["user", "librarian", "admin"];

  const handleChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleIdPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setIdPhoto(f);
  };

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setProfilePhoto(f);
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert("First and last name are required.");
      return false;
    }
    if (!form.email.trim()) {
      alert("Email is required.");
      return false;
    }
    if (!form.password || form.password.length < 8) {
      alert("Password is required and must be at least 8 characters.");
      return false;
    }
    if (!form.birthDate) {
      alert("Birth date is required.");
      return false;
    }
    if (!form.address.trim()) {
      alert("Address is required.");
      return false;
    }
    if (!idPhoto) {
      alert("ID photo is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      // Backend expects fields like firstName, lastName, birthDate, address, id_photo, profile
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("birthDate", form.birthDate);
      fd.append("address", form.address);
      fd.append("role", form.role); // backend does Role::firstOrCreate on $request->role

      if (idPhoto) fd.append("id_photo", idPhoto);
      if (profilePhoto) fd.append("profile", profilePhoto);

      // use addUser from hook — it now accepts FormData (see hooks change below)
      await addUser(fd);
      navigate("/admin/users");
    } catch (err: any) {
      console.error("User register failed:", err);
      alert(err?.message ?? "Failed to register user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-muted-foreground">Register a new user account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic user details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name *</Label>
                    <Input id="firstName" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input id="lastName" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required type="email" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required type="password" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Birth date *</Label>
                    <Input id="birthDate" type="date" value={form.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={form.role} onValueChange={(v) => handleChange("role", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ID Photo</CardTitle>
                <CardDescription>Government ID (jpg/png, max 10MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {idPhoto ? (
                    <div className="relative">
                      <img src={URL.createObjectURL(idPhoto)} alt="ID preview" className="w-full aspect-[3/2] object-cover rounded-lg" />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setIdPhoto(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-4">
                        <Label htmlFor="id-photo" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload</span>
                        </Label>
                        <Input id="id-photo" type="file" accept="image/*" onChange={handleIdPhoto} className="hidden" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Photo (optional)</CardTitle>
                <CardDescription>Optional avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profilePhoto ? (
                    <div className="relative">
                      <img src={URL.createObjectURL(profilePhoto)} alt="Profile preview" className="w-full aspect-[1/1] object-cover rounded-lg" />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setProfilePhoto(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-4">
                        <Label htmlFor="profile-photo" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload</span>
                        </Label>
                        <Input id="profile-photo" type="file" accept="image/*" onChange={handleProfilePhoto} className="hidden" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register User"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/users">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
