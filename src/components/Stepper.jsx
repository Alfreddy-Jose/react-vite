import React from "react";
import PropTypes from "prop-types";
import "../styles/Stepper.css";

export default function Stepper({
  steps = ["Paso 1", "Paso 2"],
  currentStep = 1,
}) {
  return (
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
                className={"step-connector " + (isCompleted ? "completed" : "")}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  currentStep: PropTypes.number,
};
