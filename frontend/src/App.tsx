import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Projects } from '@/pages/Projects'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Tasks } from '@/pages/Tasks'
import { Resources } from '@/pages/Resources'
import { HR } from '@/pages/HR'
import { EmployeeProfile } from '@/pages/EmployeeProfile'
import { Timesheets } from '@/pages/Timesheets'
import { Budgets } from '@/pages/Budgets'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="resources" element={<Resources />} />
          <Route path="hr" element={<HR />} />
          <Route path="hr/:id" element={<EmployeeProfile />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

