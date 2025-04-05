'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, Pencil, Trash2, Eye } from 'lucide-react';
import { useSnackBarStore } from '@/stores/snackbar-store';
import UserDrawer from '@/components/users/UserDrawer';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { User, getUsers, deleteUser } from '@/request/users';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  );
  const snackbar = useSnackBarStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      snackbar.error('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setCurrentUser(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentUser?.id) return;

    try {
      await deleteUser(currentUser.id);
      snackbar.success('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      snackbar.error('Error', 'Failed to delete user');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const onDrawerClose = (shouldRefresh: boolean) => {
    setIsDrawerOpen(false);
    if (shouldRefresh) {
      fetchUsers();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-700">
          Loading users...
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Full Name</TableHead>
                <TableHead className="text-gray-700">Phone</TableHead>
                <TableHead className="text-gray-700">Gender</TableHead>
                <TableHead className="text-gray-700">Date of Birth</TableHead>
                <TableHead className="text-gray-700">Address</TableHead>
                <TableHead className="text-right text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-gray-700"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-900">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {user.fullName || '-'}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {user.phoneNumber || '-'}
                    </TableCell>
                    <TableCell className="capitalize text-gray-900">
                      {user.gender || '-'}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(user.dateOfBirth)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {user.address || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* User Drawer for Create/Edit/View */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        user={currentUser}
        mode={drawerMode}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete ${currentUser?.email}? This action cannot be undone.`}
      />
    </div>
  );
}
