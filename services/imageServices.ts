import { adminApiClient } from '@/lib/axios';

export const deleteImage = async (publicId: string) => {
  try {
    const response = await adminApiClient.delete('/images', {
      data: { public_id: publicId },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete image',
      error?.response.data || error.message
    );
    throw error;
  }
};
