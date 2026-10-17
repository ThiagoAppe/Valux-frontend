import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import About from "./pages/about";
import NotFound from "./pages/notFound";

import Landing from "./pages/landing/landing";
import Catalog from "./pages/catalog/catalogMain";
import Product from "./pages/product/productMain";
import Categories from "./pages/categories/categoriesMain";
import Footer from "./components/footer/footer";
import CartMain from "./pages/cart/cartMain";
import PaymentResultMain from "./pages/checkout/paymentResultMain";
import ShippingQuoteMain from "./pages/checkout/shippingQuoteMain";
import ProfileMain from "./pages/profile/profileMain";
import PanelMain from "./pages/panel/panelMain";
import AdminProductsMain from "./pages/panel/adminProductsMain";
import AdminCategoriesMain from "./pages/panel/adminCategoriesMain";
import CatalogConfigurationMain from "./pages/panel/catalogConfigurationMain";
import { CartProvider } from "./context/cartContext";
import AuthProvider from "./context/authProvider";


const MainLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-neutral-100 overflow-hidden">
      <Navbar/>

      <main className="flex-1 flex w-full">
        <div className="px-4 w-full">
          <Outlet />
        </div>
      </main>

      <Footer className="mt-10" />
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:slug" element={<Product />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/carrito" element={<CartMain />} />
              <Route path="/checkout/envio" element={<ShippingQuoteMain />} />
              <Route path="/pago/resultado" element={<PaymentResultMain />} />
              <Route path="/perfil" element={<ProfileMain />} />
              <Route path="/panel" element={<PanelMain />} />
              <Route path="/panel/productos" element={<AdminProductsMain />} />
              <Route path="/panel/configuracion-catalogo" element={<CatalogConfigurationMain />} />
              <Route path="/panel/categorias" element={<AdminCategoriesMain />} />
              <Route path="/panel/tipos-variantes" element={<AdminProductsMain variantTypesOnly />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
