import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("/api/contact", "POST", data),
    onSuccess: () => {
      toast({ title: "Mensagem enviada com sucesso!" });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao enviar mensagem", 
        description: "Tente novamente em alguns instantes.",
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contato</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Entre em contato conosco - estamos aqui para você
          </p>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-purple-800 mb-6">
                  Entre em Contato
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Estamos sempre prontos para ouvir você. Seja para dúvidas, oração, 
                  aconselhamento ou apenas para conversar, não hesite em nos contactar.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-2">Endereço</h3>
                        <p className="text-gray-600">
                          Rua da Igreja, 123<br />
                          Centro, Cidade - Estado<br />
                          CEP: 12345-678
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gold-100 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-gold-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-2">Telefone</h3>
                        <p className="text-gray-600">
                          (11) 99999-9999<br />
                          (11) 3333-3333
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-2">Email</h3>
                        <p className="text-gray-600">
                          contato@igreja.com.br<br />
                          pastor@igreja.com.br
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-2">Horário de Atendimento</h3>
                        <p className="text-gray-600">
                          Segunda a Sexta: 9h às 18h<br />
                          Sábado: 9h às 12h<br />
                          Domingo: 8h às 20h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">
                    Envie uma Mensagem
                  </CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contato em breve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Motivo do contato"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Digite sua mensagem aqui..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
            Siga-nos nas Redes Sociais
          </h2>
          <p className="text-gray-600 mb-8">
            Fique por dentro das novidades e participe da nossa comunidade online
          </p>
          
          <div className="flex justify-center space-x-6">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('https://facebook.com', '_blank')}
            >
              <Facebook className="h-6 w-6 mr-2" />
              Facebook
            </Button>
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => window.open('https://instagram.com', '_blank')}
            >
              <Instagram className="h-6 w-6 mr-2" />
              Instagram
            </Button>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              <MessageCircle className="h-6 w-6 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Como Chegar
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Mapa interativo da localização</p>
                  <p className="text-sm">Integração com Google Maps</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">Transporte Público</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Metrô: Estação Centro (500m)<br />
                    Ônibus: Linhas 100, 200, 300<br />
                    Ponto de ônibus em frente
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">Estacionamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Estacionamento próprio gratuito<br />
                    150 vagas disponíveis<br />
                    Acesso pela Rua Lateral
                  </p>
                </CardContent>
              </Card>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <MapPin className="h-4 w-4 mr-2" />
                Abrir no Google Maps
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de Oração ou Aconselhamento?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Estamos disponíveis 24h para emergências espirituais
          </p>
          <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
            <Phone className="h-5 w-5 mr-2" />
            Linha de Oração: (11) 99999-9999
          </Button>
        </div>
      </section>
    </div>
  );
}