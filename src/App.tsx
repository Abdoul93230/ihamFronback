import React from 'react';
import ProductVariantForm from './components/ProductVariantForm';
import AddProduct from "./pages/AddProduct"
import UpdateProduct from "./pages/UpdateProduct"
import {BrowserRouter,Routes,Route,} from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductVariantForm/>} />
          <Route path="/AddProduct" element={<AddProduct/>} />
          <Route path="/UpdateProduct/:id" element={<UpdateProduct/>} />
        </Routes>
      </BrowserRouter>
      {/* <UpdateProduct /> */}
    </div>
  );
}

export default App;