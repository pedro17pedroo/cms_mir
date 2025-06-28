import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, User } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialManager() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    location: "",
    content: "",
    initial: "",
  });

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create testimonial",
        variant: "destructive",
      });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTestimonialForm({
      name: "",
      location: "",
      content: "",
      initial: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setTestimonialForm({
      name: testimonial.name,
      location: testimonial.location,
      content: testimonial.content,
      initial: testimonial.initial,
    });
    setIsEditing(true);
    setEditingId(testimonial.id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateTestimonialMutation.mutate({ id: editingId, data: testimonialForm });
    } else {
      createTestimonialMutation.mutate(testimonialForm);
    }
  };

  // Auto-generate initial from name
  const handleNameChange = (name: string) => {
    setTestimonialForm({ 
      ...testimonialForm, 
      name,
      initial: name.charAt(0).toUpperCase()
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonial Manager</h2>
          <p className="text-gray-600">Manage faith testimonies from your congregation</p>
        </div>
        <Button
          onClick={() => {
            if (isEditing) {
              resetForm();
            }
          }}
          className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel Edit" : "Add Testimonial"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Testimonial" : "Create New Testimonial"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the testimonial" : "Add a new faith testimony"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={testimonialForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Ana Souza"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={testimonialForm.location}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                  placeholder="e.g., Viana, Luanda"
                  required
                />
              </div>

              <div>
                <Label htmlFor="initial">Initial</Label>
                <Input
                  id="initial"
                  value={testimonialForm.initial}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, initial: e.target.value.charAt(0).toUpperCase() })}
                  placeholder="First letter of name"
                  maxLength={1}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea
                  id="content"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  placeholder="Share your faith testimony..."
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                className="w-full bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
              >
                {(createTestimonialMutation.isPending || updateTestimonialMutation.isPending) 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Testimonial" : "Create Testimonial")
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Testimonials</CardTitle>
            <CardDescription>
              Current testimonials displayed on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testimonials?.map((testimonial) => (
                <div key={testimonial.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-[hsl(262,83%,58%)] rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.initial}
                        </div>
                        <div>
                          <div className="font-semibold text-[hsl(262,83%,58%)]">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 line-clamp-3">
                        {testimonial.content}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={deleteTestimonialMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {!testimonials?.length && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>No testimonials found.</div>
                  <div className="text-sm">Create your first testimonial using the form.</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
