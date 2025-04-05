import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSnackBarStore } from '@/stores/snackbar-store';
import { User, createUser, updateUser } from '@/request/users';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  user: User | null;
  mode: 'create' | 'edit' | 'view';
}

export default function UserDrawer({
  isOpen,
  onClose,
  user,
  mode,
}: UserDrawerProps) {
  const [userData, setUserData] = useState<User>({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: 'other',
  });
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackBarStore();

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        password: '', // Clear password when editing
      });
    } else {
      // Reset form for creating new user
      setUserData({
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: 'other',
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!userData.email) {
        snackbar.error('Error', 'Email is required');
        return;
      }

      // If creating or changing password, check password length
      if (
        (mode === 'create' || userData.password) &&
        userData.password &&
        userData.password.length < 6
      ) {
        snackbar.error('Error', 'Password must be at least 6 characters');
        return;
      }

      // Create a copy of the data to send
      const dataToSend = { ...userData };

      // Remove empty password if not needed
      if (mode === 'edit' && !dataToSend.password) {
        delete dataToSend.password;
      }

      // Handle create or update
      if (mode === 'create') {
        await createUser(dataToSend);
        snackbar.success('Success', 'User created successfully');
      } else if (mode === 'edit' && user?.id) {
        await updateUser(user.id, dataToSend);
        snackbar.success('Success', 'User updated successfully');
      }

      onClose(true); // Close with refresh
    } catch (error) {
      console.error('Error saving user:', error);
      snackbar.error('Error', 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose(false)}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-gray-900">
            {mode === 'create'
              ? 'Add New User'
              : mode === 'edit'
                ? 'Edit User'
                : 'User Details'}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {mode === 'view'
              ? 'View user information'
              : 'Fill in the form below to save user information.'}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={mode === 'view'}
              required
              className="text-gray-900"
            />
          </div>

          {(mode === 'create' || mode === 'edit') && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password{' '}
                {mode === 'edit' && '(Leave blank to keep current password)'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userData.password || ''}
                onChange={handleChange}
                className="text-gray-900"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={userData.fullName || ''}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={userData.phoneNumber || ''}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700">
              Gender
            </Label>
            <Select
              value={userData.gender || 'other'}
              onValueChange={(value) => handleSelectChange('gender', value)}
              disabled={mode === 'view'}
            >
              <SelectTrigger className="text-gray-900">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="text-gray-900">
                  Male
                </SelectItem>
                <SelectItem value="female" className="text-gray-900">
                  Female
                </SelectItem>
                <SelectItem value="other" className="text-gray-900">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-700">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={userData.dateOfBirth || ''}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={userData.address || ''}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="text-gray-900"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 text-black">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
