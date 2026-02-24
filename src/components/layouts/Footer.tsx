export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600">
        © {new Date().getFullYear()} airbnb-lite — Demo UI
      </div>
    </footer>
  );
}
