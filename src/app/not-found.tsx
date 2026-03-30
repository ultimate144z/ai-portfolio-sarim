export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="mt-2 text-slate-400">Page not found</p>
        <a href="/" className="mt-4 inline-block text-primary hover:underline">
          Go home
        </a>
      </div>
    </div>
  );
}
