import { useState } from 'react';

export type ApplyFormValues = {
  fullName: string;
  phone: string;
  email: string;
  cvFile?: File | null;
  experienceLength: string;
  noticePeriod: string;
  source: string;
  motivation: string;
  agreed: boolean;
};

export default function ApplyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: ApplyFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ApplyFormValues>({
    fullName: '',
    phone: '',
    email: '',
    cvFile: null,
    experienceLength: '',
    noticePeriod: '',
    source: '',
    motivation: '',
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Only PDF and max 5MB
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isSizeOk = file.size <= 5 * 1024 * 1024;
      if (!isPdf) {
        alert('Harap unggah file PDF.');
        e.currentTarget.value = '';
        setValues((prev) => ({ ...prev, cvFile: null }));
        return;
      }
      if (!isSizeOk) {
        alert('Ukuran file melebihi 5MB.');
        e.currentTarget.value = '';
        setValues((prev) => ({ ...prev, cvFile: null }));
        return;
      }
    }
    setValues((prev) => ({ ...prev, cvFile: file }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
          <input
            name="phone"
            type="tel"
            required
            value={values.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
          <input
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4C4C4C] mb-1">
            Unggah CV (PDF, max 5MB) <span className="text-red-500">*</span>
          </label>
          <div className="flex mt-1">
            <label className="inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#F2AC59] focus:border-[#F2AC59] cursor-pointer">
              Pilih File
              <input
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </label>
            <div className="flex-1 min-w-0">
              <div className="relative px-3 py-2 h-10 border border-gray-300 rounded-r-md border-l-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500 bg-white">
                {values.cvFile ? values.cvFile.name : 'Tidak ada file dipilih'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berapa lama pengalaman Anda di posisi ini?</label>
          <input
            name="experienceLength"
            type="text"
            required
            value={values.experienceLength}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berapa lama pemberitahuan kerja Anda?</label>
          <input
            name="noticePeriod"
            type="text"
            required
            value={values.noticePeriod}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dari mana Anda mengetahui lowongan ini?</label>
        <input
          name="source"
          type="text"
          required
          value={values.source}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jelaskan motivasi Anda bergabung dengan PT Rifan Financindo Berjangka</label>
        <textarea
          name="motivation"
          rows={4}
          required
          value={values.motivation}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#080031]"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="agreed"
          name="agreed"
          type="checkbox"
          checked={values.agreed}
          onChange={handleChange}
          className="mt-1 h-4 w-4 text-[#080031] focus:ring-[#080031] border-gray-300 rounded"
          required
        />
        <label htmlFor="agreed" className="text-sm text-gray-700">
          Saya telah membaca dan menyetujui Syarat & Ketentuan dan Kebijakan Privasi
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-md bg-[#080031] text-white hover:bg-[#0a0045]">Kirim Lamaran</button>
      </div>
    </form>
  );
}
