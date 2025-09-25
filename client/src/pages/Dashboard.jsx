import React, { useEffect, useState } from 'react'
import { getMe, getExpenses, createExpense, deleteExpense, getBudgets, createBudget, deleteBudget, getSpendByCategory, getSpendByMonth } from '../lib/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import ExpenseForm from '../components/ExpenseForm.jsx'
import BudgetForm from '../components/BudgetForm.jsx'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [byCat, setByCat] = useState([])
  const [byMonth, setByMonth] = useState([])
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    async function load() {
      const me = await getMe()
      setUser(me)
      setExpenses(await getExpenses())
      setBudgets(await getBudgets())
      setByCat(await getSpendByCategory({}))
      setByMonth(await getSpendByMonth({}))
    }
    load()
  }, [])

  async function addExpense(payload) {
    await createExpense(payload)
    setExpenses(await getExpenses())
    setByCat(await getSpendByCategory({}))
    setByMonth(await getSpendByMonth({}))
  }

  async function removeExpense(id) {
    await deleteExpense(id)
    setExpenses(await getExpenses())
    setByCat(await getSpendByCategory({}))
    setByMonth(await getSpendByMonth({}))
  }

  async function addBudget(payload) {
    await createBudget(payload)
    setBudgets(await getBudgets())
  }

  async function removeBudget(id) {
    await deleteBudget(id)
    setBudgets(await getBudgets())
  }

  const doughnutData = {
    labels: byCat.map((x) => x.category),
    datasets: [{ data: byCat.map((x) => x.total), backgroundColor: ['#4F46E5','#22C55E','#F59E0B','#EF4444','#06B6D4','#A855F7'] }]
  }

  const barData = {
    labels: byMonth.map((x) => `${x.month}/${x.year}`),
    datasets: [{ label: 'Spend', data: byMonth.map((x) => x.total), backgroundColor: '#4F46E5' }]
  }

  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard{user ? `, ${user.name}` : ''}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Spend by Category</h3>
            <Doughnut data={doughnutData} />
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Spend by Month</h3>
            <Bar data={barData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Expenses</h3>
            </div>
            <div className="mb-4">
              <ExpenseForm onSubmit={addExpense} />
            </div>
            <ul className="divide-y">
              {expenses.slice(0, 10).map((e) => (
                <li key={e._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{e.category}</p>
                    <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">${e.amount}</span>
                    <button className="text-red-600 hover:underline" onClick={() => removeExpense(e._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Budgets</h3>
            </div>
            <div className="mb-4">
              <BudgetForm onSubmit={addBudget} />
            </div>
            <ul className="divide-y">
              {budgets.map((b) => (
                <li key={b._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{b.category}</p>
                    <p className="text-sm text-gray-500">{b.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">${b.amount}</span>
                    <button className="text-red-600 hover:underline" onClick={() => removeBudget(b._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}


