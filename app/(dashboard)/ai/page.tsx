"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OKR {
  id: string;
  title: string;
  description: string;
  owner: string;
  team: string;
  progress: number;
  status: "on-track" | "at-risk" | "completed";
  dueDate: string;
  keyResults: {
    id: string;
    title: string;
    progress: number;
    target: number;
    current: number;
    unit: string;
  }[];
}

interface AISuggestion {
  okrId: string;
  suggestions: {
    implementation: string[];
    milestones: string[];
    risks: string[];
    resources: string[];
    timeline: string;
  };
  confidence: number;
}

export default function AISuggestionsPage() {
  const { toast } = useToast();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [selectedOkr, setSelectedOkr] = useState<OKR | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  // Mock OKR data - replace with actual API call
  useEffect(() => {
    const fetchOKRs = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockOKRs: OKR[] = [
          {
            id: "1",
            title: "Increase Customer Satisfaction Score",
            description:
              "Improve overall customer satisfaction to drive retention and growth",
            owner: "John Doe",
            team: "Customer Success",
            progress: 65,
            status: "on-track",
            dueDate: "2024-03-31",
            keyResults: [
              {
                id: "1",
                title: "Achieve NPS score of 50+",
                progress: 70,
                target: 50,
                current: 42,
                unit: "points",
              },
              {
                id: "2",
                title: "Reduce support ticket resolution time to <2 hours",
                progress: 60,
                target: 2,
                current: 2.8,
                unit: "hours",
              },
              {
                id: "3",
                title: "Increase customer retention rate to 95%",
                progress: 65,
                target: 95,
                current: 89,
                unit: "%",
              },
            ],
          },
          {
            id: "2",
            title: "Launch New Product Feature",
            description:
              "Successfully launch the AI-powered analytics dashboard",
            owner: "Jane Smith",
            team: "Product",
            progress: 45,
            status: "at-risk",
            dueDate: "2024-02-28",
            keyResults: [
              {
                id: "4",
                title: "Complete feature development",
                progress: 60,
                target: 100,
                current: 60,
                unit: "%",
              },
              {
                id: "5",
                title: "Conduct user testing with 50+ users",
                progress: 30,
                target: 50,
                current: 15,
                unit: "users",
              },
              {
                id: "6",
                title: "Achieve 90% user satisfaction in beta",
                progress: 45,
                target: 90,
                current: 78,
                unit: "%",
              },
            ],
          },
          {
            id: "3",
            title: "Improve Team Productivity",
            description: "Enhance team efficiency and reduce time-to-delivery",
            owner: "Mike Johnson",
            team: "Engineering",
            progress: 80,
            status: "on-track",
            dueDate: "2024-01-31",
            keyResults: [
              {
                id: "7",
                title: "Reduce average PR review time to <4 hours",
                progress: 85,
                target: 4,
                current: 3.2,
                unit: "hours",
              },
              {
                id: "8",
                title: "Increase deployment frequency to 2x per week",
                progress: 75,
                target: 2,
                current: 1.8,
                unit: "deployments",
              },
              {
                id: "9",
                title: "Achieve 95% test coverage",
                progress: 80,
                target: 95,
                current: 91,
                unit: "%",
              },
            ],
          },
        ];

        setOkrs(mockOKRs);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch OKRs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOKRs();
  }, [toast]);

  const generateAISuggestions = async (okr: OKR) => {
    setGeneratingSuggestions(true);
    try {
      // TODO: Replace with actual AI API call
      // const response = await fetch('/api/ai/suggestions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ okr, customPrompt })
      // })
      // const data = await response.json()

      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI suggestions - replace with actual AI response
      const mockSuggestions: AISuggestion = {
        okrId: okr.id,
        suggestions: {
          implementation: [
            "Implement a customer feedback loop with weekly surveys",
            "Create a dedicated customer success team with clear escalation paths",
            "Develop automated follow-up sequences for support tickets",
            "Establish regular check-ins with key accounts",
            "Implement a customer health scoring system",
          ],
          milestones: [
            "Week 1-2: Set up feedback collection system",
            "Week 3-4: Train support team on new processes",
            "Week 5-6: Launch customer health scoring",
            "Week 7-8: Implement automated follow-ups",
            "Week 9-12: Monitor and optimize based on results",
          ],
          risks: [
            "Customer survey fatigue may reduce response rates",
            "Support team may need additional training time",
            "Integration with existing systems could face technical challenges",
            "Budget constraints for additional tooling",
          ],
          resources: [
            "Customer Success Manager (0.5 FTE)",
            "Survey platform subscription ($200/month)",
            "Training materials and workshops",
            "Analytics dashboard setup",
            "Customer communication templates",
          ],
          timeline: "12 weeks with monthly review checkpoints",
        },
        confidence: 87,
      };

      setSuggestions(mockSuggestions);

      toast({
        title: "AI Suggestions Generated!",
        description: "Review the implementation recommendations below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions",
        variant: "destructive",
      });
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "on-track":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "on-track":
        return "secondary";
      case "at-risk":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Implementation Suggestions
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Get intelligent recommendations for achieving your OKRs
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* OKRs List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your OKRs</h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered
                </Badge>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {okrs.map((okr) => (
                    <Card
                      key={okr.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedOkr?.id === okr.id
                          ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      }`}
                      onClick={() => setSelectedOkr(okr)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {okr.title}
                              <Badge
                                variant={getStatusColor(okr.status)}
                                className="ml-2"
                              >
                                {getStatusIcon(okr.status)}
                                {okr.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {okr.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {okr.progress}%
                            </div>
                            <Progress
                              value={okr.progress}
                              className="w-20 mt-1"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {okr.team}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {okr.dueDate}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">
                            Key Results ({okr.keyResults.length})
                          </p>
                          <div className="space-y-2">
                            {okr.keyResults.slice(0, 2).map((kr) => (
                              <div
                                key={kr.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="truncate flex-1">
                                  {kr.title}
                                </span>
                                <div className="flex items-center gap-2 ml-2">
                                  <Progress
                                    value={kr.progress}
                                    className="w-16"
                                  />
                                  <span className="text-xs text-muted-foreground w-8">
                                    {kr.progress}%
                                  </span>
                                </div>
                              </div>
                            ))}
                            {okr.keyResults.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{okr.keyResults.length - 2} more
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* AI Suggestions Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  AI Implementation Guide
                </h2>
                {selectedOkr && (
                  <Button
                    onClick={() => generateAISuggestions(selectedOkr)}
                    disabled={generatingSuggestions}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    {generatingSuggestions ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Get AI Suggestions
                      </>
                    )}
                  </Button>
                )}
              </div>

              {!selectedOkr ? (
                <Card className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select an OKR</h3>
                    <p className="text-muted-foreground">
                      Choose an OKR from the list to get AI-powered
                      implementation suggestions
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Custom Prompt */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Custom Context (Optional)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add any specific context, constraints, or requirements for this OKR..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  {/* Selected OKR Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Selected OKR</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-2">
                        {selectedOkr.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedOkr.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant={getStatusColor(selectedOkr.status)}>
                          {getStatusIcon(selectedOkr.status)}
                          {selectedOkr.status}
                        </Badge>
                        <span>{selectedOkr.progress}% complete</span>
                        <span>Due: {selectedOkr.dueDate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Suggestions */}
                  {suggestions && suggestions.okrId === selectedOkr.id && (
                    <div className="space-y-4">
                      {/* Confidence Score */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              AI Confidence Score
                            </span>
                            <span className="text-sm font-bold">
                              {suggestions.confidence}%
                            </span>
                          </div>
                          <Progress
                            value={suggestions.confidence}
                            className="h-2"
                          />
                        </CardContent>
                      </Card>

                      {/* Implementation Steps */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowRight className="h-5 w-5" />
                            Implementation Steps
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {suggestions.suggestions.implementation.map(
                              (step, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm">{step}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Timeline & Milestones */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Timeline & Milestones
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium mb-3">
                            Timeline: {suggestions.suggestions.timeline}
                          </p>
                          <ul className="space-y-2">
                            {suggestions.suggestions.milestones.map(
                              (milestone, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  {milestone}
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Resources Needed */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Resources Needed
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {suggestions.suggestions.resources.map(
                              (resource, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  {resource}
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Potential Risks */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Potential Risks
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {suggestions.suggestions.risks.map(
                              (risk, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  {risk}
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
