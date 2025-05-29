"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  _id?: string;
  title: string;
  target: string;
  current: string;
  unit: string;
  progress: number;
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

export default function EditOKRPage() {
  const router = useRouter();
  const params = useParams();
  const okrId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    objectiveType: "individual",
    organizationId: "",
    teamId: "",
    departmentId: "",
    memberId: "",
    status: "draft",
    progress: 0,
    tags: [],
    startDate: "",
    dueDate: "",
    keyResults: [
      { title: "", target: "", current: "0", unit: "", progress: 0 },
    ],
  });

  const [teams, setTeams] = useState<Entity[]>([]);
  const [departments, setDepartments] = useState<Entity[]>([]);
  const [people, setPeople] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchTeams = async (): Promise<Entity[]> => {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) {
        console.error("Failed to fetch teams:", res.statusText);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
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
      return Array.isArray(data.data) ? data.data : [];
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching people:", error);
      return [];
    }
  };

  // Fetch OKR data
  const fetchOKRData = async () => {
    try {
      const res = await fetch(`/api/okrs/${okrId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch OKR");
      }
      const data = await res.json();

      // Transform data to match form structure
      const transformedData: FormData = {
        title: data.title || "",
        description: data.description || "",
        objectiveType: data.objectiveType || "individual",
        organizationId: data.organizationId?._id || data.organizationId || "",
        teamId: data.teamId?._id || data.teamId || "",
        departmentId: data.departmentId?._id || data.departmentId || "",
        memberId: data.memberId?._id || data.memberId || "",
        status: data.status || "draft",
        progress: data.progress || 0,
        tags: data.tags || [],
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : "",
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "",
        keyResults:
          data.keyResults?.length > 0
            ? data.keyResults.map((kr: any) => ({
                _id: kr._id,
                title: kr.title || "",
                target: kr.target?.toString() || "",
                current: kr.current?.toString() || "0",
                unit: kr.unit || "",
                progress: kr.progress || 0,
              }))
            : [{ title: "", target: "", current: "0", unit: "", progress: 0 }],
      };

      setFormData(transformedData);
    } catch (error) {
      console.error("Error fetching OKR:", error);
      alert("Failed to load OKR data");
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Add new key result
  const addKeyResult = () => {
    setFormData((prev) => ({
      ...prev,
      keyResults: [
        ...prev.keyResults,
        { title: "", target: "", current: "0", unit: "", progress: 0 },
      ],
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
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.map((kr, i) => {
        if (i === index) {
          const updated = { ...kr, [field]: value };
          // Calculate progress if target and current are updated
          if (field === "current" || field === "target") {
            const target =
              field === "target" ? Number(value) : Number(kr.target);
            const current =
              field === "current" ? Number(value) : Number(kr.current);
            updated.progress =
              target > 0 ? Math.round((current / target) * 100) : 0;
          }
          return updated;
        }
        return kr;
      }),
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
      // Transform keyResults to match API expectations
      const transformedKeyResults = formData.keyResults.map((kr) => ({
        _id: kr._id,
        title: kr.title,
        target: Number(kr.target) || 0,
        current: Number(kr.current) || 0,
        unit: kr.unit,
        progress: kr.progress,
      }));

      const requestBody = {
        ...formData,
        keyResults: transformedKeyResults,
      };

      const res = await fetch(`/api/okrs/${okrId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update OKR");
      }

      // Redirect to OKR details page
      router.push(`/okrs/${okrId}`);
    } catch (error) {
      console.error("Error updating OKR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update OKR. Please try again."
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

    if (!isInitialLoading) {
      loadData();
    }
  }, [formData.objectiveType, isInitialLoading]);

  // Initial data fetch
  useEffect(() => {
    if (okrId) {
      fetchOKRData();
    }
  }, [okrId]);

  if (isInitialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading OKR data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit OKR</h1>
        <p className="text-muted-foreground">
          Update objective and key results
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
                      memberId: "",
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
                        <SelectItem key={team._id} value={team._id}>
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Key Result {index + 1}</h4>
                    {formData.keyResults.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyResult(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={kr.title}
                        onChange={(e) =>
                          updateKeyResult(index, "title", e.target.value)
                        }
                        placeholder="Enter key result"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Target</Label>
                        <Input
                          type="number"
                          value={kr.target}
                          onChange={(e) =>
                            updateKeyResult(index, "target", e.target.value)
                          }
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Current</Label>
                        <Input
                          type="number"
                          value={kr.current}
                          onChange={(e) =>
                            updateKeyResult(index, "current", e.target.value)
                          }
                          placeholder="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={kr.unit}
                          onChange={(e) =>
                            updateKeyResult(index, "unit", e.target.value)
                          }
                          placeholder="%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Progress</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(kr.progress, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium min-w-[3rem]">
                            {kr.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                Updating...
              </>
            ) : (
              "Update OKR"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
