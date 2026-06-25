import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";

const categories = [
{ name: "Veladores", image: "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/6096835d8_generated_6f8a22d6.png" },
{ name: "Lámparas Colgantes", image: "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/7f09c82b5_generated_505cf96b.png" },
{ name: "Macetas", image: "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/de188ad4b_generated_77d5991f.png" },
{ name: "Accesorios del Hogar", image: "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/55e1103c5_generated_088573ab.png" },
{ name: "Muebles", image: "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/c4cc4879c_generated_553af7ec.png" }];


export default function Categories() {
  return (
    <section id="categorias" className="text-black py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          
          <p className="mb-3 text-xl font-bold uppercase tracking-[0.25em]">COLECCIONES

          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Nuestras Categorías
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) =>
          <CategoryCard key={cat.name} name={cat.name} image={cat.image} index={i} />
          )}
        </div>
      </div>
    </section>);

}