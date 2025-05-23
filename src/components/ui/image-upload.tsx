import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageData {
  id: number;
  url: string;
  path: string;
}

interface ImageUploadProps {
  value?: string | ImageData | null;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}) => {
  const [loading, setLoading] = React.useState(false);
  const uniqueId = React.useId();
  const inputId = `cover-image-upload-${uniqueId}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.includes('image')) {
        alert('Vui lòng chỉ tải lên file hình ảnh');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setLoading(true);
      onChange?.(file);
      setLoading(false);
    },
    [onChange]
  );

  // Get the image URL from either string or ImageData object
  const getImageUrl = (): string | undefined => {
    if (!value) return undefined;

    // If value is a string, handle it directly
    if (typeof value === 'string') {
      return value.includes('http')
        ? value
        : `${process.env.NEXT_PUBLIC_API_URL}${value}`;
    }

    // If value is an ImageData object, use the url property
    return value.url;
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`relative max-w-[200px] ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled || loading}
        className="hidden"
        id={inputId}
      />
      {imageUrl ? (
        <div className="relative h-[200px] w-[200px] overflow-hidden rounded-lg border border-border">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onRemove}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Đang tải lên...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tải lên hình ảnh</p>
            </>
          )}
        </label>
      )}
    </div>
  );
};
