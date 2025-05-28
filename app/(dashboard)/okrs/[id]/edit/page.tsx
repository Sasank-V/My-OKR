"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Plus, Trash2, Target } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditOKRPage() {
  const router = useRouter();
  const params = useParams();
  const okrId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    owner: "",
    department: "",
    team: "",
    startDate: "",
    endDate: "",
    status: "",
    progress: 0,
    keyResults: [
      { id: 1, title: "", target: "", unit: "", current: 0, progress: 0 },
    ],
  });

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate fetching OKR data
    const mockOKR = {
      title: "Increase Annual Revenue",
      description: "Drive company growth through strategic initiatives",
      type: "company",
      owner: "CEO",
      department: "Executive",
      team: "Leadership",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "On Track",
      progress: 75,
      keyResults: [
        {
          id: 1,
          title: "Achieve $10M ARR",
          target: "10000000",
          unit: "$",
          current: 8000000,
          progress: 80,
        },
        {
          id: 2,
          title: "Expand to 3 new markets",
          target: "3",
          unit: "markets",
          current: 2,
          progress: 67,
        },
        {
          id: 3,
          title: "Increase customer retention to 95%",
          target: "95",
          unit: "%",
          current: 78,
          progress: 78,
        },
      ],
    };
    setFormData(mockOKR);
  }, [okrId]);

  const addKeyResult = () => {
    const newId = Math.max(...formData.keyResults.map((kr) => kr.id)) + 1;
    setFormData((prev) => ({
      ...prev,
      keyResults: [
        ...prev.keyResults,
        { id: newId, title: "", target: "", unit: "", current: 0, progress: 0 },
      ],
    }));
  };

  const removeKeyResult = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.filter((kr) => kr.id !== id),
    }));
  };

  const updateKeyResult = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.map((kr) => {
        if (kr.id === id) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating OKR:", formData);
    router.push(`/okrs/${okrId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-blue-600" />
          Edit OKR
        </h1>
        <p className="text-muted-foreground">
          Update objective and key results
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="type">OKR Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  placeholder="Objective owner"
                />
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
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Behind">Behind</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
            <div className="space-y-6">
              {formData.keyResults.map((kr) => (
                <div key={kr.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Key Result {kr.id}</h4>
                    {formData.keyResults.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyResult(kr.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={kr.title}
                        onChange={(e) =>
                          updateKeyResult(kr.id, "title", e.target.value)
                        }
                        placeholder="Enter key result"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label>Target</Label>
                        <Input
                          type="number"
                          value={kr.target}
                          onChange={(e) =>
                            updateKeyResult(kr.id, "target", e.target.value)
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
                            updateKeyResult(
                              kr.id,
                              "current",
                              Number(e.target.value)
                            )
                          }
                          placeholder="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={kr.unit}
                          onChange={(e) =>
                            updateKeyResult(kr.id, "unit", e.target.value)
                          }
                          placeholder="%"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{kr.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${kr.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Update OKR</Button>
        </div>
      </form>
    </div>
  );
}
