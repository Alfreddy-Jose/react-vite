import React from "react";
import PropTypes from "prop-types";
import "../styles/Stepper.css";

export default function Stepper({
  steps = ["Paso 1", "Paso 2"],
  currentStep = 1,
  contextInfo = {},
}) {
  return (
    <div className="stepper-wrapper-card">
      {/* 🔹 Información de contexto (tarjeta sticky dentro de la tarjeta padre) */}
      {window.location.pathname !== "/horarios/create" && (
        <div className="context-info-card animate-fade-in">
          <div className="info-item">
            <i className="fas fa-book-open icon"></i>
            <div>
              <div className="info-label">PNF</div>
              <div className="info-value">{contextInfo.pnf}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt icon"></i>
            <div>
              <div className="info-label">Sede</div>
              <div className="info-value">{contextInfo.sede}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-hourglass icon"></i>
            <div>
              <div className="info-label">Trayecto</div>
              <div className="info-value">{contextInfo.trayecto}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-clock icon"></i>
            <div>
              <div className="info-label">Trimestre</div>
              <div className="info-value">{contextInfo.trimestre}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-calendar-alt icon"></i>
            <div>
              <div className="info-label">Lapso Académico</div>
              <div className="info-value">{contextInfo.LapsoAcademico}</div>
            </div>
          </div>
        </div>
      )}

      {/* 🔸 Marca pasos */}
      <div className="stepper-container">
        <nav className="stepper" aria-label="Progreso">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <React.Fragment key={idx}>
                <div
                  className="step"
                  role="listitem"
                  aria-current={isActive ? "step" : undefined}
                >
                  <div
                    className={
                      "step-circle " +
                      (isActive ? "active" : "") +
                      (isCompleted ? " completed" : "")
                    }
                  >
                    {stepNum}
                  </div>
                  <div className="step-label">{label}</div>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={
                      "step-connector " + (isCompleted ? "completed" : "")
                    }
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  currentStep: PropTypes.number,
  contextInfo: PropTypes.shape({
    pnf: PropTypes.string,
    sede: PropTypes.string,
    trayecto: PropTypes.string,
    trimestre: PropTypes.string,
  }),
};
