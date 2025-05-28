"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Plus, Trash2 } from "lucide-react";

type Entity = {
  id: string;
  name: string;
};

export default function NewOKRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "personal";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectiveType: type,
    organizationId: "", // to be set by user
    teamId: "", // optional
    status: "draft", // or "active"
    progress: 0,
    tags: [],
    startDate: "",
    dueDate: "",
    keyResults: [{ title: "", target: "", unit: "" }],
  });

  const [teams, setTeams] = useState<Entity[]>([]);
  const [departments, setDepartments] = useState<Entity[]>([]);
  const [individuals, setIndividuals] = useState<Entity[]>([]);
  const fetchTeams = async () => {
    return [
      { id: "t1", name: "Team Alpha" },
      { id: "t2", name: "Team Beta" },
    ];
  };

  const fetchDepartments = async () => {
    return [
      { id: "d1", name: "Engineering" },
      { id: "d2", name: "Marketing" },
    ];
  };

  const fetchIndividuals = async () => {
    return [
      { id: "me", name: "Myself" },
      { id: "u1", name: "John Doe" },
    ];
  };

  const addKeyResult = () => {
    setFormData((prev) => ({
      ...prev,
      keyResults: [...prev.keyResults, { title: "", target: "", unit: "" }],
    }));
  };

  const removeKeyResult = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.filter((_, i) => i !== index),
    }));
  };

  const updateKeyResult = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.map((kr, i) =>
        i === index ? { ...kr, [field]: value } : kr
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/okrs/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create OKR");

      const redirectPath =
        {
          company: "/okrs/company",
          department: "/okrs/department",
          team: "/okrs/team",
          personal: "/okrs/personal",
        }[formData.objectiveType] || "/okrs";

      router.push(redirectPath);
    } catch (error) {
      console.error("Error creating OKR:", error);
      alert("Failed to create OKR. Please try again.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (formData.objectiveType === "team") {
        setTeams(await fetchTeams());
      } else if (formData.objectiveType === "department") {
        setDepartments(await fetchDepartments());
      } else if (formData.objectiveType === "personal") {
        setIndividuals(await fetchIndividuals());
      }
    };

    loadData();
  }, [formData.objectiveType]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New OKR</h1>
        <p className="text-muted-foreground">
          Define a new objective and key results
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>OKR Details</CardTitle>
            <CardDescription>
              Basic information about the objective
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Objective Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter objective title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectiveType">OKR Type</Label>
                <Select
                  value={formData.objectiveType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, objectiveType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
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
                placeholder="Describe the objective"
                rows={3}
              />
            </div>

            {formData.objectiveType === "team" && (
              <div className="space-y-2">
                <Label htmlFor="teamId">Select Team</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, teamId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a team" />
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
            )}

            {formData.objectiveType === "department" && (
              <div className="space-y-2">
                <Label htmlFor="departmentId">Select Department</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, teamId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.objectiveType === "personal" && (
              <div className="space-y-2">
                <Label htmlFor="individualId">Assign to</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, teamId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an individual" />
                  </SelectTrigger>
                  <SelectContent>
                    {individuals.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Key Results</CardTitle>
                <CardDescription>
                  Measurable outcomes that define success
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addKeyResult}>
                <Plus className="h-4 w-4 mr-2" />
                Add Key Result
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.keyResults.map((kr, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Key Result {index + 1}</Label>
                    <Input
                      value={kr.title}
                      onChange={(e) =>
                        updateKeyResult(index, "title", e.target.value)
                      }
                      placeholder="Enter key result"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Target</Label>
                    <Input
                      value={kr.target}
                      onChange={(e) =>
                        updateKeyResult(index, "target", e.target.value)
                      }
                      placeholder="100"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={kr.unit}
                      onChange={(e) =>
                        updateKeyResult(index, "unit", e.target.value)
                      }
                      placeholder="%"
                    />
                  </div>
                  {formData.keyResults.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeKeyResult(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create OKR</Button>
        </div>
      </form>
    </div>
  );
}
