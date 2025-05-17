export function Modal({ id, titleModal, children }) {
  return (
    <>
      {/* Button trigger modal  */}

      {/* Modal  */}
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={id}>
                { titleModal }
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              { children }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ButtomModal({ id }) {
  return (
    <button
      type="button"
      className="btn btn-info traslation"
      data-bs-toggle="modal"
      data-bs-target={`#${id}`}
    >
      <i className="fa-regular fa-circle-question"></i>
    </button>
  );
}


export default Modal;
