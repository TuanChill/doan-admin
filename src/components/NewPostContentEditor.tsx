'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_ROUTES } from '@/const/routes';

interface ContentSection {
  heading?: string;
  text: string;
  image?: string;
  imageCaption?: string;
}

interface PostContentEditorProps {
  value?: { content: ContentSection[] };
  onChange?: (value: { content: ContentSection[] }) => void;
  readOnly?: boolean;
}

const formSchema = z.object({
  sections: z.array(
    z.object({
      heading: z.string().optional(),
      text: z.string().min(1, 'Vui lòng nhập nội dung'),
      image: z.string().optional(),
      imageCaption: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

const PostContentEditor: React.FC<PostContentEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const [mounted, setMounted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sections: value?.content || [{ heading: '', text: '', imageCaption: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  useEffect(() => {
    setMounted(true);
    if (value?.content) {
      form.reset({ sections: value.content });
    }
  }, [value, form]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (onChange) {
      onChange({ content: data.sections });
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(API_ROUTES.UPLOAD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const imageUrl = data[0].url;
        const sections = form.getValues('sections');
        sections[index].image = imageUrl;
        form.setValue('sections', sections);
        form.trigger('sections');
        return imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  if (!mounted) return null;

  return (
    <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Phần {index + 1}
            </CardTitle>
            {!readOnly && (
              <div className="flex items-center space-x-2">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
                {index < fields.length - 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`sections.${index}.heading`}>Tiêu đề</Label>
              <Input
                {...form.register(`sections.${index}.heading`)}
                placeholder="Nhập tiêu đề phần"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`sections.${index}.text`}>
                Nội dung <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...form.register(`sections.${index}.text`)}
                placeholder="Nhập nội dung phần"
                className={cn(
                  'min-h-[100px]',
                  form.formState.errors.sections?.[index]?.text &&
                    'border-destructive'
                )}
                disabled={readOnly}
              />
              {form.formState.errors.sections?.[index]?.text && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sections[index]?.text?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <ImageUpload
                value={form.getValues(`sections.${index}.image`)}
                onChange={async (file) => {
                  try {
                    const url = await handleImageUpload(file, index);
                    if (url) {
                      form.setValue(`sections.${index}.image`, url);
                    }
                  } catch (error) {
                    console.error('Upload failed:', error);
                  }
                }}
                onRemove={() => {
                  form.setValue(`sections.${index}.image`, '');
                }}
                disabled={readOnly}
              />
              <p className="text-sm text-muted-foreground">
                Chỉ cho phép tải lên 1 hình ảnh cho mỗi phần (tối đa 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`sections.${index}.imageCaption`}>
                Chú thích hình ảnh
              </Label>
              <Input
                {...form.register(`sections.${index}.imageCaption`)}
                placeholder="Nhập chú thích cho hình ảnh"
                disabled={readOnly}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            append({ heading: '', text: '', image: '', imageCaption: '' })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm phần nội dung
        </Button>
      )}
    </form>
  );
};

export default PostContentEditor;
