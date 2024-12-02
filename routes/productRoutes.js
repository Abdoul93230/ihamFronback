import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts
} from '../controllers/ProductController.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'variantImages', maxCount: 10 },
  { name: 'nouveauChampImages', maxCount: 10 }
]);

router.post('/product', uploadFields, createProduct);
router.put('/product/:productId', uploadFields, updateProduct);
router.delete('/product/:productId', deleteProduct);
router.get('/product/:productId', getProductById);
router.get('/products', getAllProducts);

export default router;