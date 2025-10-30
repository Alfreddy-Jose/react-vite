import React, { useState, useEffect } from "react";
import "../styles/ScrollToTopButton.css"; // Opcional: para los estilos

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para verificar si hay scroll y mostrar/ocultar el botón
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      // Aparece después de 300px de scroll
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función para hacer scroll suave hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Agregar el event listener cuando el componente se monta
    window.addEventListener("scroll", toggleVisibility);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top-container">
      {isVisible && (
        <button
          className="scroll-to-top-button"
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
