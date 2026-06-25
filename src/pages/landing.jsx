import { Link } from "react-router-dom"
import Hero from "../components/landing/hero"
import Categories from "../components/landing/categories/Categories"

const Landing = () => {
  return (
    <div>
      <section>
        <div className="min-h-dvh" >
          <Hero />
        </div>
        <Categories />
      </section>
    </div>
  )
}

export default Landing