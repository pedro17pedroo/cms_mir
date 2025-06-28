import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLandingPageSectionSchema, type LandingPageSection, type InsertLandingPageSection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LandingPageManagerProps {}

export default function LandingPageManager({}: LandingPageManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null);
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["/api/landing-page-sections"],
  });

  const form = useForm<InsertLandingPageSection>({
    resolver: zodResolver(insertLandingPageSectionSchema),
    defaultValues: {
      sectionType: "hero",
      title: "",
      content: JSON.stringify({
        text: "",
        buttonText: "",
        buttonLink: "",
        backgroundColor: "#ffffff",
        textColor: "#000000"
      }),
      order: 0,
      isActive: true,
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: (data: InsertLandingPageSection) => apiRequest("/api/landing-page-sections", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Seção criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar seção", variant: "destructive" });
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertLandingPageSection> }) => 
      apiRequest(`/api/landing-page-sections/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      setIsDialogOpen(false);
      setEditingSection(null);
      form.reset();
      toast({ title: "Seção atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar seção", variant: "destructive" });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/landing-page-sections/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      toast({ title: "Seção removida com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover seção", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertLandingPageSection) => {
    if (editingSection) {
      updateSectionMutation.mutate({ id: editingSection.id, data });
    } else {
      createSectionMutation.mutate(data);
    }
  };

  const handleEdit = (section: LandingPageSection) => {
    setEditingSection(section);
    form.reset({
      sectionType: section.sectionType,
      title: section.title,
      content: section.content,
      order: section.order,
      isActive: section.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleNewSection = () => {
    setEditingSection(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const toggleActive = (section: LandingPageSection) => {
    updateSectionMutation.mutate({
      id: section.id,
      data: { isActive: !section.isActive }
    });
  };

  const moveSection = (section: LandingPageSection, direction: 'up' | 'down') => {
    const currentOrder = section.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    updateSectionMutation.mutate({
      id: section.id,
      data: { order: newOrder }
    });
  };

  const sectionTypes = [
    { value: "hero", label: "Hero/Banner" },
    { value: "announcements", label: "Anúncios" },
    { value: "events", label: "Próximos Eventos" },
    { value: "sermons", label: "Mensagens Recentes" },
    { value: "testimonials", label: "Testemunhos" },
    { value: "about", label: "Sobre Nós" },
    { value: "contact", label: "Contato" },
    { value: "donations", label: "Doações" },
    { value: "custom", label: "Personalizada" },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Landing Page</CardTitle>
          <CardDescription>Carregando seções...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sortedSections = [...sections].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Landing Page</CardTitle>
              <CardDescription>
                Configure seções da página inicial com drag-and-drop
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Seção
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSection ? "Editar Seção" : "Nova Seção"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sectionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Seção</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Seção</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da seção" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuração (JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"text": "Conteúdo", "buttonText": "Botão", "buttonLink": "/link", "backgroundColor": "#ffffff"}'
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel>Ativa</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                      >
                        {editingSection ? "Atualizar" : "Criar"} Seção
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSections.map((section: any) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{section.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {sectionTypes.find(t => t.value === section.sectionType)?.label}
                      </Badge>
                      {section.isActive ? (
                        <Badge variant="default" className="text-xs">Ativa</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Inativa</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Ordem: {section.order}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tipo: {section.sectionType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section, 'up')}
                    disabled={(section.order || 0) <= 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(section)}
                  >
                    {section.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSectionMutation.mutate(section.id)}
                    disabled={deleteSectionMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}