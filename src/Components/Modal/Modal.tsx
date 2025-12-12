import './Modal.css';

interface ModalProps {
    children: React.ReactNode;
    viewModal: boolean;
    hideModal:() => void;
    
}
export default function Modal({children, viewModal, hideModal}:ModalProps){
    const modalStyle:React.CSSProperties = {
        width:'100%',
        height: '100vh',
        background: "rgba(0, 0, 0, 0.568)",
        position: "absolute",
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: viewModal ? 100 : -100,
        opacity: viewModal ? 1 : 0 ,
    }
    return(
        <div className="modal-wrapper" style={modalStyle} onClick={hideModal}>
            <div className="modal-container">
                <p>{children}</p>
            </div>
        </div>

    )
}