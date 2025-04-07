'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSnackBarStore } from '@/stores/snackbar-store';
import {
  Exhibit,
  createExhibit,
  updateExhibit,
  ExhibitCreateData,
} from '@/request/exhibits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RadioIcon } from 'lucide-react';
import { uploadFile } from '@/request/file';

interface ExhibitDrawerProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  exhibit: Exhibit | null;
  mode: 'create' | 'edit' | 'view';
}

export function ExhibitDrawer({
  isOpen,
  onClose,
  exhibit,
  mode,
}: ExhibitDrawerProps) {
  const [exhibitData, setExhibitData] = useState<Partial<Exhibit>>({
    name: '',
    description: '',
    period: '',
    location: '',
    isFeatured: false,
    historicalSignificance: '',
    year: new Date().getFullYear(),
    history: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const snackbar = useSnackBarStore();

  useEffect(() => {
    if (exhibit) {
      setExhibitData({
        name: exhibit.name,
        description: exhibit.description,
        period: exhibit.period,
        location: exhibit.location,
        isFeatured: exhibit.isFeatured,
        historicalSignificance: exhibit.historicalSignificance,
        year: exhibit.year,
        history: exhibit.history,
      });
    } else {
      setExhibitData({
        name: '',
        description: '',
        period: '',
        location: '',
        isFeatured: false,
        historicalSignificance: '',
        year: new Date().getFullYear(),
        history: '',
      });
    }
    setImage(null);
    setImages([]);
    setAudio(null);
  }, [exhibit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExhibitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Upload files first
      let imageId: number | undefined;
      let imageIds: number[] | undefined;
      let audioId: number | undefined;

      if (image) {
        const uploadedImage = await uploadFile(image);
        imageId = uploadedImage[0].id;
      }
      if (images.length > 0) {
        const uploadPromises = images.map((file) => uploadFile(file));
        const uploadedImages = await Promise.all(uploadPromises);
        imageIds = uploadedImages.map((img) => img[0].id);
      }
      if (audio) {
        const uploadedAudio = await uploadFile(audio);
        audioId = uploadedAudio[0].id;
      }

      const dataToSend: ExhibitCreateData = {
        name: exhibitData.name || '',
        description: exhibitData.description || '',
        period: exhibitData.period || '',
        location: exhibitData.location || '',
        isFeatured: exhibitData.isFeatured || false,
        historicalSignificance: exhibitData.historicalSignificance || '',
        year: exhibitData.year || new Date().getFullYear(),
        history: exhibitData.history || '',
        image: imageId,
        images: imageIds,
        audio: audioId,
      };

      if (mode === 'create') {
        await createExhibit(dataToSend);
        snackbar.success('Thành công', 'Đã tạo hiện vật thành công');
        onClose(true);
      } else if (mode === 'edit' && exhibit?.id) {
        await updateExhibit(exhibit.id, dataToSend);
        snackbar.success('Thành công', 'Đã cập nhật hiện vật thành công');
        onClose(true);
      }
    } catch (error) {
      console.error('Error saving exhibit:', error);
      snackbar.error('Lỗi', 'Không thể lưu hiện vật');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose(false)}>
      <SheetContent className="overflow-y-auto bg-white sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-gray-900">
            {mode === 'create'
              ? 'Thêm hiện vật'
              : mode === 'edit'
                ? 'Chỉnh sửa hiện vật'
                : 'Chi tiết hiện vật'}
          </SheetTitle>
        </SheetHeader>

        {mode === 'view' ? (
          <Tabs defaultValue="info" className="mt-6">
            <TabsList className="mb-4 bg-gray-100">
              <TabsTrigger value="info" className="text-gray-900">
                Thông tin
              </TabsTrigger>
              <TabsTrigger value="media" className="text-gray-900">
                Hình ảnh & Âm thanh
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Tên hiện vật
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={exhibitData.name}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={exhibitData.description}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period" className="text-gray-700">
                  Thời kỳ
                </Label>
                <Input
                  id="period"
                  name="period"
                  value={exhibitData.period}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">
                  Vị trí
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={exhibitData.location}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-gray-700">
                  Năm
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={exhibitData.year}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="historicalSignificance"
                  className="text-gray-700"
                >
                  Ý nghĩa lịch sử
                </Label>
                <Textarea
                  id="historicalSignificance"
                  name="historicalSignificance"
                  value={exhibitData.historicalSignificance}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="history" className="text-gray-700">
                  Lịch sử
                </Label>
                <Textarea
                  id="history"
                  name="history"
                  value={exhibitData.history}
                  disabled
                  className="bg-gray-50 text-gray-900"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="isFeatured" className="text-gray-700">
                  Nổi bật
                </Label>
                <Switch
                  id="isFeatured"
                  checked={exhibitData.isFeatured}
                  disabled
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              {exhibit?.image?.url && (
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Hình ảnh chính</Label>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${exhibit.image.url}`}
                        alt={exhibit.name}
                        className="h-48 w-full rounded object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {exhibit?.images && exhibit.images.length > 0 && (
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Hình ảnh bổ sung</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {exhibit.images.map((img, index) => (
                          <img
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                            alt={`${exhibit.name} - ${index + 1}`}
                            className="h-32 w-full rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {exhibit?.audio?.url && (
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Âm thanh</Label>
                      <audio controls className="w-full">
                        <source
                          src={`${process.env.NEXT_PUBLIC_API_URL}${exhibit.audio.url}`}
                          type="audio/mpeg"
                        />
                        Trình duyệt của bạn không hỗ trợ phát âm thanh.
                      </audio>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Tên hiện vật
              </Label>
              <Input
                id="name"
                name="name"
                value={exhibitData.name}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={exhibitData.description}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period" className="text-gray-700">
                Thời kỳ
              </Label>
              <Input
                id="period"
                name="period"
                value={exhibitData.period}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">
                Vị trí
              </Label>
              <Input
                id="location"
                name="location"
                value={exhibitData.location}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-700">
                Năm
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={exhibitData.year}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="historicalSignificance" className="text-gray-700">
                Ý nghĩa lịch sử
              </Label>
              <Textarea
                id="historicalSignificance"
                name="historicalSignificance"
                value={exhibitData.historicalSignificance}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history" className="text-gray-700">
                Lịch sử
              </Label>
              <Textarea
                id="history"
                name="history"
                value={exhibitData.history}
                onChange={handleChange}
                required
                className="border-gray-200 bg-white text-gray-900"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="isFeatured" className="text-gray-700">
                Nổi bật
              </Label>
              <Switch
                id="isFeatured"
                checked={exhibitData.isFeatured}
                onCheckedChange={(checked) =>
                  setExhibitData((prev) => ({ ...prev, isFeatured: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700">
                Hình ảnh chính
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="border-gray-200 bg-white text-gray-900"
                />
                {exhibit?.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${exhibit.image.url}`}
                    alt={exhibit.image.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-gray-700">
                Hình ảnh bổ sung
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="border-gray-200 bg-white text-gray-900"
              />
              {exhibit?.images && exhibit.images.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {exhibit.images.map((img) => (
                    <img
                      key={img.id}
                      src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                      alt={img.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio" className="text-gray-700">
                Âm thanh
              </Label>
              <div className="flex flex-col space-y-2">
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files?.[0] || null)}
                  className="border-gray-200 bg-white text-gray-900"
                />
                {exhibit?.audio && (
                  <div className="flex items-center space-x-2">
                    <RadioIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {exhibit.audio.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => onClose(false)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {mode === 'create' ? 'Thêm' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
