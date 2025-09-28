const DeleteModal = ({
  name,
  onDelete,
  onCancel,
}: {
  name?: string;
  onDelete?: () => void;
  onCancel?: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-red-600">{name}</span>?
          <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
