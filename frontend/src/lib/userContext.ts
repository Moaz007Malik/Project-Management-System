import type { Employee, PcpRole } from '@/types'

export function syncPcpFromEmployee(employee: Employee | undefined): {
  pcpRole: PcpRole | null
  businessUnit: string
} {
  if (!employee) {
    return { pcpRole: null, businessUnit: 'Construction – North' }
  }
  return {
    pcpRole: employee.pcpRole ?? null,
    businessUnit: employee.businessUnit || employee.department || 'Construction – North',
  }
}
