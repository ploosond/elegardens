import { UploadApiResponse } from 'cloudinary';
import cloudinaryConfig from './cloudinaryConfig';

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinaryConfig.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinaryConfig.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

/**
 * Extracts the public_id from a Cloudinary URL
 * Cloudinary URLs typically have the format:
 * https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
 * or
 * https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the index of 'upload' in the path
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex === pathParts.length - 1) {
      return null;
    }
    
    // Get everything after 'upload'
    const afterUpload = pathParts.slice(uploadIndex + 1);
    
    // The last part is the filename with extension
    const filename = afterUpload[afterUpload.length - 1];
    
    // Remove the file extension
    const publicIdWithFolder = filename.replace(/\.[^/.]+$/, '');
    
    // If there are parts before the filename, they might be version or transformations
    // We need to reconstruct the full public_id including folder path
    if (afterUpload.length > 1) {
      // Check if first part is a version (numeric or v followed by number)
      const firstPart = afterUpload[0];
      const isVersion = /^v\d+$/.test(firstPart) || /^\d+$/.test(firstPart);
      
      if (isVersion && afterUpload.length > 2) {
        // Skip version, get folder path + filename
        const folderParts = afterUpload.slice(1, -1);
        return [...folderParts, publicIdWithFolder].join('/');
      } else if (!isVersion) {
        // No version, might be transformations or folder path
        // Try to get folder path + filename
        const folderParts = afterUpload.slice(0, -1);
        return [...folderParts, publicIdWithFolder].join('/');
      }
    }
    
    return publicIdWithFolder;
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}
