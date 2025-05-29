"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

type Person = {
  id: string;
  name: string;
  role: string;
};

export default function NewTeamPage() {
  const router = useRouter();

  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [errorPeople, setErrorPeople] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    teamLead: "",
    members: [] as string[],
    goals: "",
    status: "Active",
  });

  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errorDepartments, setErrorDepartments] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setLoadingDepartments(true);
        setErrorDepartments(null);
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        console.log(data);
        setDepartments(data.data);
      } catch (err: any) {
        setErrorDepartments(err.message || "Error fetching departments");
      } finally {
        setLoadingDepartments(false);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchPeople() {
      try {
        setLoadingPeople(true);
        setErrorPeople(null);

        const res = await fetch("/api/people");
        if (!res.ok) throw new Error("Failed to fetch people");

        const data: Person[] = await res.json();
        setAvailablePeople(data);
      } catch (err: any) {
        setErrorPeople(err.message || "Error fetching people");
      } finally {
        setLoadingPeople(false);
      }
    }
    fetchPeople();
  }, []);

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/teams/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          departmentId: formData.department, // adjust if you use IDs
          organizationId: "your-organization-id", // add real org ID here
          leadId: formData.teamLead,
          memberIds: formData.members,
          goals: formData.goals,
          status: formData.status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Failed to create team: " + errData.message);
        return;
      }


      router.push("/teams");
    } catch (error) {
      alert("An error occurred while creating team.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Create New Team
        </h1>
        <p className="text-muted-foreground">
          Set up a new team within your organization
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>Basic details about the team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingDepartments ? (
                      <SelectItem value="__loading" disabled>
                        Loading departments...
                      </SelectItem>
                    ) : errorDepartments ? (
                      <SelectItem value="__error" disabled>
                        Error loading departments
                      </SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the team's purpose and responsibilities"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLead">Team Lead</Label>
                {loadingPeople ? (
                  <div>Loading team leads...</div>
                ) : errorPeople ? (
                  <div className="text-red-500">{errorPeople}</div>
                ) : (
                  <Select
                    value={formData.teamLead}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, teamLead: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePeople.map((person) => (
                        <SelectItem key={person._id} value={person._id}>
                          {person.name} - {person.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Select team members from available people
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPeople ? (
              <div>Loading members...</div>
            ) : errorPeople ? (
              <div className="text-red-500">{errorPeople}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePeople.map((person) => (
                  <div key={person._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={person._id}
                      checked={formData.members.includes(person._id)}
                      onCheckedChange={() => handleMemberToggle(person._id)}
                    />
                    <Label
                      htmlFor={person._id}
                      className="flex-1 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {person.role}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Goals</CardTitle>
            <CardDescription>
              Define the team's objectives and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="goals">Goals & Objectives</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, goals: e.target.value }))
                }
                placeholder="Describe the team's main goals and objectives"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Team</Button>
        </div>
      </form>
    </div>
  );
}
