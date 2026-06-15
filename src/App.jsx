import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom"

import Navbar from "./components/navbar/navbar"

import logo from "../src/assets/Logo/logo.webp"

import Landing from "./pages/landing"

// import Products from "./pages/products.jsx"
// import ProductDetail from "./pages/productDetail"
// import Cart from "./pages/cart"
// import Checkout from "./pages/Checkout"
// import About from "./pages/About"
// import Contact from "./pages/contact"
// import NotFound from "./pages/notFound"

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-100">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6">
        <div className="mx-auto p-6">
          <Outlet />
        </div>
      </main>

      <footer className="">
        <div className="max-w-7xl mx-auto px-4 py-1 text-sm text-center text-neutral-400">
          © {new Date().getFullYear()} Valux Deco. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/Valux" element={<Landing />} />
          {/* <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
