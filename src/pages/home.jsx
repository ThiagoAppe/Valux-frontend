import { Link } from "react-router-dom"

import Macetas from "../assets/Productos/Macetas/Macetas 1.webp"

import categorias from "../assets/Productos/categorias.json"




import ProductCarousel from "../components/ui/carouselImg/carousel"

import Carousel1 from "../assets/Productos/Carousel/1.png"
import Carousel2 from "../assets/Productos/Carousel/2.png"
import Carousel3 from "../assets/Productos/Carousel/3.png"
import Carousel4 from "../assets/Productos/Carousel/4.png"
import Carousel5 from "../assets/Productos/Carousel/5.jpg"
import Carousel6 from "../assets/Productos/Carousel/6.jpg"
import Carousel7 from "../assets/Productos/Carousel/7.jpg"
import Carousel8 from "../assets/Productos/Carousel/8.jpg"
import Carousel9 from "../assets/Productos/Carousel/9.jpg"
import Carousel10 from "../assets/Productos/Carousel/10.jpg"
import Carousel11 from "../assets/Productos/Carousel/11.jpg"
import Carousel12 from "../assets/Productos/Carousel/12.jpg"
import Carousel13 from "../assets/Productos/Carousel/13.jpg"
import Carousel14 from "../assets/Productos/Carousel/14.jpg"
import Carousel15 from "../assets/Productos/Carousel/15.jpg"
import Carousel16 from "../assets/Productos/Carousel/16.jpg"

const images = [
  Carousel1,
  Carousel2,
  Carousel3,
  Carousel4,
  Carousel5,
  Carousel6,
  Carousel7,
  Carousel8,
  Carousel9,
  Carousel10,
  Carousel11,
  Carousel12,
  Carousel13,
  Carousel14,
  Carousel15,
  Carousel16,
]

const Home = () => {
  return (
    <div className="space-y-6">
      <section
        className="relative bg-neutral-900 rounded-2xl shadow-lg p-12 text-center bg-cover bg-center bg-[position:50%_20%]"
        style={{ backgroundImage: `url(${Macetas})` }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-2xl" />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
            Decoración que transforma espacios
          </h1>

          <p className="text-white max-w-2xl mx-auto mb-8">
            Descubrí piezas únicas para darle personalidad y estilo a tu hogar.
          </p>

          <Link
            to="/products"
            className="inline-block bg-white text-neutral-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition"
          >
            Ver productos
          </Link>
        </div>
      </section>


      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white">
          Categorías destacadas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/products/${categoria.ruta}`}
              className="block bg-neutral-900 rounded-2xl shadow p-6 hover:bg-neutral-800 transition"
            >
              <h3 className="text-lg font-medium mb-2 text-white">
                {categoria.nombre}
              </h3>

              <p className="text-sm text-neutral-400">
                {categoria.descripcion}
              </p>
            </Link>
          ))}

        </div>
      </section>

      <section>
      <ProductCarousel images={images} />
      </section>

    </div>
  )
}

export default Home