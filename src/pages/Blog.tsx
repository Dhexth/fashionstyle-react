import React from "react";
import { Link } from "react-router-dom";

const posts = [
  { slug: "tendencias-verano-2024", title: "Tendencias de Verano 2024", date: "15 Marzo 2024", excerpt: "Descubre las prendas, colores y estilos que dominarán esta temporada de verano. Desde los tonos vibrantes hasta los cortes innovadores, te contamos todo lo que necesitas saber para estar a la moda." },
  { slug: "guia-combinar-colores", title: "Cómo Combinar Colores", date: "8 Marzo 2024", excerpt: "Aprende los principios básicos de la teoría del color y cómo aplicarlos a tu guardarropa. Crear outfits armoniosos nunca fue tan fácil con nuestra guía práctica." }
];

export default function Blog() {
  return (
    <div>
      <h2>Blog</h2>
      <div className="row mt-3">
        {posts.map(p => (
          <div key={p.slug} className="col-md-6 mb-3">
            <div className="card p-3 h-100">
              <h5>{p.title}</h5>
              <small className="text-muted">{p.date}</small>
              <p className="mt-2">{p.excerpt}</p>
              <Link to={`/blog/${p.slug}`} className="btn btn-link p-0">Leer más →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
