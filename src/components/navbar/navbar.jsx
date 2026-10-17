import { Link } from "react-router-dom";
import { House, BookOpen, Grid2x2, Info } from "lucide-react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useCart } from "../../context/cartContext";

const BubbleIcon = `
group
flex items-center
overflow-hidden
rounded-xl
border border-gray-200
bg-white/80
backdrop-blur-xl
text-gray-800
shadow-md
hover:bg-white
hover:shadow-lg
transition-all duration-500
hover:w-56
w-12
h-12
px-3
hover:from-gray-100/45
hover:to-gray-400/30
hover:shadow-lg
`;

const Navbar = () => {
  const { itemCount } = useCart();

  return (
    <nav className="w-full flex mb-2">
      <div className="mx-auto flex max-w-7xl p-2 gap-2">
        <Link to="/" className={BubbleIcon}>
          <House size={22} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap opacity-0 max-w-0 overflow-hidden transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Inicio
          </span>
        </Link>

        <Link to="/catalog" className={BubbleIcon}>
          <BookOpen size={22} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap opacity-0 max-w-0 overflow-hidden transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Catálogo
          </span>
        </Link>

        <Link to="/categories" className={BubbleIcon}>
          <Grid2x2 size={22} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap opacity-0 max-w-0 overflow-hidden transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Categorías
          </span>
        </Link>

        <Link to="/about" className={BubbleIcon}>
          <Info size={22} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap opacity-0 max-w-0 overflow-hidden transition-all duration-600 group-hover:max-w-35 group-hover:opacity-100">
            Sobre nosotros
          </span>
        </Link>

        <Link to="/carrito" aria-label={`Carrito${itemCount ? `, ${itemCount} productos` : ""}`} className={`${BubbleIcon} relative`}>
          <FiShoppingCart className="shrink-0" size={22} />
          {itemCount > 0 && <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">{itemCount > 99 ? "99+" : itemCount}</span>}
          <span className="ml-3 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Carrito
          </span>
        </Link>

        <Link to="/perfil" className={BubbleIcon}>
          <FiUser className="shrink-0" size={22} />
          <span className="ml-3 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Perfil
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
