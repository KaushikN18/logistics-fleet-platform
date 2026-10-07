import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FiAlertCircle size={28} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">
          Unable to load data
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <FiRefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;