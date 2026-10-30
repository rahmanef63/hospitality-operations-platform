export function StatusBanner({ status, error }: { status?: string; error?: string }) {
  if (!status && !error) return null;
  return (
    <div
      role="status"
      className={`border-l-2 px-5 py-4 text-sm leading-6 ${
        error
          ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]"
          : "border-olive bg-[#dfe9df] text-[#31533b]"
      }`}
    >
      {error ? "Perubahan tidak dapat disimpan. Periksa data lalu coba kembali." : "Perubahan tersimpan di Convex Cloud."}
    </div>
  );
}
