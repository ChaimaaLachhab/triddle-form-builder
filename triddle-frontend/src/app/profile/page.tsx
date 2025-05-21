"use client";

import * as React from "react";
import { User, Mail, Lock, Bell, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { authService } from "@/lib/api-service";
import { User as UserType } from "@/types/api-types";

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  
  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [formResponses, setFormResponses] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = React.useState(false);

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!authService.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = "/login";
        return;
      }
      
      try {
        setIsLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Initialize form with user data
        setName(userData.name || "");
        setEmail(userData.email || "");
        
        // Could also fetch notification preferences from an API here
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if ((error as any).isAuthError) {
          // Handle authentication error
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);
      
      // Validate inputs
      if (!name.trim() || !email.trim()) {
        toast.error("Name and email are required");
        return;
      }
      
      // Call API to update user details
      const updatedUser = await authService.updateUserDetails({
        name,
        email
      });
      
      // Update local state with updated user data
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      // Validate password fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All password fields are required");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      
      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      
      // Call API to update password
      await authService.updatePassword({
        currentPassword,
        newPassword
      });
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    // This would call an API to save notification preferences
    // For now, we'll just show a success toast
    toast.success("Notification preferences saved");
  };
  
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form fields to original values
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="max-w-3xl">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                {!isEditing ? (
                  <div className="space-y-6 border rounded-lg p-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-lg">{user?.name}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                    
                    <Button onClick={toggleEditMode}>
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-lg p-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={isUpdating}
                      >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={toggleEditMode}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="password" className="space-y-6">
              <div className="space-y-4 border rounded-lg p-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4 border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="form-responses">Form Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new form responses
                    </p>
                  </div>
                  <Switch
                    id="form-responses"
                    checked={formResponses}
                    onCheckedChange={setFormResponses}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                
                <Button onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}