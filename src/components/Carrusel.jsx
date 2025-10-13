import React from "react";

const CarruselReact = ({
  imagenes = [],
  intervalo = 3000,
  mostrarIndicadores = true,
}) => {
  return (
    <div
      id="carruselReact"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval={intervalo}
    >
      {/* Indicadores dinámicos */}
      {mostrarIndicadores && (
        <div className="carousel-indicators">
          {imagenes.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carruselReact"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
            ></button>
          ))}
        </div>
      )}

      {/* Imágenes dinámicas */}
      <div className="carousel-inner">
        {imagenes.map((imagen, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img src={imagen.url} className="d-block w-100" alt={imagen.alt} />
            {imagen.titulo && (
              <div className="carousel-caption d-none d-md-block">
                <h5>{imagen.titulo}</h5>
                {imagen.descripcion && <p>{imagen.descripcion}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarruselReact;
