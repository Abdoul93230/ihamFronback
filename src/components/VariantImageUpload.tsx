import React from 'react';
import { Upload } from 'lucide-react';

interface VariantImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

const VariantImageUpload: React.FC<VariantImageUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image de la variante
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Aperçu de la variante"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Cliquez pour ajouter une image</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default VariantImageUpload;