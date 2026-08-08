import { motion } from "framer-motion";

export default function CategoryCard({ name, image, index }) {
  return (
    <motion.div
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white font-heading text-xl md:text-2xl font-medium tracking-wide text-center px-3">
          {name}
        </h3>
      </div>
    </motion.div>
  );
}