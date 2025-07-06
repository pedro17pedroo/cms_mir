import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Heart, CreditCard, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StripePaymentForm } from '@/components/payment/StripePaymentForm';

interface DonationCampaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
}

interface PaymentConfig {
  publishableKey: string;
  isConfigured: boolean;
}

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch donation campaigns
  const { data: campaigns = [] } = useQuery<DonationCampaign[]>({
    queryKey: ['/api/donation-campaigns'],
  });

  // Fetch payment configuration
  const { data: paymentConfig } = useQuery<PaymentConfig>({
    queryKey: ['/api/payments/config'],
  });

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !donorName || !donorEmail) {
      toast({
        title: "Informações Incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Valor Inválido",
        description: "Por favor, insira um valor de doação válido.",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (donation: any) => {
    toast({
      title: "Doação Confirmada!",
      description: `Obrigado pela sua doação de R$ ${amount}. Deus abençoe!`,
    });

    // Reset form
    setAmount('');
    setDonorName('');
    setDonorEmail('');
    setMessage('');
    setSelectedCampaign('');
    setShowPaymentForm(false);
    
    queryClient.invalidateQueries({ queryKey: ['/api/donation-campaigns'] });
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  const predefinedAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Show payment form when ready to pay */}
      {showPaymentForm ? (
        <StripePaymentForm
          amount={parseFloat(amount)}
          currency="brl"
          campaignId={selectedCampaign ? parseInt(selectedCampaign) : undefined}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      ) : (
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <CardTitle className="text-3xl font-bold text-purple-800">Faça sua Doação</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Sua generosidade faz a diferença na nossa missão de servir e abençoar vidas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
          {/* Payment Configuration Alert */}
          {!paymentConfig?.isConfigured && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Para processar doações, é necessário configurar as chaves do Stripe.
                Entre em contato com o administrador para configurar o sistema de pagamentos.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleContinueToPayment} className="space-y-6">
            {/* Campaign Selection */}
            {campaigns.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="campaign">Campanha (Opcional)</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma campanha específica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Doação Geral</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.title} - €{campaign.raised.toFixed(2)}/€{campaign.goal.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Amount Selection */}
            <div className="space-y-4">
              <Label htmlFor="amount">Valor da Doação (€)</Label>
              
              {/* Predefined amounts */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {predefinedAmounts.map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    type="button"
                    variant={amount === presetAmount.toString() ? "default" : "outline"}
                    className="h-12"
                    onClick={() => setAmount(presetAmount.toString())}
                  >
                    €{presetAmount}
                  </Button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Outro valor</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            <Separator />

            {/* Donor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Nome Completo *</Label>
                <Input
                  id="donorName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email *</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (Opcional)</Label>
              <Textarea
                id="message"
                placeholder="Deixe uma mensagem ou motivo da sua doação..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto px-12 py-3 text-lg"
                disabled={isProcessing || !paymentConfig?.isConfigured}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isProcessing ? 'Processando...' : `Doar €${amount || '0.00'}`}
              </Button>

              {!paymentConfig?.isConfigured && (
                <p className="text-sm text-gray-500 mt-2">
                  Sistema de pagamentos em configuração
                </p>
              )}
            </div>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>🔒 Transação segura protegida por SSL</p>
              <p>Suas informações de pagamento são processadas de forma segura</p>
            </div>
          </form>
        </CardContent>
        </Card>
      )}

      {/* Campaign Progress Cards */}
      {campaigns.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-center">Campanhas Ativas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => {
              const progressPercentage = (campaign.raised / campaign.goal) * 100;
              return (
                <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>€{campaign.raised.toFixed(2)} arrecadados</span>
                        <span>Meta: €{campaign.goal.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        {progressPercentage.toFixed(1)}% da meta alcançada
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}