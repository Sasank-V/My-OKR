"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface Person {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  team?: string;
  status?: string;
  avatar?: string;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPeople() {
      try {
        const res = await fetch("/api/people");
        if (!res.ok) throw new Error("Failed to fetch people");
        const data = await res.json();
        setPeople(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchPeople();
  }, []);

  if (loading) return <p className="p-6">Loading people...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">People</h1>
          <p className="text-muted-foreground">
            Manage team members and their information
          </p>
        </div>
        <Button asChild>
          <Link href="/people/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person) => (
          <Link href={`/people/${person._id}`} key={person._id}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {person.avatar ? (
                      <AvatarImage
                        src={person.avatar}
                        alt={person.name || "User"}
                      />
                    ) : (
                      <AvatarFallback>
                        {(person.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    {person.role && (
                      <CardDescription>{person.role}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {person.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {person.department && (
                    <div className="text-sm">
                      <span className="font-medium">Department:</span>{" "}
                      {person.department}
                    </div>
                  )}
                  {person.team && (
                    <div className="text-sm">
                      <span className="font-medium">Team:</span> {person.team}
                    </div>
                  )}
                  {person.status && (
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{person.status}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/people/${person._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
