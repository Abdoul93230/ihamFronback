import React, { useEffect, useState } from 'react';
import { Package, Upload, X, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ProductVariantForm from '../components/ProductVariantForm';

const BackendUrl = "http://localhost:8080";

interface Variant {
  id: string;
  color: string;
  colorName: string;
  sizes: string[];
  imageUrl: string;
  imageFile?: File;
}

export default function AddProduct() {
  // ... (rest of the state declarations remain the same)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Ajouter les images principales
      Object.entries(mainImages).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      // Ajouter les images additionnelles
      additionalImages.forEach(file => {
        formData.append('nouveauChampImages', file);
      });

      // Ajouter les images des variantes
      variants.forEach(variant => {
        if (variant.imageFile) {
          formData.append('variantImages', variant.imageFile);
        }
      });

      // Ajouter les données du produit
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Préparer les variantes pour l'envoi
      const variantsForSubmission = variants.map(variant => ({
        ...variant,
        imageFile: variant.imageFile ? {
          name: variant.imageFile.name,
          type: variant.imageFile.type,
        } : undefined,
      }));

      formData.append('variants', JSON.stringify(variantsForSubmission));

      const response = await axios.post(`${BackendUrl}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      
      // Réinitialiser le formulaire
      setProductData({
        name: '',
        description: '',
        price: '',
        pricePromo: '0',
        priceSuplier: '0',
        quantity: '',
        brand: '',
        supplier: '',
        type: '',
        deliveryPrice: '0',
      });
      setVariants([]);
      setMainImages({ image1: null, image2: null, image3: null });
      setAdditionalImages([]);
      setPreview({ current: '', images: [] });

    } catch (error) {
      toast.error('Erreur lors de la création du produit');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the component remains the same)
}