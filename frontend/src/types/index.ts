export interface DocumentRecord {
  id: string
  entityType: 'employee' | 'project'
  entityId: string
  title: string
  fileName: string
  mimeType: string
  size: number
  uploadedAt: string
}

export interface Employee {
  id: string
  employeeId: string
  fullName: string
  email: string
  department: string
  designation: string
  skills: string[]
  hourlyRate: number
  monthlySalary: number
  capacityHours: number
  availability: number
  status: 'Available' | 'Allocated' | 'Fully Allocated' | 'On Leave'
  utilization?: number
  allocatedHours?: number
}

export interface Project {
  id: string
  projectId: string
  name: string
  client: string
  description: string
  projectManager: string
  projectManagerId?: string
  startDate: string
  endDate: string
  status: 'Draft' | 'Planned' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled'
  budget: number
  revenue: number
  priority: string
  phases?: Phase[]
}

export interface Phase {
  id: string
  name: string
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  name: string
  dueDate?: string
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  phaseId?: string
  milestoneId?: string
  assigneeId?: string
  priority: string
  status: string
  kanbanStatus: string
  estimatedHours: number
  actualHours: number
  dueDate: string
  requiredSkills?: string[]
}

export interface Timesheet {
  id: string
  employeeId: string
  projectId: string
  taskId: string
  date: string
  hoursWorked: number
  notes: string
  status: 'Approved' | 'Rejected' | 'Pending'
}

export interface Budget {
  id: string
  projectId: string
  amount: number
  plannedCost: number
  actualCost: number
  currency: string
}

export interface Risk {
  id: string
  projectId: string
  risk: string
  probability: string
  impact: string
  mitigation: string
  owner: string
  status: string
}

export interface Issue {
  id: string
  projectId: string
  issue: string
  owner: string
  status: string
  resolution: string
  priority: string
}

export interface Leave {
  id: string
  employeeId: string
  type: string
  startDate: string
  endDate: string
  days: number
  status: string
  reason: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  userId: string
  read: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  details: string
  userId: string
  timestamp: string
}

export interface DashboardMetrics {
  kpis: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalEmployees: number
    availableResources: number
    allocatedResources: number
    budgetUtilization: number
    monthlyCost: number
    totalRevenue: number
    totalActualCost: number
    totalPlannedCost: number
    totalBudget: number
    profit: number
    profitMargin: number
    projectGrowthTrend?: number
    monthlyCostTrend?: number
    budgetUtilizationTrend?: number
  }
  projectStatusDistribution: { status: string; count: number }[]
  budgetVsActual: { name: string; budget: number; actual: number; planned: number }[]
  resourceUtilization: { id: string; name: string; department: string; utilization: number; allocatedHours: number; capacityHours: number }[]
  monthlySpending: { month: string; cost: number }[]
  taskProgress: { status: string; count: number }[]
  kanbanCounts: Record<string, number>
  projectProfitability: { projectId: string; projectName: string; budget: number; plannedCost: number; actualCost: number; remaining: number; consumption: number; health: string; revenue: number; profit: number; margin: number }[]
  employeeAllocation: { name: string; allocated: number; available: number }[]
}

export interface AssigneeSuggestion {
  employee: Employee
  skillMatch: number
  utilization: number
  availableHours: number
  score: number
  isBestMatch: boolean
  forecast: {
    capacityHours: number
    allocatedHours: number
    availableHours: number
    utilization: number
    warning: { level: string; message: string }
  }
}

export interface CapacityForecast {
  weekStart: string
  weekEnd: string
  capacityHours: number
  allocatedHours: number
  availableHours: number
  utilization: number
  warning: { level: string; message: string }
  assignedTasks: { id: string; title: string; hours: number }[]
}
