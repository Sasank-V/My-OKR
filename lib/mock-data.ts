import type { User, Organization, Department, Team } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "admin",
    organizationId: "org-1",
    teamId: "team-3",
    departmentId: "dept-3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "manager",
    organizationId: "org-1",
    teamId: "team-2",
    departmentId: "dept-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "manager",
    organizationId: "org-1",
    teamId: "team-1",
    departmentId: "dept-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "TechCorp Inc.",
    description: "A leading technology company",
    admins: ["1"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    organizationId: "org-1",
    name: "Technology",
    description: "Engineering and technical teams",
    managerId: "3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "dept-2",
    organizationId: "org-1",
    name: "Product",
    description: "Product management and design",
    managerId: "2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "dept-3",
    organizationId: "org-1",
    name: "Operations",
    description: "Customer success and operations",
    managerId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const mockTeams: Team[] = [
  {
    id: "team-1",
    departmentId: "dept-1",
    organizationId: "org-1",
    name: "Engineering",
    description: "Core engineering team",
    leadId: "3",
    memberIds: ["3", "4", "5"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "team-2",
    departmentId: "dept-2",
    organizationId: "org-1",
    name: "Product",
    description: "Product management team",
    leadId: "2",
    memberIds: ["2", "6"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "team-3",
    departmentId: "dept-3",
    organizationId: "org-1",
    name: "Customer Success",
    description: "Customer success team",
    leadId: "1",
    memberIds: ["1", "7"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]
