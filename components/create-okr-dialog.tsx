"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Target, Trash2 } from "lucide-react";

interface KeyResult {
  id: string;
  title: string;
  target: string;
  unit: string;
}

export function CreateOKRDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [team, setTeam] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: "1", title: "", target: "", unit: "" },
  ]);
  const { toast } = useToast();

  const addKeyResult = () => {
    const newKR: KeyResult = {
      id: Date.now().toString(),
      title: "",
      target: "",
      unit: "",
    };
    setKeyResults([...keyResults, newKR]);
  };

  const removeKeyResult = (id: string) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((kr) => kr.id !== id));
    }
  };

  const updateKeyResult = (
    id: string,
    field: keyof KeyResult,
    value: string
  ) => {
    setKeyResults(
      keyResults.map((kr) => (kr.id === id ? { ...kr, [field]: value } : kr))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !title ||
      !description ||
      keyResults.some((kr) => !kr.title || !kr.target)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    console.log("Creating OKR:", {
      title,
      description,
      owner,
      team,
      dueDate,
      keyResults,
    });

    toast({
      title: "OKR Created!",
      description: "Your new objective has been successfully created.",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setOwner("");
    setTeam("");
    setDueDate("");
    setKeyResults([{ id: "1", title: "", target: "", unit: "" }]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create OKR
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create New OKR
          </DialogTitle>
          <DialogDescription>
            Define your objective and key results to track progress towards your
            goals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objective Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Objective Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Increase Customer Satisfaction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want to achieve and why it matters..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team">Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="customer-success">
                      Customer Success
                    </SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Key Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Key Results *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyResult}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Key Result
              </Button>
            </div>

            <div className="space-y-3">
              {keyResults.map((kr, index) => (
                <div key={kr.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Key Result {index + 1}
                    </Label>
                    {keyResults.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyResult(kr.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="e.g., Achieve NPS score of 50+"
                      value={kr.title}
                      onChange={(e) =>
                        updateKeyResult(kr.id, "title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Target value (e.g., 50)"
                      value={kr.target}
                      onChange={(e) =>
                        updateKeyResult(kr.id, "target", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder="Unit (e.g., points, %, users)"
                      value={kr.unit}
                      onChange={(e) =>
                        updateKeyResult(kr.id, "unit", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create OKR</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
