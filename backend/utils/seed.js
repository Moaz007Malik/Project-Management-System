import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import { repos } from '../repositories/index.js';


import dns from "dns";
if (process.env.FORCE_PUBLIC_DNS === "true") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  console.log("Using public DNS servers (1.1.1.1, 8.8.8.8)");
}


const departments = [
  { id: 'dept-1', name: 'Engineering', head: 'Sarah Chen', employeeCount: 4 },
  { id: 'dept-2', name: 'Design', head: 'Marcus Williams', employeeCount: 2 },
  { id: 'dept-3', name: 'Product', head: 'Emily Rodriguez', employeeCount: 2 },
  { id: 'dept-4', name: 'QA', head: 'James Park', employeeCount: 2 },
];

const skillsList = [
  { id: 'sk-1', name: 'React', category: 'Frontend' },
  { id: 'sk-2', name: 'Node.js', category: 'Backend' },
  { id: 'sk-3', name: 'TypeScript', category: 'Language' },
  { id: 'sk-4', name: 'Python', category: 'Language' },
  { id: 'sk-5', name: 'AWS', category: 'Cloud' },
  { id: 'sk-6', name: 'UI/UX Design', category: 'Design' },
  { id: 'sk-7', name: 'Project Management', category: 'Management' },
  { id: 'sk-8', name: 'DevOps', category: 'Infrastructure' },
  { id: 'sk-9', name: 'SQL', category: 'Database' },
  { id: 'sk-10', name: 'Agile/Scrum', category: 'Methodology' },
];

const employees = [
  { id: 'emp-1', employeeId: 'EMP001', fullName: 'Ahmed Khan', email: 'ahmed.khan@company.com', department: 'Engineering', designation: 'Senior Developer', skills: ['React', 'Node.js', 'TypeScript'], hourlyRate: 85, monthlySalary: 13600, capacityHours: 40, availability: 16, status: 'Allocated' },
  { id: 'emp-2', employeeId: 'EMP002', fullName: 'Sarah Chen', email: 'sarah.chen@company.com', department: 'Engineering', designation: 'Tech Lead', skills: ['React', 'Node.js', 'AWS', 'DevOps'], hourlyRate: 110, monthlySalary: 17600, capacityHours: 40, availability: 8, status: 'Fully Allocated' },
  { id: 'emp-3', employeeId: 'EMP003', fullName: 'Marcus Williams', email: 'marcus.w@company.com', department: 'Design', designation: 'UI/UX Lead', skills: ['UI/UX Design', 'React'], hourlyRate: 75, monthlySalary: 12000, capacityHours: 40, availability: 20, status: 'Allocated' },
  { id: 'emp-4', employeeId: 'EMP004', fullName: 'Emily Rodriguez', email: 'emily.r@company.com', department: 'Product', designation: 'Product Manager', skills: ['Project Management', 'Agile/Scrum'], hourlyRate: 95, monthlySalary: 15200, capacityHours: 40, availability: 12, status: 'Allocated' },
  { id: 'emp-5', employeeId: 'EMP005', fullName: 'James Park', email: 'james.park@company.com', department: 'QA', designation: 'QA Engineer', skills: ['SQL', 'Python', 'Agile/Scrum'], hourlyRate: 65, monthlySalary: 10400, capacityHours: 40, availability: 24, status: 'Available' },
  { id: 'emp-6', employeeId: 'EMP006', fullName: 'Priya Sharma', email: 'priya.s@company.com', department: 'Engineering', designation: 'Full Stack Developer', skills: ['React', 'Python', 'AWS'], hourlyRate: 80, monthlySalary: 12800, capacityHours: 40, availability: 18, status: 'Allocated' },
  { id: 'emp-7', employeeId: 'EMP007', fullName: 'David Okonkwo', email: 'david.o@company.com', department: 'Engineering', designation: 'DevOps Engineer', skills: ['DevOps', 'AWS', 'Node.js'], hourlyRate: 90, monthlySalary: 14400, capacityHours: 40, availability: 10, status: 'Allocated' },
  { id: 'emp-8', employeeId: 'EMP008', fullName: 'Lisa Thompson', email: 'lisa.t@company.com', department: 'Design', designation: 'Product Designer', skills: ['UI/UX Design'], hourlyRate: 70, monthlySalary: 11200, capacityHours: 40, availability: 28, status: 'Available' },
  { id: 'emp-9', employeeId: 'EMP009', fullName: 'Michael Torres', email: 'michael.t@company.com', department: 'Product', designation: 'Business Analyst', skills: ['Project Management', 'SQL'], hourlyRate: 72, monthlySalary: 11520, capacityHours: 40, availability: 22, status: 'Available' },
  { id: 'emp-10', employeeId: 'EMP010', fullName: 'Anna Kowalski', email: 'anna.k@company.com', department: 'QA', designation: 'Senior QA', skills: ['Python', 'SQL', 'Agile/Scrum'], hourlyRate: 68, monthlySalary: 10880, capacityHours: 40, availability: 0, status: 'On Leave' },
];

const projects = [
  {
    id: 'proj-1', projectId: 'PRJ001', name: 'Project Alpha', client: 'TechCorp Inc.', description: 'Enterprise resource planning system modernization',
    projectManager: 'Emily Rodriguez', projectManagerId: 'emp-4', startDate: '2025-01-15', endDate: '2026-06-30',
    status: 'Active', budget: 500000, revenue: 750000, priority: 'High',
    phases: [
      { id: 'phase-1-1', name: 'Discovery', milestones: [{ id: 'ms-1-1', name: 'Requirements Complete', dueDate: '2025-03-01' }] },
      { id: 'phase-1-2', name: 'Development', milestones: [{ id: 'ms-1-2', name: 'MVP Release', dueDate: '2025-09-01' }, { id: 'ms-1-3', name: 'Beta Launch', dueDate: '2026-01-15' }] },
      { id: 'phase-1-3', name: 'Deployment', milestones: [{ id: 'ms-1-4', name: 'Production Go-Live', dueDate: '2026-06-30' }] },
    ],
  },
  {
    id: 'proj-2', projectId: 'PRJ002', name: 'Cloud Migration', client: 'FinanceHub Ltd.', description: 'Migrate legacy systems to AWS cloud infrastructure',
    projectManager: 'Sarah Chen', projectManagerId: 'emp-2', startDate: '2025-03-01', endDate: '2025-12-31',
    status: 'Active', budget: 320000, revenue: 480000, priority: 'High',
    phases: [
      { id: 'phase-2-1', name: 'Assessment', milestones: [{ id: 'ms-2-1', name: 'Architecture Review', dueDate: '2025-04-15' }] },
      { id: 'phase-2-2', name: 'Migration', milestones: [{ id: 'ms-2-2', name: 'Phase 1 Migration', dueDate: '2025-08-01' }] },
    ],
  },
  {
    id: 'proj-3', projectId: 'PRJ003', name: 'Mobile App Redesign', client: 'RetailMax', description: 'Complete redesign of customer-facing mobile application',
    projectManager: 'Marcus Williams', projectManagerId: 'emp-3', startDate: '2025-02-01', endDate: '2025-10-31',
    status: 'Active', budget: 180000, revenue: 270000, priority: 'Medium',
    phases: [
      { id: 'phase-3-1', name: 'Design', milestones: [{ id: 'ms-3-1', name: 'Design System', dueDate: '2025-04-01' }] },
      { id: 'phase-3-2', name: 'Development', milestones: [{ id: 'ms-3-2', name: 'App Store Release', dueDate: '2025-10-31' }] },
    ],
  },
  {
    id: 'proj-4', projectId: 'PRJ004', name: 'Data Analytics Platform', client: 'InsightCo', description: 'Build real-time analytics dashboard and reporting engine',
    projectManager: 'Emily Rodriguez', projectManagerId: 'emp-4', startDate: '2025-04-01', endDate: '2026-03-31',
    status: 'Planned', budget: 420000, revenue: 600000, priority: 'Medium',
    phases: [
      { id: 'phase-4-1', name: 'Planning', milestones: [{ id: 'ms-4-1', name: 'Data Model Approved', dueDate: '2025-06-01' }] },
    ],
  },
  {
    id: 'proj-5', projectId: 'PRJ005', name: 'Security Audit', client: 'SecureBank', description: 'Comprehensive security assessment and remediation',
    projectManager: 'David Okonkwo', projectManagerId: 'emp-7', startDate: '2024-10-01', endDate: '2025-05-31',
    status: 'Completed', budget: 95000, revenue: 140000, priority: 'High',
    phases: [
      { id: 'phase-5-1', name: 'Audit', milestones: [{ id: 'ms-5-1', name: 'Final Report', dueDate: '2025-05-31' }] },
    ],
  },
];

const taskTitles = [
  'Setup development environment', 'Design database schema', 'Implement user authentication',
  'Build API endpoints', 'Create dashboard UI', 'Write unit tests', 'Code review session',
  'Deploy to staging', 'Performance optimization', 'Bug fix sprint', 'Integration testing',
  'Documentation update', 'Sprint planning', 'Backlog grooming', 'Security review',
  'CI/CD pipeline setup', 'Load testing', 'User acceptance testing', 'Feature flag implementation',
  'Accessibility audit', 'Mobile responsive fixes', 'API documentation', 'Monitoring setup',
  'Error handling improvements', 'Refactoring legacy code', 'Third-party integration',
  'Data migration script', 'Cache implementation', 'Email notification system', 'Report generation',
  'Search functionality', 'Export to PDF feature', 'Role-based access control', 'Audit log implementation',
  'Backup strategy', 'Disaster recovery plan', 'Training materials', 'Stakeholder presentation',
  'Risk assessment update', 'Sprint retrospective', 'Technical debt reduction', 'Cloud cost optimization',
  'Microservices decomposition', 'GraphQL API layer', 'Real-time notifications', 'Analytics tracking',
  'A/B testing framework', 'Localization support', 'Payment gateway integration', 'Customer feedback module',
];

const statuses = ['Not Started', 'In Progress', 'Review', 'Blocked', 'Completed'];
const kanbanStatuses = ['Backlog', 'To Do', 'In Progress', 'Review', 'Completed'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

const tasks = [];
const projectIds = projects.map((p) => p.id);
const empIds = employees.filter((e) => e.status !== 'On Leave').map((e) => e.id);

for (let i = 0; i < 50; i++) {
  const project = projects[i % projects.length];
  const phase = project.phases[randomInt(0, project.phases.length - 1)];
  const milestone = phase.milestones?.[0];
  const status = i < 15 ? 'Completed' : randomItem(statuses);
  const kanbanMap = { 'Not Started': 'Backlog', 'In Progress': 'In Progress', Review: 'Review', Blocked: 'To Do', Completed: 'Completed' };
  const estHours = randomInt(4, 40);
  const actHours = status === 'Completed' ? estHours + randomInt(-4, 8) : status === 'Not Started' ? 0 : randomInt(0, estHours);

  tasks.push({
    id: `task-${i + 1}`,
    title: taskTitles[i % taskTitles.length],
    description: `Task description for ${taskTitles[i % taskTitles.length]}`,
    projectId: project.id,
    phaseId: phase.id,
    milestoneId: milestone?.id,
    assigneeId: randomItem(empIds),
    priority: randomItem(priorities),
    status,
    kanbanStatus: status === 'Not Started' ? randomItem(['Backlog', 'To Do']) : kanbanMap[status],
    estimatedHours: estHours,
    actualHours: Math.max(0, actHours),
    dueDate: randomDate(new Date('2025-01-01'), new Date('2026-06-30')),
    requiredSkills: [randomItem(['React', 'Node.js', 'Python', 'UI/UX Design', 'DevOps', 'SQL'])],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

const timesheets = [];
for (let i = 0; i < 100; i++) {
  const task = randomItem(tasks.filter((t) => t.assigneeId));
  const emp = employees.find((e) => e.id === task.assigneeId) || randomItem(employees);
  const date = randomDate(new Date('2025-01-01'), new Date());
  const statuses = i < 70 ? 'Approved' : i < 90 ? 'Pending' : 'Rejected';
  timesheets.push({
    id: `ts-${i + 1}`,
    employeeId: task.assigneeId || emp.id,
    projectId: task.projectId,
    taskId: task.id,
    date,
    hoursWorked: randomInt(2, 8),
    notes: `Work on ${task.title}`,
    status: statuses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

const budgets = projects.map((p) => ({
  id: `budget-${p.id}`,
  projectId: p.id,
  amount: p.budget,
  plannedCost: Math.round(p.budget * 0.85),
  actualCost: Math.round(p.budget * (p.status === 'Completed' ? 0.92 : randomInt(40, 75) / 100)),
  currency: 'USD',
  fiscalYear: 2025,
  createdAt: new Date().toISOString(),
}));

const risks = [
  { id: 'risk-1', projectId: 'proj-1', risk: 'Key developer departure', probability: 'Medium', impact: 'High', mitigation: 'Cross-train team members', owner: 'Sarah Chen', status: 'Open' },
  { id: 'risk-2', projectId: 'proj-1', risk: 'Scope creep', probability: 'High', impact: 'Medium', mitigation: 'Strict change control process', owner: 'Emily Rodriguez', status: 'Monitoring' },
  { id: 'risk-3', projectId: 'proj-2', risk: 'AWS cost overrun', probability: 'Medium', impact: 'High', mitigation: 'Implement cost monitoring alerts', owner: 'David Okonkwo', status: 'Open' },
  { id: 'risk-4', projectId: 'proj-2', risk: 'Data migration failure', probability: 'Low', impact: 'Critical', mitigation: 'Multiple dry-run migrations', owner: 'Sarah Chen', status: 'Mitigated' },
  { id: 'risk-5', projectId: 'proj-3', risk: 'App store rejection', probability: 'Low', impact: 'Medium', mitigation: 'Pre-submission review checklist', owner: 'Marcus Williams', status: 'Open' },
  { id: 'risk-6', projectId: 'proj-3', risk: 'Design approval delays', probability: 'Medium', impact: 'Medium', mitigation: 'Early stakeholder engagement', owner: 'Marcus Williams', status: 'Monitoring' },
  { id: 'risk-7', projectId: 'proj-4', risk: 'Data quality issues', probability: 'High', impact: 'High', mitigation: 'Data cleansing pipeline', owner: 'Michael Torres', status: 'Open' },
  { id: 'risk-8', projectId: 'proj-4', risk: 'Vendor dependency', probability: 'Medium', impact: 'Medium', mitigation: 'Evaluate alternative vendors', owner: 'Emily Rodriguez', status: 'Open' },
  { id: 'risk-9', projectId: 'proj-1', risk: 'Integration complexity', probability: 'High', impact: 'High', mitigation: 'Phased integration approach', owner: 'Ahmed Khan', status: 'Monitoring' },
  { id: 'risk-10', projectId: 'proj-2', risk: 'Compliance requirements', probability: 'Medium', impact: 'Critical', mitigation: 'Engage compliance team early', owner: 'Emily Rodriguez', status: 'Open' },
];

const issues = [
  { id: 'issue-1', projectId: 'proj-1', issue: 'API response time exceeds SLA', owner: 'Ahmed Khan', status: 'In Progress', resolution: 'Implementing caching layer', priority: 'High' },
  { id: 'issue-2', projectId: 'proj-1', issue: 'Missing test coverage on auth module', owner: 'James Park', status: 'Open', resolution: '', priority: 'Medium' },
  { id: 'issue-3', projectId: 'proj-2', issue: 'Legacy database connection timeout', owner: 'David Okonkwo', status: 'Resolved', resolution: 'Increased connection pool size', priority: 'High' },
  { id: 'issue-4', projectId: 'proj-2', issue: 'IAM permissions misconfigured', owner: 'David Okonkwo', status: 'In Progress', resolution: 'Updating IAM policies', priority: 'Critical' },
  { id: 'issue-5', projectId: 'proj-3', issue: 'UI inconsistency on iOS devices', owner: 'Lisa Thompson', status: 'Open', resolution: '', priority: 'Medium' },
  { id: 'issue-6', projectId: 'proj-3', issue: 'Animation performance on low-end devices', owner: 'Marcus Williams', status: 'In Progress', resolution: 'Optimizing animation library', priority: 'Low' },
  { id: 'issue-7', projectId: 'proj-4', issue: 'Data schema mismatch', owner: 'Michael Torres', status: 'Open', resolution: '', priority: 'High' },
  { id: 'issue-8', projectId: 'proj-1', issue: 'Deployment pipeline failure', owner: 'David Okonkwo', status: 'Resolved', resolution: 'Fixed Docker configuration', priority: 'High' },
  { id: 'issue-9', projectId: 'proj-2', issue: 'SSL certificate expiration', owner: 'David Okonkwo', status: 'Resolved', resolution: 'Renewed certificates', priority: 'Critical' },
  { id: 'issue-10', projectId: 'proj-5', issue: 'Penetration test findings', owner: 'James Park', status: 'Resolved', resolution: 'All critical findings remediated', priority: 'High' },
];

const leaves = [
  { id: 'leave-1', employeeId: 'emp-10', type: 'Sick Leave', startDate: '2025-05-20', endDate: '2025-06-05', days: 12, status: 'Approved', reason: 'Medical recovery' },
  { id: 'leave-2', employeeId: 'emp-5', type: 'Annual Leave', startDate: '2025-07-01', endDate: '2025-07-14', days: 10, status: 'Pending', reason: 'Summer vacation' },
  { id: 'leave-3', employeeId: 'emp-8', type: 'Annual Leave', startDate: '2025-08-01', endDate: '2025-08-07', days: 5, status: 'Pending', reason: 'Family trip' },
];

const notifications = [
  { id: 'notif-1', type: 'task_assigned', title: 'New Task Assigned', message: 'You have been assigned: Build API endpoints', userId: 'emp-1', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'notif-2', type: 'budget', title: 'Budget Warning', message: 'Project Alpha is at 85% budget utilization', userId: 'all', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'notif-3', type: 'resource', title: 'Resource Overallocation', message: 'Sarah Chen is at 95% utilization', userId: 'all', read: false, createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: 'notif-4', type: 'task_overdue', title: 'Task Overdue', message: 'Performance optimization is past due date', userId: 'emp-6', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'notif-5', type: 'leave', title: 'Leave Approved', message: 'Your sick leave request has been approved', userId: 'emp-10', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const auditlogs = [
  { id: 'audit-1', action: 'BUDGET_CHANGE', entity: 'Project', entityId: 'proj-1', details: 'Project Alpha budget changed from $50,000 to $60,000', userId: 'emp-4', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'audit-2', action: 'CREATE', entity: 'Task', entityId: 'task-1', details: 'Task created: Setup development environment', userId: 'emp-4', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'audit-3', action: 'UPDATE', entity: 'Project', entityId: 'proj-2', details: 'Project status changed to Active', userId: 'emp-2', timestamp: new Date(Date.now() - 259200000).toISOString() },
  { id: 'audit-4', action: 'KANBAN_MOVE', entity: 'Task', entityId: 'task-5', details: 'Task moved from To Do to In Progress', userId: 'emp-1', timestamp: new Date(Date.now() - 43200000).toISOString() },
  { id: 'audit-5', action: 'CREATE', entity: 'Employee', entityId: 'emp-6', details: 'Employee Priya Sharma added to system', userId: 'system', timestamp: new Date(Date.now() - 604800000).toISOString() },
];

async function seed() {
  await connectDB();

  const collections = {
    departments: { repo: repos.departments, data: departments },
    skills: { repo: repos.skills, data: skillsList },
    employees: { repo: repos.employees, data: employees },
    projects: { repo: repos.projects, data: projects },
    tasks: { repo: repos.tasks, data: tasks },
    timesheets: { repo: repos.timesheets, data: timesheets },
    budgets: { repo: repos.budgets, data: budgets },
    risks: { repo: repos.risks, data: risks },
    issues: { repo: repos.issues, data: issues },
    leaves: { repo: repos.leaves, data: leaves },
    notifications: { repo: repos.notifications, data: notifications },
    auditlogs: { repo: repos.auditlogs, data: auditlogs },
  };

  for (const [name, { repo, data }] of Object.entries(collections)) {
    try {
      await repo.replaceAll(data);
      console.log(`✓ ${name} (${data.length} records)`);
    } catch (err) {
      const hint = err.message?.includes('SSL') || err.message?.includes('tlsv1')
        ? '\n→ Fix: Atlas → Network Access → Add IP Address (0.0.0.0/0 for dev)'
        : '';
      throw new Error(`Failed seeding "${name}": ${err.message}${hint}`);
    }
  }

  await disconnectDB();
  console.log('\n✅ MongoDB seeded successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
