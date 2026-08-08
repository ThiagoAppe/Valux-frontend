import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import logo from "../src/assets/Logo/logo.webp";

import Landing from "./pages/landing";

import Catalog from "./pages/catalog/catalogMain";

import Product from "./pages/product/productMain";

import Categories from "./pages/categories/categoriesMain";

import About from "./pages/about";

// import Products from "./pages/products.jsx"

// import Cart from "./pages/cart"
// import Checkout from "./pages/Checkout"
// import About from "./pages/About"
// import Contact from "./pages/contact"
import NotFound from "./pages/notFound"

const MainLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-neutral-100 overflow-hidden">
      <Navbar />

      <main className="flex-1 flex">
        <div className="flex-1 w-full px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer>
        <div className="mx-auto px-4 py-1 text-sm text-center text-neutral-400">
          © {new Date().getFullYear()} Valux Deco. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:slug" element={<Product />} />
                    <Route path="/categories" element={<Categories />} />
                    
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
