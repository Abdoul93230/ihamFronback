import cloudinary from "../config/cloudinary.js";
import Produit from "../models/Product.js";

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    let pictures = [];
    let variantImages = new Map();

    // Gestion des images principales
    if (req.files) {
      if (req.files.image1) {
        const result1 = await cloudinary.uploader.upload(
          req.files.image1[0].path,
          { folder: "images" }
        );
        pictures.push(result1.secure_url);
      }
      if (req.files.image2) {
        const result2 = await cloudinary.uploader.upload(
          req.files.image2[0].path,
          { folder: "images" }
        );
        pictures.push(result2.secure_url);
      }
      if (req.files.image3) {
        const result3 = await cloudinary.uploader.upload(
          req.files.image3[0].path,
          { folder: "images" }
        );
        pictures.push(result3.secure_url);
      }

      // Gestion des images des variantes
      if (req.files.variantImages) {
        for (const file of req.files.variantImages) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "variants",
          });
          variantImages.set(file.originalname, result.secure_url);
        }
      }

      // Gestion des images additionnelles
      if (req.files.nouveauChampImages) {
        for (const file of req.files.nouveauChampImages) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "images",
          });
          pictures.push(result.secure_url);
        }
      }
    }

    // Traitement des variantes
    const variants = data.variants ? JSON.parse(data.variants) : [];
    const processedVariants = variants.map(variant => ({
      color: variant.colorName,
      colorCode: variant.color,
      sizes: variant.sizes,
      imageUrl: variantImages.get(variant.imageFile.name) || '',
      stock: 2,
    }));

    // Création du produit avec les variantes
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
      prixLivraison: data.prixLivraison || 0,
    });

    const savedProduct = await product.save();
    return res.json({
      message: `Le produit ${data.name} a été créé avec succès`,
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la création du produit",
      error: error.message,
    });
  }
};