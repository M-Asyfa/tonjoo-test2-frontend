'use client';
import { useEffect, useState } from "react";
import API from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useDebounce} from "use-debounce";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Failed to load transactions", err));
  }, []);

  const router = useRouter();

  const handleEdit = (transactionId) => {
    router.push(`/transactions/edit/${transactionId}`);
  };

  const handleDelete = async (transactionId) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!confirmed) return;

    try {
      await API.delete(`/transactions/${transactionId}`);
      alert("Deleted successfully!");
      // Optionally reload data:
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete transaction.");
    }
  };

  const [categories, setCategories] = useState([]); // load from /api/categories

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    category: '',
    search: '',
  });

  const [searchInput, setSearchInput] = useState(''); // input box only

  // const [debouncedSearch] = useDebounce(searchInput, 500);

  // useEffect(() => {
  //   setFilters(prev => ({ ...prev, search: debouncedSearch }));
  // }, [debouncedSearch]);

  useEffect(() => {
    API.get('/categories').then(res => setCategories(res.data));
  }, []);

  let rowNumber = 1; // Initialize row number for transaction details

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">List Data Transaksi</h1>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500">Tidak ada transaksi.</p>
      ) : (
        <div className="">
          <div className="bg-white border shadow p-4">
            <div className="flex justify-end mb-6">
              <div className="flex flex-wrap items-end gap-4">
                {/* Date Filter */}
                <div>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={e => setFilters({ ...filters, start_date: e.target.value })}
                    className="border rounded p-2"
                  />
                  <span className="self-center text-black">to</span>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={e => setFilters({ ...filters, end_date: e.target.value })}
                    className="border rounded p-2 w-44"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}
                    className="border rounded p-2 w-44 text-gray-100"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Search */}
                <div className="flex items-end gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setFilters(prev => ({ ...prev, search: searchInput }));
                        }
                      }}
                      className="border rounded p-2 w-30"
                    />
                  </div>
                  <button
                    onClick={() => setFilters({ ...filters, search: searchInput })}
                    className="mb-1 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Cari
                  </button>
                </div>
              </div>
            </div>

            <Link href="/transactions/create">
              <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                + Tambah Transaksi
              </button>
            </Link>

            {/* Transaction Details Table */}
            <table className="w-full text-sm border shadow">
              <thead className="bg-gray-300 text-gray-900 font-semibold">
                <tr>
                  <th className="p-2 text-center">No.</th>
                  <th className="p-2 text-center">Deskripsi</th>
                  <th className="p-2 text-center">Kode</th>
                  <th className="p-2 text-center">Rate Euro</th>
                  <th className="p-2 text-center">Tanggal Pembayaran</th>
                  
                  <th className="p-2 text-center">Kategori</th>
                  <th className="p-2 text-center">Nama Transaksi</th>
                  <th className="p-2 text-center">Nominal (IDR)</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
            
              <tbody>
                {transactions.flatMap((tx) =>
                  tx.details
                    .filter(detail => {
                      const txDate = new Date(tx.date_paid);
                      const start = filters.start_date ? new Date(filters.start_date) : null;
                      const end = filters.end_date ? new Date(filters.end_date) : null;

                      const matchDate =
                        (!start || txDate >= start) &&
                        (!end || txDate <= end);

                      const matchCategory =
                        !filters.category || detail.category?.name === filters.category;

                      const search = filters.search.toLowerCase();
                      const matchSearch =
                        !filters.search ||
                        detail.name.toLowerCase().includes(search) ||
                        tx.description.toLowerCase().includes(search) ||
                        tx.code.toLowerCase().includes(search);

                      return matchDate && matchCategory && matchSearch;
                    })
                    .map((detail) => (
                      <tr key={`${tx.id}-${rowNumber}`} className="border-b hover:bg-gray-100 text-gray-900">
                        <td className="p-2 text-center">{rowNumber++}</td>
                        <td className="p-2 text-center">{tx.description}</td>
                        <td className="p-2 text-center">{tx.code}</td>
                        <td className="p-2 text-center">{new Intl.NumberFormat('eu-EU').format(tx.rate_euro)}</td>
                        <td className="p-2 text-center">{new Intl.DateTimeFormat('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: '2-digit'
                          }).format(new Date(tx.date_paid))}</td>
                        <td className="p-2 text-center">{detail.category?.name}</td>
                        <td className="p-2 text-center">{detail.name}</td>
                        <td className="p-2 text-center">
                          {new Intl.NumberFormat('id-ID').format(detail.amount)}
                        </td>
                        <td className="p-2 text-center space-x-2 flex justify-end">
                            <button
                              title="Delete" className="text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(tx.id)}
                            >
                              🗑️
                            </button>
                            <button
                              title="Edit" className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(tx.id)}
                            >
                              ✏️
                            </button>
                        </td>
                      </tr>
                    ))
                )}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}