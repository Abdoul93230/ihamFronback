import cloudinary from "../config/cloudinary.js";
import Produit from "../models/Product.js";

const uploadToCloudinary = async (file, folder = "images") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Erreur lors de l'upload de l'image: ${error.message}`);
  }
};

const handleImageUploads = async (files) => {
  const pictures = [];
  const variantImages = new Map();

  if (!files) return { pictures, variantImages };

  // Upload des images principales
  for (let i = 1; i <= 3; i++) {
    const key = `image${i}`;
    if (files[key]?.[0]) {
      const url = await uploadToCloudinary(files[key][0]);
      pictures.push(url);
    }
  }

  // Upload des images des variantes
  if (files.variantImages) {
    for (const file of files.variantImages) {
      const url = await uploadToCloudinary(file, "variants");
      variantImages.set(file.originalname, url);
    }
  }

  // Upload des images additionnelles
  if (files.nouveauChampImages) {
    for (const file of files.nouveauChampImages) {
      const url = await uploadToCloudinary(file);
      pictures.push(url);
    }
  }

  return { pictures, variantImages };
};

const processVariants = (variantsData, variantImages) => {
  if (!variantsData) return [];
  
  const variants = JSON.parse(variantsData);
  return variants.map(variant => ({
    color: variant.colorName,
    colorCode: variant.color,
    sizes: variant.sizes,
    imageUrl: variantImages.get(variant.imageFile?.name) || '',
    stock: 2
  }));
};

export const createProductService = async (data, files) => {
  const { pictures, variantImages } = await handleImageUploads(files);
  const processedVariants = processVariants(data.variants, variantImages);

  const product = new Produit({
    name: data.name,
    quantite: data.quantite,
    prixPromo: data.prixPromo,
    prix: data.prix,
    prixf: data.prixF || 0,
    description: data.description,
    variants: processedVariants,
    marque: data.marque,
    ClefType: data.ClefType,
    Clefournisseur: data.Clefournisseur,
    image1: pictures[0],
    image2: pictures[1],
    image3: pictures[2],
    pictures: pictures.slice(3) || [],
    prixLivraison: data.prixLivraison || 0
  });

  return await product.save();
};

export const updateProductService = async (productId, data, files) => {
  const product = await Produit.findById(productId);
  if (!product) {
    throw new Error("Produit introuvable");
  }

  const { pictures, variantImages } = await handleImageUploads(files);
  const processedVariants = processVariants(data.variants, variantImages);

  const updateData = {
    name: data.name,
    quantite: data.quantite,
    prixPromo: data.prixPromo,
    prix: data.prix,
    prixf: data.prixF || 0,
    description: data.description,
    variants: processedVariants,
    marque: data.marque,
    ClefType: data.ClefType,
    Clefournisseur: data.Clefournisseur,
    prixLivraison: data.prixLivraison || 0
  };

  if (pictures.length > 0) {
    updateData.image1 = pictures[0] || product.image1;
    updateData.image2 = pictures[1] || product.image2;
    updateData.image3 = pictures[2] || product.image3;
    updateData.pictures = pictures.slice(3) || product.pictures;
  }

  return await Produit.findByIdAndUpdate(productId, updateData, { new: true });
};

export const deleteProductService = async (productId) => {
  const product = await Produit.findById(productId);
  if (!product) {
    throw new Error("Produit introuvable");
  }

  // Suppression des images de Cloudinary
  const deleteFromCloudinary = async (url) => {
    if (!url) return;
    const publicId = `images/${url.split('/').pop().split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId);
  };

  const imagesToDelete = [
    product.image1,
    product.image2,
    product.image3,
    ...product.pictures,
    ...product.variants.map(v => v.imageUrl)
  ].filter(Boolean);

  await Promise.all(imagesToDelete.map(deleteFromCloudinary));
  await Produit.findByIdAndRemove(productId);
};

export const getProductByIdService = async (productId) => {
  return await Produit.findById(productId);
};

export const getAllProductsService = async () => {
  return await Produit.find();
};