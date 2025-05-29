"use client";

import React, { useState, useEffect } from "react";
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
import { Building2, Save } from "lucide-react";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    budget: "",
    location: "",
    establishedDate: "",
    mission: "",
    vision: "",
    status: "",
  });

  const availableHeads = [
    { id: "1", name: "John Smith", role: "VP of Engineering" },
    { id: "2", name: "Sarah Johnson", role: "Director of Marketing" },
    { id: "3", name: "Mike Wilson", role: "VP of Sales" },
    { id: "4", name: "Emily Davis", role: "HR Director" },
    { id: "5", name: "Tom Brown", role: "Finance Director" },
  ];

  useEffect(() => {
    async function fetchDepartment() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/departments/${departmentId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch department: ${res.statusText}`);
        }
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          head: data.head?._id || data.head || "",
          budget: data.budget ? String(data.budget) : "",
          location: data.location || "",
          establishedDate: data.establishedDate
            ? new Date(data.establishedDate).toISOString().slice(0, 10)
            : "",
          mission: data.mission || "",
          vision: data.vision || "",
          status: data.status || "",
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (departmentId) {
      fetchDepartment();
    }
  }, [departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/departments/${departmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update department");
      }

      router.push(`/departments/${departmentId}`);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const formatBudget = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(numericValue));
  };

  if (loading) return <p className="p-6">Loading department data...</p>;
  if (error)
    return (
      <p className="p-6 text-red-600 font-semibold">
        Error loading department: {error}
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building2 className="h-8 w-8 text-purple-600" />
          Edit Department Details
        </h1>
        <p className="text-muted-foreground">
          Update department information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>
              Basic details about the department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="head">Department Head</Label>
                <Select
                  value={formData.head}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, head: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department head" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHeads.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} - {person.role}
                      </SelectItem>
                    ))}
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
                placeholder="Describe the department's purpose and responsibilities"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Annual Budget</Label>
                <Input
                  id="budget"
                  value={formData.budget ? formatBudget(formData.budget) : ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((prev) => ({ ...prev, budget: numericValue }));
                  }}
                  placeholder="$1,000,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Office location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedDate">Established Date</Label>
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      establishedDate: e.target.value,
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Restructuring">Restructuring</SelectItem>
                  <SelectItem value="Merging">Merging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
            <CardDescription>
              Define the department's mission and vision statements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mission: e.target.value }))
                }
                placeholder="What is the department's primary purpose and how it serves the organization"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Vision Statement</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vision: e.target.value }))
                }
                placeholder="What future the department aims to achieve"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto flex items-center gap-2 justify-center"
        >
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
