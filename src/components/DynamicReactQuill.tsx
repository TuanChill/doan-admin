'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="h-40 border border-gray-300 p-2">Loading editor...</div>
  ),
});

// Only import the CSS in the client
const ReactQuillStyles = () => {
  useEffect(() => {
    // @ts-ignore - CSS imports don't need type declarations
    import('react-quill/dist/quill.snow.css');
  }, []);
  return null;
};

interface QuillProps {
  value?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  theme?: string;
  style?: React.CSSProperties;
}

export default function DynamicReactQuill(props: QuillProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-40 border border-gray-300 p-2">Loading editor...</div>
    );
  }

  return (
    <>
      <ReactQuillStyles />
      <ReactQuill {...props} />
    </>
  );
}
