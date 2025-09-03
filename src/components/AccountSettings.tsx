import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Eye, 
  Calendar, 
  Save,
  Upload,
  UserCircle
} from 'lucide-react';
import { UserAccountSettings, DEFAULT_USER_SETTINGS } from '@/lib/utils';

type AccountSettingsProps = {
  onSignOut: () => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onSignOut }) => {
  const [settings, setSettings] = useState<UserAccountSettings>(DEFAULT_USER_SETTINGS);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user data from localStorage/API
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setSettings(prev => ({
          ...prev,
          username: user.username || '',
          email: user.email || '',
          displayName: user.displayName || '',
          bio: user.bio || '',
          avatarUrl: user.avatarUrl || '',
          lastLogin: user.lastLogin || '',
          accountCreated: user.accountCreated || '',
        }));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, avatarUrl: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Save to localStorage for now (in a real app, this would be an API call)
      const userData = {
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        username: settings.username,
        email: settings.email,
        displayName: settings.displayName,
        bio: settings.bio,
        avatarUrl: settings.avatarUrl,
        emailNotifications: settings.emailNotifications,
        publicProfile: settings.publicProfile,
        showEmail: settings.showEmail,
        twoFactorEnabled: settings.twoFactorEnabled,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setMessage('Profile updated successfully!');
      setIsError(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all password fields.');
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      setIsError(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // In a real app, this would be an API call to change password
      setMessage('Password changed successfully!');
      setIsError(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Failed to change password. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your public profile and personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={settings.avatarUrl} alt="Profile" />
              <AvatarFallback>
                {settings.displayName ? settings.displayName[0].toUpperCase() : 
                 settings.username ? settings.username[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </span>
                </Button>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload a profile picture (max 2MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  placeholder="Your username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={settings.displayName}
              onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="How your name appears to others"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself..."
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how your information is displayed to others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your profile and posts
              </p>
            </div>
            <Switch
              checked={settings.publicProfile}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, publicProfile: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show Email</Label>
              <p className="text-sm text-muted-foreground">
                Display your email address on your public profile
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, showEmail: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account and posts
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, twoFactorEnabled: checked }))
              }
            />
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium mb-4 block">Change Password</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange} 
                disabled={loading} 
                variant="outline"
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Account Created</span>
            <span className="text-sm">
              {settings.accountCreated ? 
                new Date(settings.accountCreated).toLocaleDateString() : 
                'Unknown'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Login</span>
            <span className="text-sm">
              {settings.lastLogin ? 
                new Date(settings.lastLogin).toLocaleString() : 
                'Unknown'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Sign Out
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Handle account deletion
                console.log('Account deletion requested');
              }
            }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
