'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserPlus,
  Pencil,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSnackBarStore } from '@/stores/snackbar-store';
import UserDrawer from '@/components/users/UserDrawer';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { User, getUsers, deleteUser } from '@/request/users';
import { Input } from '@/components/ui/input';

// Interface for API response format
interface UserResponse {
  id: number | string;
  attributes?: User;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const snackbar = useSnackBarStore();

  // Add debounce for search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = useCallback(
    async (pageNumber = page, searchTerm = debouncedSearchQuery) => {
      try {
        setLoading(true);
        const response = await getUsers(pageNumber, limit, searchTerm);

        if (response) {
          const processedUsers = response.map((user: UserResponse) => {
            if (user.attributes) {
              return {
                id: user.id,
                ...user.attributes,
              };
            }
            // Nếu dữ liệu đã được flatten
            return user as User;
          });

          setUsers(processedUsers);
          console.log('Dữ liệu đã xử lý:', processedUsers);

          // Handle pagination meta
          if (response.meta && response.meta.pagination) {
            setTotalItems(response.meta.pagination.total);
            setTotalPages(response.meta.pagination.pageCount);
            console.log('Thông tin phân trang:', response.meta.pagination);
          } else {
            // Mặc định nếu không có thông tin phân trang
            setTotalItems(processedUsers.length);
            setTotalPages(1);
          }
        } else {
          console.warn('Không có dữ liệu trả về từ API');
          setUsers([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        snackbar.error('Lỗi', 'Không thể tải danh sách tài khoản');
        setUsers([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearchQuery, limit, snackbar]
  );

  // Fetch users on page change, search query change
  useEffect(() => {
    fetchUsers(page, debouncedSearchQuery);
  }, [page, debouncedSearchQuery, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
      snackbar.success('Thành công', 'Đã xóa tài khoản thành công');

      // After successful deletion, refresh the current page
      // If there's only one item on the page and we're not on the first page, go to previous page
      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      snackbar.error('Lỗi', 'Không thể xóa tài khoản');
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
    <div className="mx-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="mb-4 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo email, tên, số điện thoại..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Reset to first page when searching
              setPage(1);
            }}
            className="pl-10 text-gray-900"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setPage(1);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            Xóa
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-700">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Họ tên</TableHead>
                <TableHead className="text-gray-700">Số điện thoại</TableHead>
                <TableHead className="text-gray-700">Giới tính</TableHead>
                <TableHead className="text-gray-700">Ngày sinh</TableHead>
                <TableHead className="text-gray-700">Địa chỉ</TableHead>
                <TableHead className="text-right text-gray-700">
                  Thao tác
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
                    {debouncedSearchQuery
                      ? 'Không tìm thấy tài khoản nào phù hợp'
                      : 'Không có tài khoản nào'}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  console.log('Đang hiển thị user:', user);
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        {user.email || 'Không có email'}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {user.fullName || '-'}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {user.phoneNumber || '-'}
                      </TableCell>
                      <TableCell className="capitalize text-gray-900">
                        {user.gender
                          ? user.gender === 'male'
                            ? 'Nam'
                            : user.gender === 'female'
                              ? 'Nữ'
                              : 'Khác'
                          : '-'}
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
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="h-4 w-4 text-yellow-500" />
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
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">
                  {users.length > 0 ? (page - 1) * limit + 1 : 0}
                </span>{' '}
                đến{' '}
                <span className="font-medium">
                  {Math.min(page * limit, totalItems)}
                </span>{' '}
                trong tổng số <span className="font-medium">{totalItems}</span>{' '}
                tài khoản
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="text-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        (p >= page - 1 && p <= page + 1)
                    )
                    .map((p, index, array) => {
                      // Add ellipsis between non-consecutive pages
                      const showEllipsisBefore =
                        index > 0 && p > array[index - 1] + 1;
                      const showEllipsisAfter =
                        index < array.length - 1 && p < array[index + 1] - 1;

                      return (
                        <div key={p} className="flex items-center">
                          {showEllipsisBefore && (
                            <span className="mx-1 text-gray-500">...</span>
                          )}
                          <Button
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(p)}
                            className={
                              p === page
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700'
                            }
                          >
                            {p}
                          </Button>
                          {showEllipsisAfter && (
                            <span className="mx-1 text-gray-500">...</span>
                          )}
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="text-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
        title="Xóa tài khoản"
        description={`Bạn có chắc chắn muốn xóa tài khoản ${currentUser?.email}? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
}
