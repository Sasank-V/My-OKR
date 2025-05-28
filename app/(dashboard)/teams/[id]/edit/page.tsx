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
import { Users, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

type Person = {
  _id: string;
  name: string;
  role: string;
};

type Department = {
  _id: string;
  name: string;
};

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
    leadId: "",
    location: "",
    establishedDate: "",
    goals: "",
    status: "",
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Departments and people states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errorDepartments, setErrorDepartments] = useState<string | null>(null);

  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [errorPeople, setErrorPeople] = useState<string | null>(null);

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        setLoadingDepartments(true);
        setErrorDepartments(null);
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data.data);
      } catch (err: any) {
        setErrorDepartments(err.message || "Error fetching departments");
      } finally {
        setLoadingDepartments(false);
      }
    }
    fetchDepartments();
  }, []);

  // Fetch people
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

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) throw new Error("Failed to fetch team data");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          departmentId: data.departmentId?._id || "",
          leadId: data.leadId?._id || "",
          location: data.location || "",
          establishedDate: data.establishedDate?.slice(0, 10) || "",
          goals: data.goals || "",
          status: data.status || "Active",
        });

        setSelectedMembers(data.memberIds?.map((m: any) => m._id) || []);
      } catch (error) {
        console.error("Failed to fetch team:", error);
      }
    };

    if (teamId) fetchTeamData();
  }, [teamId]);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        memberIds: selectedMembers,
      };

      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update team");

      router.push(`/teams/${teamId}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update team");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Edit Team</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>Update basic team details</CardDescription>
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
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, departmentId: value }))
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
                    value={formData.leadId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, leadId: value }))
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
              Select members to include in the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPeople ? (
              <p>Loading members...</p>
            ) : errorPeople ? (
              <p className="text-red-500">{errorPeople}</p>
            ) : availablePeople.length === 0 ? (
              <p>No people available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-72 overflow-auto">
                {availablePeople.map((person) => (
                  <div key={person._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${person._id}`}
                      checked={selectedMembers.includes(person._id)}
                      onCheckedChange={() => handleMemberToggle(person._id)}
                    />
                    <Label
                      htmlFor={`member-${person._id}`}
                      className="truncate cursor-pointer"
                      title={`${person.name} - ${person.role}`}
                    >
                      {person.name} - {person.role}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full flex justify-center items-center gap-2"
          disabled={loadingDepartments || loadingPeople}
        >
          <Save size={18} />
          Save Changes
        </Button>
      </form>
    </div>
  );
}
