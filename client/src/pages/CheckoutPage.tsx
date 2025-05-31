import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '../components/layout/Layout';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { CreditCard, Lock, Check, ArrowLeft, Crown, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryMonth: z.string().min(2, 'Required'),
  expiryYear: z.string().min(4, 'Required'),
  cvv: z.string().min(3, 'CVV must be 3 digits'),
  nameOnCard: z.string().min(1, 'Name on card is required'),
  billingAddress: z.string().min(1, 'Billing address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'pro');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const cardNumber = watch('cardNumber');

  // Format card number with spaces
  useEffect(() => {
    const input = document.querySelector('input[name="cardNumber"]') as HTMLInputElement;
    if (input && cardNumber) {
      const formatted = cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted !== cardNumber) {
        input.value = formatted;
      }
    }
  }, [cardNumber]);

  const plans = {
    pro: {
      name: 'Pro',
      price: 19,
      icon: Zap,
      color: 'blue',
      features: [
        'Unlimited conversations',
        'Advanced AI models',
        'Priority support',
        'API access',
        'Custom themes',
        'Export conversations',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 99,
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'SSO integration',
        'Custom branding',
        'Dedicated support',
      ],
    },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const PlanIcon = currentPlan.icon;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with Stripe, PayPal, etc.
      console.log('Processing payment:', { ...data, plan: selectedPlan });
      
      toast.success(`Successfully upgraded to ${currentPlan.name} plan!`);
      navigate('/profile');
      
    } catch (error: any) {
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] gradient-bg py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Upgrade to unlock premium features and unlimited access
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Plan Selection */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Select Plan
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(plans).map(([key, plan]) => (
                          <div
                            key={key}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              selectedPlan === key
                                ? `border-${plan.color}-500 bg-${plan.color}-50 dark:bg-${plan.color}-900/20`
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedPlan(key)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <plan.icon className={`w-5 h-5 text-${plan.color}-500`} />
                                <div>
                                  <h4 className="font-semibold">{plan.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {plan.features.length} features included
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">
                                  ${plan.price}/month
                                </div>
                                {selectedPlan === key && (
                                  <div className="text-xs text-green-600 dark:text-green-400">
                                    Selected
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        What's Included
                      </h3>
                      <div className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${currentPlan.price}.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span>Total</span>
                          <span>${currentPlan.price}.00/month</span>
                        </div>
                      </div>
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 dark:text-green-200">
                            30-Day Money Back Guarantee
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            Cancel anytime within 30 days for a full refund
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Card Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Card Details
                      </h3>
                      
                      <Input
                        {...register('cardNumber')}
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        error={errors.cardNumber?.message}
                        maxLength={19}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          {...register('expiryMonth')}
                          label="Month"
                          placeholder="MM"
                          maxLength={2}
                          error={errors.expiryMonth?.message}
                        />
                        <Input
                          {...register('expiryYear')}
                          label="Year"
                          placeholder="YYYY"
                          maxLength={4}
                          error={errors.expiryYear?.message}
                        />
                        <Input
                          {...register('cvv')}
                          label="CVV"
                          placeholder="123"
                          maxLength={3}
                          error={errors.cvv?.message}
                        />
                      </div>

                      <Input
                        {...register('nameOnCard')}
                        label="Name on Card"
                        placeholder="John Doe"
                        error={errors.nameOnCard?.message}
                      />
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Billing Address
                      </h3>

                      <Input
                        {...register('billingAddress')}
                        label="Address"
                        placeholder="123 Main St"
                        error={errors.billingAddress?.message}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          {...register('city')}
                          label="City"
                          placeholder="New York"
                          error={errors.city?.message}
                        />
                        <Input
                          {...register('zipCode')}
                          label="ZIP Code"
                          placeholder="10001"
                          error={errors.zipCode?.message}
                        />
                      </div>

                      <Input
                        {...register('country')}
                        label="Country"
                        placeholder="United States"
                        error={errors.country?.message}
                      />
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay $${currentPlan.price}/month`}
                    </Button>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By completing this purchase, you agree to our{' '}
                      <a href="#" className="text-primary-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}