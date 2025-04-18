'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ContentImageUpload } from '@/components/ui/content-image-upload';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_ROUTES } from '@/const/routes';
import { useUserStore } from '@/stores/user-store';

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
  const { jwt } = useUserStore();
  const initialRender = useRef(true);
  const skipUpdate = useRef(false);
  const lastContentRef = useRef<ContentSection[]>([]);

  // Create a stable identity for default sections
  const defaultSections = useRef([{ heading: '', text: '', imageCaption: '' }]);

  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sections:
        value?.content && value.content.length > 0
          ? value.content
          : defaultSections.current,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  // Initialize component and handle value changes from parent
  useEffect(() => {
    setMounted(true);

    // Skip the first update to avoid circular updates
    if (skipUpdate.current) {
      skipUpdate.current = false;
      return;
    }

    // Only reset if we have new values from parent and they're different
    if (value?.content) {
      const newContent = JSON.stringify(value.content);
      const currentContent = JSON.stringify(lastContentRef.current);

      if (newContent !== currentContent) {
        console.log('Resetting form with new content:', value.content);
        lastContentRef.current = [...value.content];
        form.reset({ sections: value.content });
      }
    }
  }, [value, form]);

  // Handle form submission (we don't actually submit, but use this for validation)
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (onChange) {
      onChange({ content: data.sections });
    }
  };

  // Watch for form changes with deep comparison to avoid infinite updates
  useEffect(() => {
    if (!onChange) return;

    // Only set up the watcher after initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const subscription = form.watch((data) => {
      if (!data.sections) return;

      // Compare with last known content to avoid redundant updates
      const newContent = JSON.stringify(data.sections);
      const prevContent = JSON.stringify(lastContentRef.current);

      if (newContent !== prevContent) {
        console.log('Content changed, triggering update');
        skipUpdate.current = true; // Prevent circular updates

        // Process content sections to ensure proper Strapi format
        const processedSections = data.sections.map((section: any) => {
          // Add backend URL to image paths
          if (
            section.image &&
            typeof section.image === 'string' &&
            section.image.startsWith('/')
          ) {
            console.log('Processing image URL in content:', section.image);

            // Create a new section with the full image URL
            return {
              ...section,
              image: `${process.env.NEXT_PUBLIC_API_URL}${section.image}`,
            };
          }

          return section;
        });

        lastContentRef.current = JSON.parse(newContent);
        onChange({ content: processedSections as ContentSection[] });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Handle image upload to Strapi
  const handleImageUpload = async (file: File, index: number) => {
    try {
      console.log('Uploading content image:', file);
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(API_ROUTES.UPLOAD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log(
        'Content image upload response:',
        JSON.stringify(data, null, 2)
      );

      if (data && data.length > 0) {
        // Get the URL path for content sections
        const imageUrl = data[0].url;
        console.log('Content image URL from Strapi:', imageUrl);

        // Update the form with the image URL path (not the ID)
        // We store the raw path as returned by Strapi without the API URL prefix
        const currentSections = [...form.getValues('sections')];

        // Store the raw path - will be displayed with prefix by ContentImageUpload
        currentSections[index].image = imageUrl;
        console.log(`Storing raw image path in section ${index}:`, imageUrl);

        form.setValue('sections', currentSections);

        // Return the image path for other uses
        return imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <ContentImageUpload
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
