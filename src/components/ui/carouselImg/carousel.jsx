import { useRef, useEffect } from "react"

const ProductCarousel = ({ images }) => {
  const carousel_ref = useRef(null)
  const extended_images = [...images, ...images]

  useEffect(() => {
    const container = carousel_ref.current
    if (!container) return

    const interval = setInterval(() => {
      container.scrollBy({
        left: 1,
        behavior: "smooth",
      })

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const scroll_right = () => {
    const container = carousel_ref.current
    const scroll_amount = container.offsetWidth

    container.scrollBy({
      left: scroll_amount,
      behavior: "smooth",
    })
  }

  const scroll_left = () => {
    const container = carousel_ref.current
    const scroll_amount = container.offsetWidth

    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 2
    }

    container.scrollBy({
      left: -scroll_amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative w-full overflow-hidden">
      <button
        onClick={scroll_left}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black"
      >
        ‹
      </button>

      <div
        ref={carousel_ref}
        className="flex gap-4 overflow-x-auto md:overflow-x-hidden scroll-smooth touch-pan-x"
      >
        {extended_images.map((img, index) => (
          <div
            key={index}
            className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%]"
          >
            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow h-64 flex items-center justify-center">
              <img
                src={img}
                alt={`Producto ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={scroll_right}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black"
      >
        ›
      </button>
    </div>
  )
}

export default ProductCarousel
