import cloudinary from "../config/cloudinary.js";

export const deleteImageFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const publicId = url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (file, folder = "images") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    return result.secure_url;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw error;
  }
};