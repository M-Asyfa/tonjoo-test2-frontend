'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.id} className="p-3 bg-gray-100 rounded shadow">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}