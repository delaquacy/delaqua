interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <p>Вы хотите перенести бутыл на другой адрес?</p>
      <button onClick={onConfirm}>Да</button>
      <button onClick={onClose}>Нет</button>
    </div>
  );
};
