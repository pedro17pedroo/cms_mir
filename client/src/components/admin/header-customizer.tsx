import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHeaderConfigSchema, type HeaderConfig, type InsertHeaderConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Save, Upload, Palette, Layout, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeaderCustomizerProps {}

export default function HeaderCustomizer({}: HeaderCustomizerProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: headerConfig, isLoading } = useQuery({
    queryKey: ["/api/header-config"],
  });

  const form = useForm<InsertHeaderConfig>({
    resolver: zodResolver(insertHeaderConfigSchema),
    defaultValues: {
      logoUrl: "",
      logoPosition: "left",
      logoSize: "medium",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      menuStyle: "horizontal",
      socialLinks: JSON.stringify([
        { platform: "facebook", url: "" },
        { platform: "instagram", url: "" },
        { platform: "youtube", url: "" },
        { platform: "whatsapp", url: "" }
      ]),
      contactInfo: JSON.stringify({
        phone: "",
        email: "",
        address: ""
      }),
    },
  });

  const updateHeaderMutation = useMutation({
    mutationFn: (data: InsertHeaderConfig) => {
      if (headerConfig) {
        return apiRequest(`/api/header-config/${headerConfig.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest("/api/header-config", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/header-config"] });
      toast({ title: "Configuração do header salva com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao salvar configuração", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertHeaderConfig) => {
    updateHeaderMutation.mutate(data);
  };

  // Load existing config into form
  useState(() => {
    if (headerConfig) {
      form.reset({
        logoUrl: headerConfig.logoUrl || "",
        logoPosition: headerConfig.logoPosition || "left",
        logoSize: headerConfig.logoSize || "medium",
        backgroundColor: headerConfig.backgroundColor || "#ffffff",
        textColor: headerConfig.textColor || "#000000",
        menuStyle: headerConfig.menuStyle || "horizontal",
        socialLinks: headerConfig.socialLinks || JSON.stringify([]),
        contactInfo: headerConfig.contactInfo || JSON.stringify({}),
      });
    }
  }, [headerConfig, form]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalização do Header</CardTitle>
          <CardDescription>Carregando configurações...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personalização do Header</CardTitle>
              <CardDescription>
                Configure aparência, logo e informações do cabeçalho em tempo real
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Editar" : "Visualizar"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {previewMode ? (
            // Preview Mode
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-4">Prévia do Header</h3>
                <div 
                  className="border rounded-lg p-4"
                  style={{
                    backgroundColor: form.watch("backgroundColor"),
                    color: form.watch("textColor")
                  }}
                >
                  <div className={`flex items-center ${form.watch("logoPosition") === "center" ? "justify-center" : "justify-between"}`}>
                    <div className="flex items-center gap-4">
                      {form.watch("logoUrl") && (
                        <img 
                          src={form.watch("logoUrl")} 
                          alt="Logo" 
                          className={`${
                            form.watch("logoSize") === "small" ? "h-8" :
                            form.watch("logoSize") === "large" ? "h-16" : "h-12"
                          }`}
                        />
                      )}
                      <span className="font-bold text-lg">Igreja Comunidade de Fé</span>
                    </div>
                    {form.watch("logoPosition") !== "center" && (
                      <nav className="flex gap-6">
                        <a href="#" className="hover:opacity-75">Início</a>
                        <a href="#" className="hover:opacity-75">Sobre</a>
                        <a href="#" className="hover:opacity-75">Serviços</a>
                        <a href="#" className="hover:opacity-75">Contato</a>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Logo Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <h3 className="text-lg font-medium">Configuração do Logo</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Logo</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemplo.com/logo.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posição do Logo</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Esquerda</SelectItem>
                                <SelectItem value="center">Centro</SelectItem>
                                <SelectItem value="right">Direita</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho do Logo</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Pequeno</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="large">Grande</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Color Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <h3 className="text-lg font-medium">Cores</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor de Fundo</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input type="color" {...field} className="w-16" />
                              <Input placeholder="#ffffff" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor do Texto</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input type="color" {...field} className="w-16" />
                              <Input placeholder="#000000" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Menu Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    <h3 className="text-lg font-medium">Menu</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="menuStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo do Menu</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horizontal">Horizontal</SelectItem>
                              <SelectItem value="vertical">Vertical</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <h3 className="text-lg font-medium">Redes Sociais</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="socialLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Links das Redes Sociais (JSON)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='[{"platform": "facebook", "url": "https://facebook.com/igreja"}]'
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informações de Contato (JSON)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='{"phone": "+55 11 99999-9999", "email": "contato@igreja.com", "address": "Rua da Igreja, 123"}'
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateHeaderMutation.isPending}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}