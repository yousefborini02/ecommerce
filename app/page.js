'use client'

import { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0 })
  const [editingProduct, setEditingProduct] = useState(null)
  const [user, setUser] = useState(null) // State to store user
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user');
        if (res.data.error) {
          router.push('/login');
        } else {
          setUser(res.data.user);
        }
      } catch (error) {
        router.push('/login');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to fetch products', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingProduct) {
      await updateProduct()
    } else {
      await createProduct()
    }
    setNewProduct({ name: '', description: '', price: 0 })
    setEditingProduct(null)
    await fetchProducts()
  }

  const createProduct = async () => {
    try {
      await axios.post('/api/products', newProduct)
    } catch (error) {
      console.error('Failed to create product', error)
    }
  }

  const updateProduct = async () => {
    try {
      await axios.put('/api/products', { id: editingProduct._id, ...newProduct })
    } catch (error) {
      console.error('Failed to update product', error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete('/api/products', { data: { id } })
      await fetchProducts()
    } catch (error) {
      console.error('Failed to delete product', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">E-commerce Product Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-bold">${product.price}</p>
            <div className="mt-2">
              <button
                onClick={() => {
                  setEditingProduct(product)
                  setNewProduct(product)
                }}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
