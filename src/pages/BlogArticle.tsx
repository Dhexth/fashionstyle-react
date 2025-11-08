import React from "react";
import { useParams, Link } from "react-router-dom";

const content: Record<string, { 
  title: string; 
  date: string; 
  author: string;
  image: string;
  imageAlt: string;
  body: React.ReactNode;
}> = {
  "tendencias-verano-2024": {
    title: "Tendencias de Verano 2024: Lo que viene en moda",
    date: "15 Marzo 2024",
    author: "Por FashionStyle Team",
    image: "/images/blog/blog1.jpg",
    imageAlt: "Tendencias de moda verano 2024",
    body: (
      <>
        <h2>Tendencias que Dominarán el Verano</h2>
        <p>
          Este verano 2024 trae consigo una explosión de colores vibrantes y tejidos ligeros. 
          Las tendencias incluyen maxivestidos fluidos, prendas con estampados tropicales y 
          accesorios oversize. Los tonos coral, amarillo sol y verde menta dominan las pasarelas, 
          mientras que los tejidos naturales como el lino y el algodón orgánico ganan popularidad 
          por su comodidad y sostenibilidad.
        </p>
        
        <h3>Maxivestidos FluidOS</h3>
        <p>
          Los vestidos largos y fluidos en tejidos como la seda y el chiffon dominan las pasarelas. 
          Perfectos para eventos diurnos y noches de verano, ofrecen comodidad sin sacrificar el estilo. 
          Los diseños asimétricos y los cortes con drapeados son los más populares.
        </p>
        
        <h3>Estampados Tropicales</h3>
        <p>
          Flores exuberantes, hojas de palmera y motivos jungle chic invaden las colecciones. 
          Desde blusas hasta pantalones wide-leg, los estampados tropicales añaden un toque de 
          alegría y frescura a cualquier outfit. Combinarlos con prendas lisas en colores neutros 
          es la clave para un look equilibrado.
        </p>
        
        <h3>Accesorios Oversize</h3>
        <p>
          Bolsos de playa grandes, gafas de sol XXL y joyería statement son los accesorios 
          protagonistas. Las piezas oversized añaden personalidad y actitud a looks simples, 
          creando un contraste visual interesante.
        </p>
        
        <h2>Paleta de Colores Estrella</h2>
        <p>
          Los tonos coral, amarillo sol y verde menta serán los protagonistas de la temporada. 
          Estos colores vibrantes reflejan la energía del verano y se complementan perfectamente 
          con accesorios en metálicos dorados y plateados.
        </p>
        
        <h2>Conclusión</h2>
        <p>
          Este verano se trata de expresar personalidad a través del color y la comodidad. 
          Las tendencias 2024 invitan a experimentar con siluetas fluidas, estampados audaces 
          y accesorios que hagan declaración. La clave está en encontrar el balance entre 
          tendencia y estilo personal.
        </p>
      </>
    )
  },
  "guia-combinar-colores": {
    title: "Guía Definitiva: Cómo Combinar Colores en tu Vestuario",
    date: "8 Marzo 2024", 
    author: "Por FashionStyle Team",
    image: "/images/blog/blog2.jpg",
    imageAlt: "Guía para combinar colores en moda",
    body: (
      <>
        <div className="text-center mb-4">
          <h2 className="h3">Guía de Colores</h2>
        </div>

        <h3>Introducción</h3>
        <p>
          Dominar el arte de combinar colores puede transformar completamente tu estilo personal. 
          En esta guía completa, te enseñaremos desde los principios básicos de la teoría del color 
          hasta combinaciones avanzadas que elevarán tu juego de moda.
        </p>

        <h3>Conceptos Básicos de la Teoría del Color</h3>
        
        <h4>El Círculo Cromático</h4>
        <p>
          Tu mejor aliado para combinar colores. Comprende la diferencia entre colores primarios, 
          secundarios y terciarios, y cómo interactúan entre sí para crear armonía visual.
        </p>

        <h4>Colores Cálidos vs. Fríos</h4>
        <p>
          Los colores cálidos (rojos, naranjas, amarillos) transmiten energía y pasión, 
          mientras que los fríos (azules, verdes, violetas) evocan tranquilidad y profesionalismo.
        </p>

        <h3>Combinaciones que Siempre Funcionan</h3>
        
        <h4>Combinación Monocromática</h4>
        <p>
          La opción más segura y elegante. Utiliza diferentes tonos del mismo color para crear 
          un look sofisticado y cohesionado.
        </p>

        <h4>Combinación Análoga</h4>
        <p>
          Colores adyacentes en el círculo cromático que crean transiciones suaves y armoniosas. 
          Perfecta para looks diarios.
        </p>

        <h3>Conclusión</h3>
        <p>
          Combinar colores efectivamente es una habilidad que se desarrolla con práctica y confianza. 
          Comienza con las combinaciones básicas y gradualmente experimenta con paletas más complejas. 
          Recuerda que la moda es una forma de expresión personal, así que diviértete en el proceso.
        </p>
      </>
    )
  },
  "moda-sostenible": {
    title: "Moda Sostenible: Tu Guía para un Armario Responsable",
    date: "1 Marzo 2024",
    author: "Por FashionStyle Team", 
    image: "/images/blog/blog1.jpg",
    imageAlt: "Moda sostenible y responsable con el medio ambiente",
    body: (
      <>
        <h2>¿Por Qué la Moda Sostenible?</h2>
        <p>
          La moda sostenible no es solo una tendencia, es un movimiento necesario. 
          Comienza por elegir calidad sobre cantidad, invirtiendo en prendas duraderas 
          de materiales naturales como algodón orgánico, lino o Tencel. Segunda mano 
          no significa segunda opción: el thrifting puede descubrir piezas únicas 
          mientras reduces tu huella ecológica.
        </p>
        
        <h3>Calidad sobre Cantidad</h3>
        <p>
          Invierte en prendas duraderas de materiales naturales como algodón orgánico, 
          lino o Tencel. Prioriza la artesanía y la confección sobre la producción en masa. 
          Una prenda de calidad bien cuidada puede durar años, reduciendo la necesidad 
          de compras frecuentes.
        </p>
        
        <h3>El Poder del Thrifting</h3>
        <p>
          Segunda mano no significa segunda opción: el thrifting puede descubrir piezas 
          únicas mientras reduces tu huella ecológica. Las tiendas de segunda mano y 
          plataformas de reventa ofrecen oportunidades para encontrar prendas de calidad 
          a precios accesibles, extendiendo el ciclo de vida de la ropa.
        </p>
        
        <h3>Apoyo a Marcas Locales</h3>
        <p>
          Descubre diseñadores locales con prácticas éticas transparentes. Las marcas 
          locales suelen tener mejor control sobre su cadena de suministro y pueden 
          ofrecer mayor transparencia sobre sus procesos de producción. Además, apoyar 
          la economía local fortalece tu comunidad.
        </p>
        
        <h2>Conclusión</h2>
        <p>
          Recuerda: el outfit más sostenible es el que ya tienes en tu armario. 
          La moda consciente no se trata de perfección, sino de progreso. Cada 
          decisión de compra consciente contribuye a un industry más ético y 
          ambientalmente responsable.
        </p>
      </>
    )
  }
};

export default function BlogArticle() {
  const { slug } = useParams();
  const post = slug ? content[slug] : null;

  if (!post) return (
    <div className="container">
      <p>Artículo no encontrado. <Link to="/blog">Volver al blog</Link></p>
    </div>
  );

  return (
    <div className="container">
      <Link to="/blog" className="btn btn-link mb-4">&larr; Volver al blog</Link>
      
      <article className="max-width-800 mx-auto">
        <header className="mb-4">
          {/* Título principal en azul */}
          <h1 className="mb-3 text-primary">{post.title}</h1>
          <p className="text-muted">
            Publicado el {post.date} | {post.author}
          </p>
        </header>
        
        {/* Imagen del artículo */}
        <div className="my-4">
          <img 
            src={post.image} 
            alt={post.imageAlt}
            className="img-fluid rounded shadow-sm"
            style={{ 
              maxHeight: "400px", 
              width: "100%", 
              objectFit: "cover" 
            }}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Imagen+no+disponible";
            }}
          />
          <p className="text-muted small mt-2 text-center">{post.imageAlt}</p>
        </div>
        
        {/* Contenido del artículo - Todos los títulos en azul */}
        <div 
          className="article-content mt-4" 
          style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
        >
          {/* Estilos para aplicar azul a todos los títulos */}
          <style>{`
            .article-content h2,
            .article-content h3,
            .article-content h4 {
              color: #0d6efd !important;
            }
          `}</style>
          {post.body}
        </div>

        {/* Botón para volver */}
        <div className="mt-5 pt-4 border-top">
          <Link to="/blog" className="btn btn-outline-primary">
            &larr; Volver a todos los artículos
          </Link>
        </div>
      </article>
    </div>
  );
}