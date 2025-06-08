'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/services/api";

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    description: '',
    code: '',
    rate_euro: '',
    date_paid: '',
    details: [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories
    API.get('/categories').then(res => setCategories(res.data));

    // Fetch transaction data
    API.get(`/transactions/${id}`).then(res => {
      const tx = res.data;
      setForm({
        description: tx.description,
        code: tx.code,
        rate_euro: tx.rate_euro,
        date_paid: tx.date_paid,
        details: tx.details.map(d => ({
          name: d.name,
          amount: d.amount,
          category_id: d.category_id
        })),
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (i, field, value) => {
    const updated = [...form.details];
    updated[i][field] = value;
    setForm({ ...form, details: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/transactions/${id}`, form);
      alert("Transaksi berhasil diupdate!");
      router.push("/transactions");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const addDetail = () => {
    setForm({
      ...form,
      details: [...form.details, { name: "", amount: "", category_id: "" }],
    });
  };

  const removeDetail = (i) => {
    const updated = [...form.details];
    updated.splice(i, 1);
    setForm({ ...form, details: updated });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Data Transaksi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="rate_euro"
          value={form.rate_euro}
          onChange={handleChange}
          placeholder="Rate Euro"
          type="number"
          step="0.01"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="date_paid"
          value={form.date_paid}
          onChange={handleChange}
          type="date"
          className="w-full border p-2 rounded"
          required
        />

        <h2 className="text-lg font-semibold mt-6">Data Transaksi</h2>
        {form.details.map((detail, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 items-center border p-2 rounded">
            <select
              value={detail.category_id}
              onChange={e => handleDetailChange(i, 'category_id', e.target.value)}
              className="border p-2 rounded w-full md:w-1/3"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              value={detail.name}
              onChange={e => handleDetailChange(i, 'name', e.target.value)}
              placeholder="Name"
              className="border p-2 rounded w-full md:w-1/3"
              required
            />
            <input
              value={detail.amount}
              onChange={e => handleDetailChange(i, 'amount', e.target.value)}
              placeholder="Amount"
              type="number"
              step="0.01"
              className="border p-2 rounded w-full md:w-1/4"
              required
            />
            <button
              type="button"
              onClick={() => removeDetail(i)}
              className="text-red-600 hover:underline mt-2 md:mt-0"
            >
              Hapus
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addDetail}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Tambah
        </button>

        <div className="flex justify-end gap-4 mt-6">
            <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            >
                Update
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