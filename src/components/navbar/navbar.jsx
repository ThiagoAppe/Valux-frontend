import { useState } from "react"
import { Link } from "react-router-dom"

import ValuxLogo from "../../assets/Logo/Logo Blanco Fondo Transparente.webp"


const Navbar = () => {
  const [menu_open, set_menu_open] = useState(false)
  const [dropdown_open, set_dropdown_open] = useState(false)

  return (
    <nav className="bg-neutral-900 w-full z-20 top-0 border-b border-neutral-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={ValuxLogo}
            className="h-10"
            alt="Logo"
          />
          {/* <span className="self-center text-xl font-semibold text-white">
            Valux Deco
          </span> */}
        </Link>

        <button
          onClick={() => set_menu_open(!menu_open)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-300 rounded md:hidden hover:bg-neutral-800"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        </button>

        <div
          className={`${menu_open ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium mt-4 md:mt-0 bg-neutral-800 md:bg-transparent rounded md:rounded-none p-4 md:p-0">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white md:p-0 hover:text-neutral-300"
              >
                Inicio
              </Link>
            </li>

            <li className="relative">
              <button
                onClick={() => set_dropdown_open(!dropdown_open)}
                className="flex items-center justify-between w-full py-2 px-3 text-white hover:text-neutral-300 md:p-0"
              >
                Categorias
                <svg
                  className="w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdown_open && (
                <div className="absolute mt-2 w-44 bg-neutral-900 border border-neutral-800 rounded shadow-lg">
                  <ul className="p-2 text-sm text-neutral-300">
                    <li>
                      <Link className="block p-2 rounded hover:bg-neutral-800">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="block p-2 rounded hover:bg-neutral-800">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="block p-2 rounded hover:bg-neutral-800">
                        Earnings
                      </Link>
                    </li>
                    <li>
                      <Link className="block p-2 rounded hover:bg-neutral-800">
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li>
              <Link className="block py-2 px-3 text-white md:p-0 hover:text-neutral-300">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link className="block py-2 px-3 text-white md:p-0 hover:text-neutral-300">
                Precios
              </Link>
            </li>
            <li>
              <Link className="block py-2 px-3 text-white md:p-0 hover:text-neutral-300">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
