import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, MessageSquare, Calendar, Star } from "lucide-react";
import type { Message } from "@shared/schema";

export default function MessageManager() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const [messageForm, setMessageForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    date: "",
    isFeatured: false,
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/featured"] });
      toast({
        title: "Success",
        description: "Message created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create message",
        variant: "destructive",
      });
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/messages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/featured"] });
      toast({
        title: "Success",
        description: "Message updated successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/featured"] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setMessageForm({
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      date: "",
      isFeatured: false,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (message: Message) => {
    setMessageForm({
      title: message.title,
      description: message.description,
      imageUrl: message.imageUrl,
      category: message.category,
      date: message.date,
      isFeatured: message.isFeatured || false,
    });
    setIsEditing(true);
    setEditingId(message.id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateMessageMutation.mutate({ id: editingId, data: messageForm });
    } else {
      createMessageMutation.mutate(messageForm);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'live':
        return 'bg-red-500';
      case 'evento':
        return 'bg-[hsl(262,83%,58%)]';
      case 'conferência':
        return 'bg-[hsl(43,96%,56%)]';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Manager</h2>
          <p className="text-gray-600">Manage sermons, events, and church updates</p>
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
          {isEditing ? "Cancel Edit" : "Add Message"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Message" : "Create New Message"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the message/sermon" : "Add a new message or sermon"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                  placeholder="Message title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={messageForm.description}
                  onChange={(e) => setMessageForm({ ...messageForm, description: e.target.value })}
                  placeholder="Brief description of the message"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={messageForm.category}
                  onChange={(e) => setMessageForm({ ...messageForm, category: e.target.value })}
                  placeholder="e.g., Live, Evento, Conferência"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={messageForm.date}
                  onChange={(e) => setMessageForm({ ...messageForm, date: e.target.value })}
                  placeholder="e.g., 15 de Janeiro, 2025"
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={messageForm.imageUrl}
                  onChange={(e) => setMessageForm({ ...messageForm, imageUrl: e.target.value })}
                  placeholder="Message thumbnail image URL"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={messageForm.isFeatured}
                  onCheckedChange={(checked) => setMessageForm({ ...messageForm, isFeatured: checked })}
                />
                <Label htmlFor="isFeatured" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Featured Message</span>
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={createMessageMutation.isPending || updateMessageMutation.isPending}
                className="w-full bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
              >
                {(createMessageMutation.isPending || updateMessageMutation.isPending) 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Message" : "Create Message")
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Messages</CardTitle>
            <CardDescription>
              Current messages and sermons on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages?.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      <img
                        src={message.imageUrl}
                        alt={message.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=300&auto=format&fit=crop';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{message.title}</h4>
                          {message.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${getCategoryColor(message.category)} text-white`}>
                            {message.category}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {message.date}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(message)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMessageMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {!messages?.length && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>No messages found.</div>
                  <div className="text-sm">Create your first message using the form.</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
