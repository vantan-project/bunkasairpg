type Props = {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

export function Modal({ onClose, onConfirm, title }: Props) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-black whitespace-pre-wrap">{title}</div>
        <div className="flex gap-8 justify-center">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded"
            onClick={onConfirm}
          >
            はい
          </button>
          <button className="bg-gray-300 px-5 py-2 rounded" onClick={onClose}>
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
}
