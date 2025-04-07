'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSnackBarStore } from '@/stores/snackbar-store';
import { Exhibit, getExhibits, deleteExhibit } from '@/request/exhibits';
import { ExhibitDrawer } from '@/components/exhibits/ExhibitDrawer';
import { ExhibitPagination } from '@/components/exhibits/ExhibitPagination';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export default function ExhibitsPage() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  );
  const snackbar = useSnackBarStore();

  const fetchExhibits = async () => {
    try {
      setLoading(true);
      const response = await getExhibits(page, pageSize, {
        filters: {
          $or: [
            { name: { $containsi: searchTerm } },
            { description: { $containsi: searchTerm } },
          ],
        },
        populate: '*',
      });
      setExhibits(response.data);
      setTotalPages(response.meta.pagination.pageCount);
    } catch (error) {
      console.error('Error fetching exhibits:', error);
      snackbar.error('Lỗi', 'Không thể tải danh sách hiện vật');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibits();
  }, [page, searchTerm]);

  const handleCreate = () => {
    setSelectedExhibit(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEdit = (exhibit: Exhibit) => {
    setSelectedExhibit(exhibit);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleView = (exhibit: Exhibit) => {
    setSelectedExhibit(exhibit);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hiện vật này?')) {
      try {
        await deleteExhibit(id);
        snackbar.success('Thành công', 'Đã xóa hiện vật thành công');
        fetchExhibits();
      } catch (error) {
        console.error('Error deleting exhibit:', error);
        snackbar.error('Lỗi', 'Không thể xóa hiện vật');
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Quản lý hiện vật</CardTitle>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm hiện vật
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm hiện vật..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 bg-white pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 text-gray-900">Hình ảnh</TableHead>
                  <TableHead className="text-gray-900">Tên hiện vật</TableHead>
                  <TableHead className="text-gray-900">Thời kỳ</TableHead>
                  <TableHead className="text-gray-900">Vị trí</TableHead>
                  <TableHead className="text-gray-900">Năm</TableHead>
                  <TableHead className="text-gray-900">Nổi bật</TableHead>
                  <TableHead className="w-20 text-gray-900">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500"
                    >
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : exhibits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500"
                    >
                      Không có hiện vật nào
                    </TableCell>
                  </TableRow>
                ) : (
                  exhibits.map((exhibit) => (
                    <TableRow key={exhibit.id} className="hover:bg-gray-50">
                      <TableCell>
                        {exhibit.image?.url && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${exhibit.image.url}`}
                            alt={exhibit.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {exhibit.name}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {exhibit.period}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {exhibit.location}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {exhibit.year}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {exhibit.isFeatured ? 'Có' : 'Không'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(exhibit)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(exhibit)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(exhibit.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <ExhibitPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      <ExhibitDrawer
        isOpen={isDrawerOpen}
        onClose={(refresh) => {
          setIsDrawerOpen(false);
          if (refresh) {
            fetchExhibits();
          }
        }}
        exhibit={selectedExhibit}
        mode={drawerMode}
      />
    </div>
  );
}
