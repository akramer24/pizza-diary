import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, className, title }) => {
  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={unmountModal} />
      <div className="modal-dialog">
        <div className={classNames('modal', { [className]: className })}>
          <div className="modal-header">
            <span className="modal-title">{title}</span>
            <FaTimes className="modal-x" onClick={unmountModal} />
          </div>
          <div className="divider" />
          {children}
        </div>
      </div>
    </div>
  )
}

const unmountModal = () => ReactDOM.unmountComponentAtNode(document.getElementById('modal-root'));

export default Modal;