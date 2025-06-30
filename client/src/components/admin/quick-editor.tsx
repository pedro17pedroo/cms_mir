import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Clock, Eye, Save, X, Zap } from "lucide-react";
import type { BibleVerse, Message, Testimonial } from "@shared/schema";

export default function QuickEditor() {
  const { toast } = useToast();
  
  const { data: bibleVerse } = useQuery<BibleVerse>({
    queryKey: ["/api/bible-verse"],
  });

  const { data: featuredMessage } = useQuery<Message>({
    queryKey: ["/api/messages/featured"],
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const [editingBibleVerse, setEditingBibleVerse] = useState(false);
  const [editingMessage, setEditingMessage] = useState(false);

  const [bibleVerseForm, setBibleVerseForm] = useState({
    verse: "",
    reference: "",
    backgroundImage: "",
  });

  const [messageForm, setMessageForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    if (bibleVerse) {
      setBibleVerseForm({
        verse: bibleVerse.verse || "",
        reference: bibleVerse.reference || "",
        backgroundImage: bibleVerse.backgroundImage || "",
      });
    }
  }, [bibleVerse]);

  useEffect(() => {
    if (featuredMessage) {
      setMessageForm({
        title: featuredMessage.title || "",
        description: featuredMessage.description || "",
        imageUrl: featuredMessage.imageUrl || "",
        category: featuredMessage.category || "",
      });
    }
  }, [featuredMessage]);

  const updateBibleVerseMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/bible-verse", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bible-verse"] });
      toast({
        title: "Versículo atualizado",
        description: "Versículo bíblico atualizado com sucesso",
      });
      setEditingBibleVerse(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar versículo",
        variant: "destructive",
      });
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      if (featuredMessage) {
        await apiRequest("PUT", `/api/messages/${featuredMessage.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Mensagem atualizada",
        description: "Mensagem em destaque atualizada com sucesso",
      });
      setEditingMessage(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar mensagem",
        variant: "destructive",
      });
    },
  });

  const handleBibleVerseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBibleVerseMutation.mutate(bibleVerseForm);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMessageMutation.mutate(messageForm);
  };

  const cancelBibleVerseEdit = () => {
    if (bibleVerse) {
      setBibleVerseForm({
        verse: bibleVerse.verse || "",
        reference: bibleVerse.reference || "",
        backgroundImage: bibleVerse.backgroundImage || "",
      });
    }
    setEditingBibleVerse(false);
  };

  const cancelMessageEdit = () => {
    if (featuredMessage) {
      setMessageForm({
        title: featuredMessage.title || "",
        description: featuredMessage.description || "",
        imageUrl: featuredMessage.imageUrl || "",
        category: featuredMessage.category || "",
      });
    }
    setEditingMessage(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Zap className="h-6 w-6 text-[hsl(43,96%,56%)]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editor Rápido</h2>
          <p className="text-gray-600">Edite conteúdo frequentemente atualizado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bible Verse Quick Edit */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Versículo em Destaque
                </CardTitle>
                <CardDescription>
                  Atualização rápida do versículo principal
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Visível agora
                </Badge>
                {!editingBibleVerse && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBibleVerse(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingBibleVerse ? (
              <form onSubmit={handleBibleVerseSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="verse">Versículo</Label>
                  <Textarea
                    id="verse"
                    value={bibleVerseForm.verse}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, verse: e.target.value })}
                    placeholder="Digite o versículo bíblico"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reference">Referência</Label>
                  <Input
                    id="reference"
                    value={bibleVerseForm.reference}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, reference: e.target.value })}
                    placeholder="Ex: João 3:16"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="verseBackground">URL da Imagem de Fundo</Label>
                  <Input
                    id="verseBackground"
                    value={bibleVerseForm.backgroundImage}
                    onChange={(e) => setBibleVerseForm({ ...bibleVerseForm, backgroundImage: e.target.value })}
                    placeholder="URL da imagem de fundo"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateBibleVerseMutation.isPending}
                    size="sm"
                    className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {updateBibleVerseMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={cancelBibleVerseEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <blockquote className="italic text-gray-700 border-l-4 border-[hsl(43,96%,56%)] pl-4">
                  "{bibleVerse?.verse}"
                </blockquote>
                <p className="text-sm text-gray-600 font-medium">
                  {bibleVerse?.reference}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Message Quick Edit */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Mensagem em Destaque
                </CardTitle>
                <CardDescription>
                  Atualização rápida da mensagem principal
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Destaque
                </Badge>
                {!editingMessage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMessage(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingMessage ? (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="messageTitle">Título</Label>
                  <Input
                    id="messageTitle"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                    placeholder="Título da mensagem"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="messageDescription">Descrição</Label>
                  <Textarea
                    id="messageDescription"
                    value={messageForm.description}
                    onChange={(e) => setMessageForm({ ...messageForm, description: e.target.value })}
                    placeholder="Descrição da mensagem"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="messageImage">URL da Imagem</Label>
                    <Input
                      id="messageImage"
                      value={messageForm.imageUrl}
                      onChange={(e) => setMessageForm({ ...messageForm, imageUrl: e.target.value })}
                      placeholder="URL da imagem"
                    />
                  </div>
                  <div>
                    <Label htmlFor="messageCategory">Categoria</Label>
                    <Input
                      id="messageCategory"
                      value={messageForm.category}
                      onChange={(e) => setMessageForm({ ...messageForm, category: e.target.value })}
                      placeholder="Ex: Sermão, Reflexão"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateMessageMutation.isPending}
                    size="sm"
                    className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {updateMessageMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={cancelMessageEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {featuredMessage?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {featuredMessage?.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {featuredMessage?.category}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Testimonials */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Testemunhos Recentes
            </CardTitle>
            <CardDescription>
              Visualização rápida dos testemunhos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials?.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.location}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {testimonial.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Gerenciar Testemunhos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}