import React, { useEffect, useState } from 'react';
import { Package, Upload, X, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ProductVariantForm from '../components/ProductVariantForm';

//const BackendUrl = process.env.REACT_APP_Backend_Url;
// const BackendUrl = "https://secoure.onrender.com";
const BackendUrl = "http://localhost:8080";

interface Variant {
  id: string;
  color: string;
  colorName: string;
  sizes: string[];
  imageUrl: string;
}

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [mainImages, setMainImages] = useState({
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [preview, setPreview] = useState({
    current: '',
    images: [] as string[],
  });
  const [productData, setProductData] = useState({
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
  
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    // Charger les données initiales
    Promise.all([
      axios.get(`${BackendUrl}/fournisseurs`),
      axios.get(`${BackendUrl}/getAllCategories`),
      axios.get(`${BackendUrl}/getAllType`)
    ]).then(([suppliersRes, categoriesRes, typesRes]) => {
      setSuppliers(suppliersRes.data.data);
      setCategories(categoriesRes.data.data);
      setProductTypes(typesRes.data.data);
    }).catch(error => {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof mainImages) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImages(prev => ({ ...prev, [type]: file }));
      setPreview(prev => ({
        ...prev,
        current: URL.createObjectURL(file),
        images: [...prev.images, URL.createObjectURL(file)],
      }));
    }
  };

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImages(files);
    files.forEach(file => {
      setPreview(prev => ({
        ...prev,
        images: [...prev.images, URL.createObjectURL(file)],
      }));
    });
  };

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

      // Ajouter les données du produit
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Ajouter les variantes
      formData.append('variants', JSON.stringify(variants));

      const response = await axios.post(`${BackendUrl}/product`, formData);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Nouveau Produit</h1>
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section des informations de base */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={e => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={e => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix promotionnel
                </label>
                <input
                  type="number"
                  value={productData.pricePromo}
                  onChange={e => setProductData(prev => ({ ...prev, pricePromo: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  value={productData.quantity}
                  onChange={e => setProductData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Section des variantes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Variantes du produit</h2>
            <ProductVariantForm
              variants={variants}
              setVariants={setVariants}
            />
          </div>

          {/* Section des images */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Images du produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['image1', 'image2', 'image3'].map((key, index) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image principale {index + 1}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      {mainImages[key as keyof typeof mainImages] ? (
                        <img
                          src={URL.createObjectURL(mainImages[key as keyof typeof mainImages]!)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Cliquez pour ajouter</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleImageChange(e, key as keyof typeof mainImages)}
                        accept="image/*"
                        required={!mainImages[key as keyof typeof mainImages]}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images additionnelles
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Cliquez pour ajouter plusieurs images
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAdditionalImages}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section de la description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Description</h2>
            <ReactQuill
              value={productData.description}
              onChange={value => setProductData(prev => ({ ...prev, description: value }))}
              className="h-64 mb-12"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? 'Création en cours...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}