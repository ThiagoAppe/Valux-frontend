import { Link } from "react-router-dom";
import {
  House,
  BookOpen,
  Grid2x2,
} from "lucide-react";
import { FiShoppingCart, FiUser } from "react-icons/fi";


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
hover:w-40
w-12
h-12
px-3
hover:from-gray-100/45
hover:to-gray-400/30
hover:shadow-lg
`;

const Navbar = () => {
  return (
    <nav className="w-full flex">
      <div className="mx-auto flex max-w-screen-xl justify-end p-6 gap-2">
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

        <Link to="/categorias" className={BubbleIcon}>
          <Grid2x2 size={22} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap opacity-0 max-w-0 overflow-hidden transition-all duration-600 group-hover:max-w-24 group-hover:opacity-100">
            Categorías
          </span>
        </Link>

        <Link to="/carrito" className={BubbleIcon}>
          <FiShoppingCart className="shrink-0" size={22} />
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