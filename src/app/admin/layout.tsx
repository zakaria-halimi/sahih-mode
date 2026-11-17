import { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Administration — SAHIH MODE',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl overflow-x-auto">
        {children}
      </main>
    </div>
  )
}
