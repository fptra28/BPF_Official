import Link from 'next/link';

export type CareerCardProps = {
  posisi: string;
  nama_kota: string;
  created_at?: string | Date;
  email?: string; // optional for apply action via mailto
  slug?: string; // optional for detail link
  onApplyClick?: () => void;
  onDetailClick?: () => void;
  disabled?: boolean;
};

export default function CareerCard({
  posisi,
  nama_kota,
  created_at,
  email,
  slug,
  onApplyClick,
  onDetailClick,
  disabled = false,
}: CareerCardProps) {
  const createdLabel = created_at
    ? new Date(created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  const isInteractive = !disabled && (onApplyClick || email || onDetailClick || slug);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{posisi}</h3>
          <p className="text-sm text-gray-600">{nama_kota}</p>
        </div>
      </div>

      {createdLabel && (
        <div className="mt-3 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Dibuat:</span> {createdLabel}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onApplyClick ? (
            <button
              onClick={onApplyClick}
              className="px-3 py-2 text-sm rounded-md bg-[#080031] text-white hover:bg-[#0a0045] transition-colors disabled:opacity-60"
              disabled={!isInteractive}
            >
              Kirim Lamaran
            </button>
          ) : email ? (
            <a
              href={`mailto:${email}`}
              className="px-3 py-2 text-sm rounded-md bg-[#080031] text-white hover:bg-[#0a0045] transition-colors"
            >
              Kirim Lamaran
            </a>
          ) : (
            <button
              className="px-3 py-2 text-sm rounded-md bg-[#080031] text-white opacity-60 cursor-not-allowed"
              disabled
            >
              Kirim Lamaran
            </button>
          )}

          {onDetailClick ? (
            <button
              onClick={onDetailClick}
              className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
              disabled={!isInteractive}
            >
              Detail
            </button>
          ) : slug ? (
            <Link
              href={`/karier/${slug}`}
              className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Detail
            </Link>
          ) : (
            <button
              className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-500 opacity-60 cursor-not-allowed"
              disabled
            >
              Detail
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
