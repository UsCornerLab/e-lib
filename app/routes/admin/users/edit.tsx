import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Link } from "react-router";
import { useUsers } from "~/hooks/useUsers";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  birthDate: string;
  profile?: string;
}

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, updateUser } = useUsers();
  const userId = Number(id);
  const user = users.find((u) => u.id === userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        birthDate: user.birthDate,
        profile: user.profile,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateUser(userId, {
        ...formData,
        profile: profileImage || undefined, // Only include if there's a new image
      });
      navigate("/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !formData) return <p>Loading user...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">
              {formData.first_name} {formData.last_name}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update user details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                      />
                      <Input
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage
                        src={
                          profileImage
                            ? URL.createObjectURL(profileImage)
                            : formData.profile || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {formData.first_name.charAt(0)}
                        {formData.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-4"
                    />
                  </CardContent>
                </Card>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}