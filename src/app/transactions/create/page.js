'use client';
import { useState, useEffect } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';

export default function CreateTransactionPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    description: '',
    code: '',
    rate_euro: '',
    date_paid: '',
    details: [
      { category_id: '', name: '', amount: '' }
    ],
  });

  // Load categories
  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  // Add new detail row
  const addDetail = () => {
    setForm(prev => ({
      ...prev,
      details: [...prev.details, { category_id: '', name: '', amount: '' }]
    }));
  };

  // Handle input change
  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      // Update detail row
      const updatedDetails = [...form.details];
      updatedDetails[index][field] = value;
      setForm({ ...form, details: updatedDetails });
    } else {
      // Update header
      setForm({ ...form, [name]: value });
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions', form);
      alert('Transaksi berhasil disimpan!');
      router.push('/transactions');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }

    console.log('Submitting:', form);
  };

  // Remove detail row
  const removeDetail = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== indexToRemove),
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Input Data Transaksi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header fields */}
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="description" value={form.description} onChange={handleChange}
            placeholder="Deskripsi" className="p-2 border rounded" required />
          <input type="text" name="code" value={form.code} onChange={handleChange}
            placeholder="Kode" className="p-2 border rounded" required />
          <input type="number" name="rate_euro" value={form.rate_euro} onChange={handleChange}
            placeholder="Rate Euro" className="p-2 border rounded" required />
          <input type="date" name="date_paid" value={form.date_paid} onChange={handleChange}
            placeholder="Tanggal Pembayaran" className="p-2 border rounded" required />
        </div>

        {/* Details */}
          <h2 className="text-lg font-semibold mb-2">Data Transaksi</h2>
          {form.details.map((detail, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-2 items-center border p-2 rounded">
              <select
                value={detail.category_id}
                onChange={(e) => handleChange(e, idx, 'category_id')}
                className="p-2 border rounded"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
                <input type="text" value={detail.name}
                  onChange={(e) => handleChange(e, idx, 'name')}
                  placeholder="Nama Transaksi" className="p-2 border rounded" required />
                <input type="number" value={detail.amount}
                  onChange={(e) => handleChange(e, idx, 'amount')}
                  placeholder="Nominal (IDR)" className="p-2 border rounded" required />
                <button
                  type="button"
                  onClick={() => removeDetail(idx)}
                  title="Delete"
                  className="text-red-600 hover:underline mt-2 md:mt-0"
                >
                  Hapus
                </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addDetail}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + Tambah
          </button>
        <div className="flex justify-end gap-4 mt-6">
          {/* Submit */}
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Simpan
          </button>
          <button
            type="button"
            onClick={() => router.push("/transactions")}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}