export function CmsStatus({ status, error }: { status?: string; error?: string }) {
  if (!status && !error) return null;
  const messages: Record<string,string> = { initialized:"CMS diinisialisasi dari frontend yang sedang aktif.", published:"Draft dipublikasikan dan cache frontend diinvalidasi.", saved:"Draft CMS tersimpan. Publikasikan ketika siap.", archived:"Guide dihapus dari draft." };
  const errors: Record<string,string> = { service:"CMS backend tidak dapat menyelesaikan permintaan.", validation:"Periksa field, media, section order, dan nilai yang wajib diisi." };
  return <div role="status" className={`border-l-2 px-5 py-4 text-sm ${error ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]" : "border-olive bg-[#dfe9df] text-[#31533b]"}`}>{error ? errors[error] ?? "Perubahan tidak dapat disimpan." : messages[status ?? ""] ?? "Perubahan selesai."}</div>;
}
