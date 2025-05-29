export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "dept-manager" | "team-manager" | "member";
  organizationId?: string;
  teamId?: string;
  departmentId?: string;
  avatar?: string;
  access_token: string;
  refresh_token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  admins: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  departmentId: string;
  organizationId: string;
  name: string;
  description?: string;
  leadId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KeyResult {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OKR {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  teamId?: string;
  organizationId: string;
  objectiveType: "individual" | "team" | "department" | "organization";
  status: "draft" | "active" | "completed" | "cancelled";
  progress: number;
  keyResults: KeyResult[];
  tags: string[];
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  okrId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

export interface OKRUpdateLog {
  id: string;
  okrId: string;
  keyResultId?: string; // Optional, for KR-level changes
  userId: string;
  action: "create" | "update" | "delete" | "progress_update";
  fieldChanged?: string;
  oldValue?: string | number | null;
  newValue?: string | number | null;
  timestamp: Date;
}
