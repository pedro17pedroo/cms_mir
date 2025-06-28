import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { ServiceSchedule } from "@shared/schema";

export default function EventManager() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: schedules, isLoading } = useQuery<ServiceSchedule[]>({
    queryKey: ["/api/service-schedules"],
  });

  const [scheduleForm, setScheduleForm] = useState({
    day: "",
    title: "",
    description: "",
    time: "",
    icon: "fas fa-church",
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/service-schedules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-schedules"] });
      toast({
        title: "Success",
        description: "Service schedule created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service schedule",
        variant: "destructive",
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/service-schedules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-schedules"] });
      toast({
        title: "Success",
        description: "Service schedule updated successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service schedule",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setScheduleForm({
      day: "",
      title: "",
      description: "",
      time: "",
      icon: "fas fa-church",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (schedule: ServiceSchedule) => {
    setScheduleForm({
      day: schedule.day,
      title: schedule.title,
      description: schedule.description,
      time: schedule.time,
      icon: schedule.icon,
    });
    setIsEditing(true);
    setEditingId(schedule.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateScheduleMutation.mutate({ id: editingId, data: scheduleForm });
    } else {
      createScheduleMutation.mutate(scheduleForm);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Schedule Manager</h2>
          <p className="text-gray-600">Manage your church service times and events</p>
        </div>
        <Button
          onClick={() => {
            if (isEditing) {
              resetForm();
            } else {
              // Form is already ready for new creation
            }
          }}
          className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel Edit" : "Add Schedule"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Schedule" : "Create New Schedule"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the service schedule" : "Add a new service schedule"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="day">Day</Label>
                <Input
                  id="day"
                  value={scheduleForm.day}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                  placeholder="e.g., Domingo, Segunda-feira"
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  placeholder="e.g., Culto de Adoração"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                  placeholder="Brief description of the service"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  placeholder="e.g., 09:00 até 11:00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Class</Label>
                <Input
                  id="icon"
                  value={scheduleForm.icon}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, icon: e.target.value })}
                  placeholder="e.g., fas fa-church"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
                className="w-full bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
              >
                {(createScheduleMutation.isPending || updateScheduleMutation.isPending) 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Schedule" : "Create Schedule")
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Schedules</CardTitle>
            <CardDescription>
              Current service schedules on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules?.map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{schedule.day}</div>
                      <div className="font-medium text-gray-900">{schedule.title}</div>
                      <div className="text-sm text-gray-600">{schedule.description}</div>
                      <div className="text-sm text-[hsl(43,96%,56%)] font-medium mt-1">
                        {schedule.time}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {!schedules?.length && (
                <div className="text-center py-8 text-gray-500">
                  No service schedules found. Create your first schedule using the form.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
