import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface DonationPaymentFormProps {
  campaignId: number;
  campaignTitle: string;
  minAmount?: number;
}

function PaymentForm({ campaignId, campaignTitle, minAmount = 10 }: DonationPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(50);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (amount < minAmount) {
      toast({
        title: 'Valor mínimo',
        description: `O valor mínimo para doação é R$ ${minAmount}`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const response = await apiRequest('/api/payments/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency: 'brl',
          metadata: {
            campaignId: campaignId.toString(),
            donorName: isAnonymous ? 'Anônimo' : donorName,
            donorEmail,
            message,
            isAnonymous: isAnonymous.toString(),
          },
        }),
      });
      
      const { clientSecret } = await response.json();

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: isAnonymous ? 'Anônimo' : donorName,
            email: donorEmail,
          },
        },
      });

      if (error) {
        toast({
          title: 'Erro no pagamento',
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Doação realizada com sucesso!',
          description: 'Obrigado pela sua contribuição.',
        });
        
        // Reset form
        setAmount(50);
        setDonorName('');
        setDonorEmail('');
        setMessage('');
        setIsAnonymous(false);
        cardElement.clear();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua doação. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const predefinedAmounts = [20, 50, 100, 200, 500];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="amount">Valor da Doação (R$)</Label>
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {predefinedAmounts.map((value) => (
            <Button
              key={value}
              type="button"
              variant={amount === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(value)}
            >
              R$ {value}
            </Button>
          ))}
        </div>
        <Input
          id="amount"
          type="number"
          min={minAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            disabled={isAnonymous}
            required={!isAnonymous}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Mensagem (opcional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Deixe uma mensagem de apoio..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
          />
          <Label htmlFor="anonymous" className="cursor-pointer">
            Fazer doação anônima
          </Label>
        </div>
      </div>

      <div>
        <Label>Informações do Cartão</Label>
        <div className="mt-2 p-3 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Doar R$ {amount}
          </>
        )}
      </Button>
    </form>
  );
}

export default function DonationPaymentForm(props: DonationPaymentFormProps) {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Doações</CardTitle>
          <CardDescription>
            O sistema de pagamento está sendo configurado. Por favor, tente novamente mais tarde.
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