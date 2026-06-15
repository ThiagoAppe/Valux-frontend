import { useState } from "react"
import { Link } from "react-router-dom"
import ValuxLogo from "../../assets/Logo/Logo Blanco Fondo Transparente.webp"

import { FiShoppingCart, FiUser } from "react-icons/fi"

const Navbar = () => {
  const [DropdownOpen, SetDropdownOpen] = useState(false)

  return (
    <nav className="w-full border-b bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">

        <Link to="/" className="flex items-center">
          <img src={ValuxLogo} className="h-9" />
        </Link>

        <div className="flex items-center gap-6">
          <Link className="font-light tracking-wide text-white/70 transition hover:text-white">
            Inicio
          </Link>

          <div className="relative">
            <button
              onClick={() => SetDropdownOpen(!DropdownOpen)}
              className="font-light tracking-wide text-white/70 transition hover:text-white"
            >
              Categorías
            </button>

            {DropdownOpen && (
              <div className="absolute mt-3 w-44 rounded-md border border-white/10 bg-black/10 backdrop-blur-sm">
                <Link className="block px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white">
                  Categoría 1
                </Link>

                <Link className="block px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white">
                  Categoría 2
                </Link>
              </div>
            )}
          </div>

          <Link className="font-light tracking-wide text-white/70 transition hover:text-white">
            Catálogo
          </Link>

          <Link className="font-light tracking-wide text-white/70 transition hover:text-white">
            Sobre nosotros
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white">
            <FiShoppingCart size={22} />
          </Link>

          <Link className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white">
            <FiUser size={22} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar