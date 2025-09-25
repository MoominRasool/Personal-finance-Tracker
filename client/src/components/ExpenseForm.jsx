import React, { useState } from 'react'

export default function ExpenseForm({ onSubmit, initial }) {
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0,10) : new Date().toISOString().slice(0,10))

  function submit(e) {
    e.preventDefault()
    onSubmit({ amount: Number(amount), category, description, date })
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} required />
        <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} required />
      </div>
      <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <div className="flex items-center gap-3">
        <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" type="date" value={date} onChange={(e)=>setDate(e.target.value)} required />
        <button type="submit" className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">Add</button>
      </div>
    </form>
  )
}


