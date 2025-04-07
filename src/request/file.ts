import { fdAxios } from "@/config/axios.config";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file); // Changed 'file' to 'files' to match Strapi's API expectation
  
  // FormData doesn't show content when logged directly
  // We can log the file to verify it's being added correctly
  console.log('File being uploaded:', file.name, file.size, file.type);
  
  // Set the correct content type header for multipart form data
  const response = await fdAxios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

