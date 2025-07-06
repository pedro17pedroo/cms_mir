import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  campaignId?: number;
  onSuccess?: (donation: any) => void;
  onCancel?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

function PaymentForm({ amount, currency = 'brl', campaignId, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await apiRequest(
        '/api/payments/create-intent',
        {
          method: 'POST',
          body: JSON.stringify({
            amount: amount * 100, // Convert to cents
            currency,
            donorName: donorInfo.name,
            donorEmail: donorInfo.email,
            campaignId,
            message: donorInfo.message,
          }),
        }
      );
      
      const intentResponse = await response.json();

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentResponse.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: donorInfo.name,
              email: donorInfo.email,
              phone: donorInfo.phone || undefined,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Erro ao processar pagamento');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await apiRequest('/api/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        toast({
          title: 'Doação realizada com sucesso!',
          description: 'Obrigado por sua generosidade.',
        });

        if (onSuccess) {
          onSuccess({
            amount,
            donorName: donorInfo.name,
            donorEmail: donorInfo.email,
            campaignId,
          });
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Erro ao processar doação');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            type="text"
            required
            value={donorInfo.name}
            onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
            disabled={isProcessing}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={donorInfo.email}
            onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
            disabled={isProcessing}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            value={donorInfo.phone}
            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
            disabled={isProcessing}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Mensagem (opcional)</Label>
          <Textarea
            id="message"
            rows={3}
            value={donorInfo.message}
            onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
            disabled={isProcessing}
            placeholder="Deixe uma mensagem ou pedido de oração..."
          />
        </div>

        <div className="grid gap-2">
          <Label>Informações do Cartão</Label>
          <div className="border rounded-md p-3">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>Doar R$ {amount.toFixed(2)}</>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

export function StripePaymentForm(props: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Load Stripe configuration
  useEffect(() => {
    apiRequest('/api/payments/config')
      .then(async (response) => {
        const config = await response.json();
        setIsConfigured(config.isConfigured);
        if (config.publishableKey && config.isConfigured) {
          setStripePromise(loadStripe(config.publishableKey));
        }
      })
      .catch((err) => {
        console.error('Failed to load payment configuration:', err);
        setIsConfigured(false);
      });
  }, []);

  if (isConfigured === null) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConfigured || !stripePromise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Pagamento</CardTitle>
          <CardDescription>
            O sistema de pagamento ainda não está configurado. Por favor, entre em contato com a administração.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}