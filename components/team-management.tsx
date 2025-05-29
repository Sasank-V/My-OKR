"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, Mail, UserPlus, Building, Target } from "lucide-react";

export function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteTeam, setInviteTeam] = useState("");
  const { toast } = useToast();

  // Mock data
  const teams = [
    {
      id: "1",
      name: "Engineering",
      department: "Technology",
      lead: "Mike Johnson",
      memberCount: 8,
      activeOKRs: 5,
      members: [
        {
          id: "1",
          name: "Mike Johnson",
          email: "mike@company.com",
          role: "Team Lead",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "2",
          name: "Sarah Wilson",
          email: "sarah@company.com",
          role: "Senior Developer",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "3",
          name: "Tom Chen",
          email: "tom@company.com",
          role: "Developer",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    },
    {
      id: "2",
      name: "Product",
      department: "Product",
      lead: "Jane Smith",
      memberCount: 5,
      activeOKRs: 3,
      members: [
        {
          id: "4",
          name: "Jane Smith",
          email: "jane@company.com",
          role: "Product Manager",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "5",
          name: "Alex Rodriguez",
          email: "alex@company.com",
          role: "Product Designer",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    },
    {
      id: "3",
      name: "Customer Success",
      department: "Operations",
      lead: "John Doe",
      memberCount: 6,
      activeOKRs: 4,
      members: [
        {
          id: "6",
          name: "John Doe",
          email: "john@company.com",
          role: "CS Manager",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "7",
          name: "Lisa Park",
          email: "lisa@company.com",
          role: "CS Specialist",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    },
  ];

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail || !inviteRole || !inviteTeam) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation Sent!",
      description: `Invitation sent to ${inviteEmail}`,
    });

    setInviteEmail("");
    setInviteRole("");
    setInviteTeam("");
    setInviteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Manage teams and team members</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={setInviteRole}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team">Team</Label>
                <Select
                  value={inviteTeam}
                  onValueChange={setInviteTeam}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building className="h-4 w-4" />
                    {team.department}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{team.memberCount} members</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Team Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active OKRs</span>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{team.activeOKRs}</span>
                  </div>
                </div>

                {/* Team Lead */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Team Lead
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback>{team.lead.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{team.lead}</span>
                  </div>
                </div>

                {/* Recent Members */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Members</p>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 4).map((member) => (
                      <Avatar
                        key={member.id}
                        className="h-8 w-8 border-2 border-background"
                      >
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.memberCount > 4 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">
                          +{team.memberCount - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Team
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search"
              : "Create your first team to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
