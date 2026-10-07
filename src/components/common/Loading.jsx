function Loading({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="text-sm font-medium text-gray-500">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Loading;