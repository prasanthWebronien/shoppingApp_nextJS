// components/NoInternet.jsx
export default function NoInternet() {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">No Internet Connection</h1>
          <p className="text-gray-700 text-lg">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }
  