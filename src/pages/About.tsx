import { useState } from 'react';

// Componente para cada miembro del equipo con manejo de errores
interface TeamMemberProps {
  imageSrc: string;
  alt: string;
  name: string;
  position: string;
  fallbackInitials?: string;
}

function TeamMember({ imageSrc, alt, name, position, fallbackInitials }: TeamMemberProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto mb-6 overflow-hidden rounded-full border-4 border-gray-100 shadow-lg">
        {!imageError ? (
          <img 
            src={imageSrc} 
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-2xl font-bold">{fallbackInitials}</span>
          </div>
        )}
      </div>
      <h4 className="text-2xl font-bold text-gray-800 mb-2">{name}</h4>
      <div className="w-20 h-1 bg-blue-500 mx-auto mb-3"></div>
      <p className="text-lg text-gray-600 font-medium">{position}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-8 text-center">Sobre Nosotros</h2>
      
      <section className="mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800">Nuestra Historia</h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          FashionStyle nació en 2020 con la visión de revolucionar la industria de la moda, 
          ofreciendo prendas de alta calidad a precios accesibles. Desde nuestros humildes 
          comienzos, hemos crecido hasta convertirnos en una de las tiendas de moda online 
          más confiables del mercado.
        </p>
      </section>

      <div className="border-t border-gray-200 my-12"></div>

      <section className="mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800">Nuestra Misión</h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          Creemos que la moda debe ser accesible para todos. Nuestra misión es empoderar 
          a las personas para que expresen su estilo único a través de prendas que combinan 
          calidad, tendencia y precio justo.
        </p>
      </section>

      <section className="mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800">Nuestros Valores</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
          <li className="pb-2 border-b border-gray-100">
            <strong className="text-blue-600">Calidad:</strong> Seleccionamos cuidadosamente cada prenda para 
            garantizar durabilidad y comodidad.
          </li>
          <li className="pb-2 border-b border-gray-100">
            <strong className="text-green-600">Sostenibilidad:</strong> Trabajamos con proveedores que comparten 
            nuestro compromiso con el medio ambiente.
          </li>
          <li className="pb-2 border-b border-gray-100">
            <strong className="text-purple-600">Innovación:</strong> Siempre a la vanguardia de las últimas 
            tendencias de moda.
          </li>
          <li>
            <strong className="text-orange-600">Servicio:</strong> Nuestros clientes son nuestra prioridad número uno.
          </li>
        </ul>
      </section>

      <div className="border-t border-gray-200 my-12"></div>

      <section className="bg-gray-50 rounded-2xl p-12">
        <h3 className="text-3xl font-bold mb-12 text-center text-gray-800">Nuestro Equipo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <TeamMember
            imageSrc="/images/team/ceo.jpg"
            alt="Carlos Rodríguez - CEO & Fundador"
            name="Carlos Rodríguez"
            position="CEO & Fundador"
            fallbackInitials="CR"
          />
          <TeamMember
            imageSrc="/images/team/disenadora.jpg"
            alt="Ana Martinez - Directora de Diseño"
            name="Ana Martinez"
            position="Directora de Diseño"
            fallbackInitials="AM"
          />
          <TeamMember
            imageSrc="/images/team/marketing.j.avif"
            alt="David López - Director de Marketing"
            name="David López"
            position="Director de Marketing"
            fallbackInitials="DL"
          />
        </div>
      </section>
    </div>
  );
}