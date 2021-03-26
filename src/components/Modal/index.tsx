import React from 'react';

type ModalProps = {
  message: string,
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Modal: React.FC<ModalProps> = ({message, onClose}) => (
  <>
    <div className="modal d-block" onClick={(event) => onClose(event)}>
      <div className="modal-dialog" >
        <div className="modal-content">
          <div className="modal-body">
              <h5>{message}</h5>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary close">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
    <div className={`modal-backdrop`} style={{ opacity: .7, zIndex: -1 }}></div>
  </>
)