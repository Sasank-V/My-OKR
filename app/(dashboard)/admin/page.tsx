import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Database, Shield, Bell, Mail, Building2 } from "lucide-react";

export default function AdminPage() {
  const adminSections = [
    {
      title: "Manage Organisation",
      description: "Create and manage organisation-level settings",
      icon: Building2,
      stats: "3 active organisations",
      action: "Manage Organisation",
    },
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      stats: "156 active users",
      action: "Manage Users",
    },
    {
      title: "Data Management",
      description: "Backup, restore, and manage application data",
      icon: Database,
      stats: "Last backup: Today",
      action: "Manage Data",
    },
    {
      title: "Security",
      description: "Security settings and access controls",
      icon: Shield,
      stats: "All systems secure",
      action: "Security Settings",
    },
    {
      title: "Notifications",
      description: "Configure system notifications and alerts",
      icon: Bell,
      stats: "12 active notifications",
      action: "Manage Notifications",
    },
    {
      title: "Email Settings",
      description: "Configure email templates and SMTP settings",
      icon: Mail,
      stats: "SMTP configured",
      action: "Email Settings",
    },
  ];
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System administration and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <section.icon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {section.stats}
                  </span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  {section.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.3GB</div>
                <div className="text-sm text-muted-foreground">
                  Storage Used
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">45ms</div>
                <div className="text-sm text-muted-foreground">
                  Avg Response
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
