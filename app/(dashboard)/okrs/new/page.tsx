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
import { Plus, Trash2, Loader2 } from "lucide-react";

type Entity = {
  _id: string;
  name: string;
};

type KeyResult = {
  title: string;
  target: string;
  unit: string;
};

type FormData = {
  title: string;
  description: string;
  objectiveType: string;
  organizationId: string;
  teamId: string;
  departmentId: string;
  status: string;
  progress: number;
  tags: string[];
  startDate: string;
  dueDate: string;
  keyResults: KeyResult[];
  memberId: string;
};

export default function NewOKRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "individual";

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    objectiveType: type,
    organizationId: "",
    teamId: "",
    departmentId: "",
    memberId: "",
    status: "draft",
    progress: 0,
    tags: [],
    startDate: "",
    dueDate: "",
    keyResults: [{ title: "", target: "", unit: "" }],
  });

  const [teams, setTeams] = useState<Entity[]>([]);
  const [departments, setDepartments] = useState<Entity[]>([]);
  const [people, setPeople] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teams data
  const fetchTeams = async (): Promise<Entity[]> => {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) {
        console.error("Failed to fetch teams:", res.statusText);
        return [];
      }
      const data = await res.json();
      console.log(data);
      return Array.isArray(data.data) ? data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  };

  // Fetch departments data
  const fetchDepartments = async (): Promise<Entity[]> => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) {
        console.error("Failed to fetch departments:", res.statusText);
        return [];
      }
      const data = await res.json();
      console.log(data.data);
      return Array.isArray(data.data) ? data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  // Fetch people data
  const fetchPeople = async (): Promise<Entity[]> => {
    try {
      const res = await fetch("/api/people");
      if (!res.ok) {
        console.error("Failed to fetch people:", res.statusText);
        return [];
      }
      const data = await res.json();
      console.log(data);
      return Array.isArray(data) ? data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching people:", error);
      return [];
    }
  };

  // Add new key result
  const addKeyResult = () => {
    setFormData((prev) => ({
      ...prev,
      keyResults: [...prev.keyResults, { title: "", target: "", unit: "" }],
    }));
  };

  // Remove key result
  const removeKeyResult = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.filter((_, i) => i !== index),
    }));
  };

  // Update key result
  const updateKeyResult = (
    index: number,
    field: keyof KeyResult,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.map((kr, i) =>
        i === index ? { ...kr, [field]: value } : kr
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Please enter an objective title");
      setIsSubmitting(false);
      return;
    }

    if (formData.keyResults.some((kr) => !kr.title.trim())) {
      alert("Please fill in all key result titles");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/okrs/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create OKR");
      }

      // Redirect based on objective type
      const redirectPath =
        {
          organization: "/okrs?type=organization",
          department: "/okrs?type=department",
          team: "/okrs?type=team",
          individual: "/okrs?type=individual",
        }[formData.objectiveType] || "/okrs";

      router.push(redirectPath);
    } catch (error) {
      console.error("Error creating OKR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create OKR. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load data based on objective type
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (formData.objectiveType === "team") {
          const teamData = await fetchTeams();
          setTeams(teamData);
        } else if (formData.objectiveType === "department") {
          const deptData = await fetchDepartments();
          setDepartments(deptData);
        } else if (formData.objectiveType === "individual") {
          const peopleData = await fetchPeople();
          setPeople(peopleData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
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
                <Label htmlFor="title">Objective Title *</Label>
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
                <Label htmlFor="objectiveType">OKR Type *</Label>
                <Select
                  value={formData.objectiveType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      objectiveType: value,
                      teamId: "",
                      departmentId: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="individual">Personal</SelectItem>
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

            {/* Team Selection */}
            {formData.objectiveType === "team" && (
              <div className="space-y-2">
                <Label htmlFor="teamId">Select Team *</Label>
                {loading ? (
                  <div className="flex items-center gap-2 p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading teams...
                    </span>
                  </div>
                ) : (
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
                )}
              </div>
            )}

            {/* Department Selection */}
            {formData.objectiveType === "department" && (
              <div className="space-y-2">
                <Label htmlFor="departmentId">Select Department *</Label>
                {loading ? (
                  <div className="flex items-center gap-2 p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading departments...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, departmentId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Individual Selection */}
            {formData.objectiveType === "individual" && (
              <div className="space-y-2">
                <Label htmlFor="memberId">Select Member *</Label>
                {loading ? (
                  <div className="flex items-center gap-2 p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading people...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.memberId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, memberId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.map((person) => (
                        <SelectItem key={person._id} value={person._id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
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
                    <Label>Key Result {index + 1} *</Label>
                    <Input
                      value={kr.title}
                      onChange={(e) =>
                        updateKeyResult(index, "title", e.target.value)
                      }
                      placeholder="Enter key result"
                      required
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create OKR"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
