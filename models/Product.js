import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  colorCode: {
    type: String,
    required: true
  },
  sizes: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String,
    required: true,
    match: [/^(http|https):\/\/\S+$/, "Veuillez fournir une URL d'image valide."]
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Le stock ne peut pas être négatif"]
  }
});

const produitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Le nom doit comporter au moins 2 caractères."]
  },
  image1: {
    type: String,
    required: true,
    match: [/^(http|https):\/\/\S+$/, "Veuillez fournir une URL d'image valide."]
  },
  image2: {
    type: String,
    required: true,
    match: [/^(http|https):\/\/\S+$/, "Veuillez fournir une URL d'image valide."]
  },
  image3: {
    type: String,
    required: true,
    match: [/^(http|https):\/\/\S+$/, "Veuillez fournir une URL d'image valide."]
  },
  marque: {
    type: String,
    required: false,
    minlength: [0, "Le nom de la marque doit comporter au moins 3 caractères."]
  },
  quantite: {
    type: Number,
    required: true,
    min: [1, "Le minimum d'un produit est de 1"]
  },
  prix: {
    type: Number,
    required: true,
    min: [10, "Le minimum d'un produit est de 10fcfa."]
  },
  prixPromo: {
    type: Number,
    required: false,
    min: [0, "Le minimum de la reduction d'un produit est de 0fcfa."],
    default: 0
  },
  prixf: {
    type: Number,
    required: false,
    min: [0, "Le minimum de la reduction d'un produit est de 0fcfa."],
    default: 0
  },
  description: {
    type: String,
    required: true,
    minlength: [20, "La description d'un produit doit comporter au moins 20 caractères."]
  },
  dateCreating: {
    type: Date,
    default: Date.now,
    required: false
  },
  variants: [variantSchema],
  ClefType: {
    type: String,
    required: [true, "Un produit doit comporter la clef du type de produits auquel il appartient."]
  },
  Clefournisseur: {
    type: String,
    required: [true, "Un produit doit comporter la clef de son fournisseur."]
  },
  prixLivraison: {
    type: Number,
    required: false,
    default: 0
  },
  pictures: {
    type: [String],
    required: false,
    validate: {
      validator: function(urls) {
        if (!urls || urls.length === 0) return true;
        const urlRegex = /^(http|https):\/\/\S+$/;
        return urls.every(url => urlRegex.test(url));
      },
      message: "Veuillez fournir des URLs d'images valides."
    }
  }
}, { strict: false });

export default mongoose.model("Produit", produitSchema);