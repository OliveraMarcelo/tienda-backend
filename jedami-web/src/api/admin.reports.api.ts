import apiClient from './client'

export interface TopProduct {
  productId: number
  name: string
  totalUnits: number
  totalRevenue: number
}

export interface TopCustomer {
  customerId: number
  email: string
  totalOrders: number
  totalRevenue: number
}

export interface ReportsData {
  topProducts: TopProduct[]
  topCustomers: TopCustomer[]
}

export async function fetchAdminReports(limit = 10): Promise<ReportsData> {
  const res = await apiClient.get<{ data: ReportsData }>(`/admin/reports?limit=${limit}`)
  return res.data.data
}
