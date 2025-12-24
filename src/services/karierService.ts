const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export type KarierItem = {
  id: number;
  nama_kota: string;
  posisi: string;
  slug: string;
  responsibilities: string;
  qualifications: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export async function fetchKarierList(): Promise<KarierItem[]> {
  const res = await fetch(`${BASE_URL}/api/karier`, { next: { revalidate: 60 } as any });
  if (!res.ok) throw new Error('Gagal mengambil daftar karier');
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message || 'Gagal mengambil daftar karier');
  return json.data as KarierItem[];
}

export async function fetchKarierDetail(slug: string): Promise<KarierItem> {
  const res = await fetch(`${BASE_URL}/api/karier/${slug}`);
  if (!res.ok) throw new Error('Gagal mengambil detail karier');
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message || 'Gagal mengambil detail karier');
  return json.data as KarierItem;
}
