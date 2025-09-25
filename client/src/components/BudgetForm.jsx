import React, { useState } from 'react'

export default function BudgetForm({ onSubmit, initial }) {
  const [category, setCategory] = useState(initial?.category ?? '')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [period, setPeriod] = useState(initial?.period ?? 'monthly')

  function submit(e) {
    e.preventDefault()
    onSubmit({ category, amount: Number(amount), period })
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} required />
        <input className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} required />
      </div>
      <div className="flex items-center gap-3">
        <select className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" value={period} onChange={(e)=>setPeriod(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button type="submit" className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">Add</button>
      </div>
    </form>
  )
}


