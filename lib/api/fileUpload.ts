import { v2 as cloudinaryV2 } from 'cloudinary';

export async function uploadImage(base64Data: string, fileName: string) {
  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinaryV2.uploader.upload(
      `${base64Data}`,
      {
        folder: 'extra/v2',
        filename_override: fileName,
        use_filename: true,
      }
    );
    return result.secure_url;
  } catch (error) {
    return null;
  }
}
