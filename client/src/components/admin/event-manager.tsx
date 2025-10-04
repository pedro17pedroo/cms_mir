import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Plus, Edit, Trash2, MapPin, Users, Clock, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema, type Event, type InsertEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const eventCategories = [
  "Culto Especial",
  "Conferência",
  "Retiro Espiritual",
  "Encontro de Jovens",
  "Encontro de Casais",
  "Evangelização",
  "Escola Dominical",
  "Vigília",
  "Seminário",
  "Workshop",
  "Concerto de Louvor",
  "Ação Social",
  "Outros"
];

export default function EventManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertEvent) => 
      apiRequest("/api/events", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      toast({ title: "Evento criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar evento", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: InsertEvent & { id: number }) =>
      apiRequest(`/api/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      toast({ title: "Evento atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar evento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Evento removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover evento", variant: "destructive" });
    },
  });

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      imageUrl: "",
      category: "",
      registrationLink: "",
      maxAttendees: undefined,
    },
  });

  const handleSubmit = (data: InsertEvent) => {
    if (editingEvent) {
      updateMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      imageUrl: event.imageUrl,
      category: event.category,
      registrationLink: event.registrationLink || "",
      maxAttendees: event.maxAttendees || undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    form.reset({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      imageUrl: "",
      category: "",
      registrationLink: "",
      maxAttendees: undefined,
    });
    setIsDialogOpen(true);
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingEvents = sortedEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = sortedEvents.filter(event => new Date(event.date) < new Date());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="loading-events">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestor de Eventos</h2>
          <p className="text-gray-600">Gerencie eventos, conferências e atividades da igreja</p>
        </div>
        <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700" data-testid="button-add-event">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900" data-testid="text-total-events">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-upcoming-events">
              {upcomingEvents.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Eventos Passados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500" data-testid="text-past-events">
              {pastEvents.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-total-attendees">
              {events.reduce((acc, event) => acc + (event.currentAttendees || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por título, descrição ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-events"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category-filter" className="w-48" data-testid="select-category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {eventCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">Eventos Passados</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow" data-testid={`card-event-${event.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(event)} data-testid={`button-edit-${event.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" data-testid={`button-delete-${event.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      {event.maxAttendees && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.currentAttendees || 0}/{event.maxAttendees} inscritos
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum evento próximo
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "Tente ajustar os filtros de busca."
                    : "Comece criando um evento para a comunidade."}
                </p>
                {(!searchTerm && filterCategory === "all") && (
                  <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastEvents.length > 0 ? (
            <div className="grid gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow opacity-75" data-testid={`card-past-event-${event.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="outline">{event.category}</Badge>
                          <Badge variant="secondary">Concluído</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" data-testid={`button-delete-past-${event.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      {event.currentAttendees && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.currentAttendees} participantes
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum evento passado
                </h3>
                <p className="text-gray-600">
                  Eventos concluídos aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? "Edite as informações do evento" : "Crie um novo evento para a comunidade"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="registration">Inscrições</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Evento *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Conferência Anual 2025" {...field} data-testid="input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o evento, programação, palestrantes, etc."
                            rows={4}
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 19:00" {...field} data-testid="input-time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Templo Principal - Rua X, 123" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="https://exemplo.com/imagem-evento.jpg" {...field} data-testid="input-image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="registration" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="registrationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link de Inscrição</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://forms.google.com/..." 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-registration-link"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Máximo de Participantes</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Ex: 100 (deixe vazio para ilimitado)"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            data-testid="input-max-attendees"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="button-save-event"
                >
                  {(createMutation.isPending || updateMutation.isPending) 
                    ? "Salvando..." 
                    : (editingEvent ? "Atualizar Evento" : "Criar Evento")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
