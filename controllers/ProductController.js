import cloudinary from '../config/cloudinary.js';
import Produit from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    let pictures = [];

    // Gestion des images principales
    if (req.files) {
      if (req.files.image1) {
        const result1 = await cloudinary.uploader.upload(req.files.image1[0].path, { folder: "images" });
        pictures.push(result1.secure_url);
      }
      if (req.files.image2) {
        const result2 = await cloudinary.uploader.upload(req.files.image2[0].path, { folder: "images" });
        pictures.push(result2.secure_url);
      }
      if (req.files.image3) {
        const result3 = await cloudinary.uploader.upload(req.files.image3[0].path, { folder: "images" });
        pictures.push(result3.secure_url);
      }
    }

    // Gestion des images additionnelles
    if (req.files.nouveauChampImages) {
      for (const file of req.files.nouveauChampImages) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "images" });
        pictures.push(result.secure_url);
      }
    }

    // Traitement des variantes
    const variants = data.variants ? JSON.parse(data.variants) : [];
    
    // Création du produit avec les variantes
    const product = new Produit({
      name: data.name,
      quantite: data.quantite,
      prixPromo: data.prixPromo,
      prix: data.prix,
      prixf: data.prixF || 0,
      description: data.description,
      variants: variants.map(variant => ({
        color: variant.colorName,
        colorCode: variant.color,
        sizes: variant.sizes,
        imageUrl: variant.imageUrl,
        stock: Math.floor(data.quantite / variants.length) // Distribution équitable du stock
      })),
      marque: data.marque,
      ClefType: data.ClefType,
      Clefournisseur: data.Clefournisseur,
      image1: pictures[0],
      image2: pictures[1],
      image3: pictures[2],
      pictures: pictures.slice(3) || [],
      prixLivraison: data.prixLivraison || 0
    });

    const savedProduct = await product.save();
    return res.json({
      message: `Le produit ${data.name} a été créé avec succès`,
      data: savedProduct
    });

  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la création du produit",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const data = req.body;
    const product = await Produit.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    // Mise à jour des images si nécessaire
    let updateData = {
      name: data.name,
      quantite: data.quantite,
      prixPromo: data.prixPromo,
      prix: data.prix,
      prixf: data.prixF || 0,
      description: data.description,
      marque: data.marque,
      ClefType: data.ClefType,
      Clefournisseur: data.Clefournisseur,
      prixLivraison: data.prixLivraison || 0
    };

    // Mise à jour des variantes si fournies
    if (data.variants) {
      const variants = JSON.parse(data.variants);
      updateData.variants = variants.map(variant => ({
        color: variant.colorName,
        colorCode: variant.color,
        sizes: variant.sizes,
        imageUrl: variant.imageUrl,
        stock: Math.floor(data.quantite / variants.length)
      }));
    }

    // Gestion des images
    if (req.files) {
      // Mise à jour des images principales
      if (req.files.image1) {
        const result1 = await cloudinary.uploader.upload(req.files.image1[0].path, { folder: "images" });
        updateData.image1 = result1.secure_url;
      }
      if (req.files.image2) {
        const result2 = await cloudinary.uploader.upload(req.files.image2[0].path, { folder: "images" });
        updateData.image2 = result2.secure_url;
      }
      if (req.files.image3) {
        const result3 = await cloudinary.uploader.upload(req.files.image3[0].path, { folder: "images" });
        updateData.image3 = result3.secure_url;
      }

      // Mise à jour des images additionnelles
      if (req.files.nouveauChampImages) {
        const newPictures = [];
        for (const file of req.files.nouveauChampImages) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "images" });
          newPictures.push(result.secure_url);
        }
        updateData.pictures = newPictures;
      }
    }

    const updatedProduct = await Produit.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    return res.json({
      message: "Produit mis à jour avec succès",
      data: updatedProduct
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du produit",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Produit.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    // Suppression des images de Cloudinary
    const imagesToDelete = [
      product.image1,
      product.image2,
      product.image3,
      ...product.pictures,
      ...product.variants.map(v => v.imageUrl)
    ].filter(Boolean);

    for (const imageUrl of imagesToDelete) {
      const publicId = `images/${imageUrl.split("/").pop().split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await Produit.findByIdAndRemove(productId);
    return res.json({ message: "Produit supprimé avec succès" });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du produit",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Produit.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    return res.json({ data: product });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la recherche du produit",
      error: error.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Produit.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "Aucun produit pour le moment." });
    }
    return res.json({ data: products });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des produits",
      error: error.message
    });
  }
};