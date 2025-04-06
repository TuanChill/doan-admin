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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSnackBarStore } from '@/stores/snackbar-store';
import {
  User,
  Action,
  createUser,
  updateUser,
  getUserActions,
} from '@/request/users';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // State for user actions (point history)
  const [userActions, setUserActions] = useState<Action[]>([]);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [actionsPage, setActionsPage] = useState(1);
  const [actionsLimit] = useState(5);
  const [actionsTotalItems, setActionsTotalItems] = useState(0);
  const [actionsTotalPages, setActionsTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        password: '', // Clear password when editing
      });

      // If in view mode and user has an ID, fetch their point history
      if (mode === 'view' && user.id) {
        fetchUserActions(user.id);
      }
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
  }, [user, isOpen, mode]);

  const fetchUserActions = async (userId: number, page = actionsPage) => {
    if (!userId) return;

    try {
      setActionsLoading(true);
      const response = await getUserActions(userId, page, actionsLimit);

      if (response && response.data) {
        setUserActions(response.data);

        // Handle pagination meta
        if (response.meta && response.meta.pagination) {
          setActionsTotalItems(response.meta.pagination.total);
          setActionsTotalPages(response.meta.pagination.pageCount);
        } else {
          setActionsTotalItems(response.data.length);
          setActionsTotalPages(1);
        }
      } else {
        setUserActions([]);
        setActionsTotalItems(0);
        setActionsTotalPages(1);
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử điểm:', error);
      snackbar.error('Lỗi', 'Không thể tải lịch sử điểm');
      setUserActions([]);
    } finally {
      setActionsLoading(false);
    }
  };

  const handleActionsPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= actionsTotalPages && user?.id) {
      setActionsPage(newPage);
      fetchUserActions(user.id, newPage);
    }
  };

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
        snackbar.error('Lỗi', 'Email là bắt buộc');
        return;
      }

      // If creating or changing password, check password length
      if (
        (mode === 'create' || userData.password) &&
        userData.password &&
        userData.password.length < 6
      ) {
        snackbar.error('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      // Create a copy of the data to send
      const dataToSend = { ...userData };

      // When creating, set user permission to 'user'
      if (mode === 'create') {
        dataToSend.permission = 'user';
      }

      // Remove empty password if not needed
      if (mode === 'edit' && !dataToSend.password) {
        delete dataToSend.password;
      }

      // Handle create or update
      let response;
      if (mode === 'create') {
        response = await createUser(dataToSend);
        if (response && response.data) {
          snackbar.success('Thành công', 'Đã tạo tài khoản thành công');
          onClose(true); // Close with refresh
        } else {
          throw new Error('Không nhận được phản hồi từ máy chủ');
        }
      } else if (mode === 'edit' && user?.id) {
        response = await updateUser(user.id, dataToSend);
        if (response && response.data) {
          snackbar.success('Thành công', 'Đã cập nhật tài khoản thành công');
          onClose(true); // Close with refresh
        } else {
          throw new Error('Không nhận được phản hồi từ máy chủ');
        }
      }
    } catch (error: any) {
      console.error('Error saving user:', error);

      // Handle API error messages
      let errorMessage = 'Không thể lưu tài khoản';
      if (error.response && error.response.data && error.response.data.error) {
        // Extract error message from Strapi error format if available
        if (error.response.data.error.message) {
          errorMessage = error.response.data.error.message;
        } else if (
          error.response.data.error.details &&
          error.response.data.error.details.errors
        ) {
          // Try to get validation errors
          const validationErrors = error.response.data.error.details.errors;
          if (validationErrors && validationErrors.length > 0) {
            errorMessage = validationErrors[0].message || errorMessage;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      snackbar.error('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose(false)}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-gray-900">
            {mode === 'create'
              ? 'Thêm tài khoản mới'
              : mode === 'edit'
                ? 'Chỉnh sửa tài khoản'
                : 'Thông tin tài khoản'}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {mode === 'view'
              ? 'Xem thông tin tài khoản'
              : 'Điền thông tin vào form bên dưới để lưu tài khoản.'}
          </SheetDescription>
        </SheetHeader>

        {mode === 'view' ? (
          <Tabs defaultValue="info" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="points">Lịch sử điểm</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Họ tên
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={userData.fullName || ''}
                  disabled
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userData.phoneNumber || ''}
                  disabled
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-700">
                  Giới tính
                </Label>
                <Select value={userData.gender || 'other'} disabled>
                  <SelectTrigger className="text-gray-900">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="text-gray-900">
                      Nam
                    </SelectItem>
                    <SelectItem value="female" className="text-gray-900">
                      Nữ
                    </SelectItem>
                    <SelectItem value="other" className="text-gray-900">
                      Khác
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700">
                  Ngày sinh
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={userData.dateOfBirth || ''}
                  disabled
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={userData.address || ''}
                  disabled
                  className="text-gray-900"
                />
              </div>
            </TabsContent>

            <TabsContent value="points">
              <div className="rounded-md border">
                <h3 className="mb-2 font-medium text-gray-900">
                  Lịch sử cộng/trừ điểm
                </h3>
                {actionsLoading ? (
                  <div className="py-4 text-center text-gray-500">
                    Đang tải...
                  </div>
                ) : userActions.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">
                    Chưa có lịch sử điểm
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-700">
                            Hành động
                          </TableHead>
                          <TableHead className="text-gray-700">Điểm</TableHead>
                          <TableHead className="text-gray-700">
                            Vé/sự kiện
                          </TableHead>
                          <TableHead className="text-gray-700">
                            Thời gian
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userActions.map((action) => (
                          <TableRow
                            key={action.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="text-gray-900">
                              {action.name}
                            </TableCell>
                            <TableCell
                              className={`font-medium ${action.point >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {action.point >= 0
                                ? `+${action.point}`
                                : action.point}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {action.ticket?.name || '-'}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {formatDate(action.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination for actions */}
                    {actionsTotalPages > 1 && (
                      <div className="flex items-center justify-between border-t p-4">
                        <div className="text-sm text-gray-500">
                          Trang {actionsPage} / {actionsTotalPages}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleActionsPageChange(actionsPage - 1)
                            }
                            disabled={actionsPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-900" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleActionsPageChange(actionsPage + 1)
                            }
                            disabled={actionsPage === actionsTotalPages}
                          >
                            <ChevronRight className="h-4 w-4 text-gray-900" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
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
                required
                className="text-gray-900"
              />
            </div>

            {(mode === 'create' || mode === 'edit') && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Mật khẩu{' '}
                  {mode === 'edit' && '(Để trống nếu không muốn thay đổi)'}
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
                Họ tên
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={userData.fullName || ''}
                onChange={handleChange}
                className="text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-700">
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={userData.phoneNumber || ''}
                onChange={handleChange}
                className="text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700">
                Giới tính
              </Label>
              <Select
                value={userData.gender || 'other'}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className="text-gray-900">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="text-gray-900">
                    Nam
                  </SelectItem>
                  <SelectItem value="female" className="text-gray-900">
                    Nữ
                  </SelectItem>
                  <SelectItem value="other" className="text-gray-900">
                    Khác
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-700">
                Ngày sinh
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={userData.dateOfBirth || ''}
                onChange={handleChange}
                className="text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">
                Địa chỉ
              </Label>
              <Input
                id="address"
                name="address"
                value={userData.address || ''}
                onChange={handleChange}
                className="text-gray-900"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2 text-black">
          <Button variant="outline" onClick={() => onClose(false)}>
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
