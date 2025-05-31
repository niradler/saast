import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { User, CreditCard, Crown, Zap, Star, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // Update user profile
      updateUser({
        name: fullName,
        email: data.email,
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
    });
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'enterprise':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'enterprise':
        return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800/20 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const currentPlan = user?.subscription?.plan || 'free';
  const planStatus = user?.subscription?.status || 'active';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register('firstName')}
                  label="First Name"
                  error={errors.firstName?.message}
                />
                <Input
                  {...register('lastName')}
                  label="Last Name"
                  error={errors.lastName?.message}
                />
              </div>
              
              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                error={errors.email?.message}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user?.name?.split(' ')[0] || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user?.name?.split(' ').slice(1).join(' ') || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {user?.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Subscription Plan</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Current Plan */}
            <div className={`p-4 rounded-lg border-2 ${getPlanColor(currentPlan)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPlanIcon(currentPlan)}
                  <div>
                    <h3 className="font-semibold capitalize">{currentPlan} Plan</h3>
                    <p className="text-sm opacity-80">
                      {currentPlan === 'free' && 'Basic features with limited usage'}
                      {currentPlan === 'pro' && 'Full features with unlimited usage'}
                      {currentPlan === 'enterprise' && 'Advanced features for teams'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {currentPlan === 'free' && '$0/month'}
                    {currentPlan === 'pro' && '$19/month'}
                    {currentPlan === 'enterprise' && '$99/month'}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    planStatus === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {planStatus}
                  </div>
                </div>
              </div>
              
              {/* Plan Features */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan === 'free' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>10 conversations/month</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Basic AI models</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Standard support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Web access</span>
                    </div>
                  </>
                )}
                
                {currentPlan === 'pro' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Unlimited conversations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Advanced AI models</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>API access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Custom themes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Export conversations</span>
                    </div>
                  </>
                )}
                
                {currentPlan === 'enterprise' && (
                  <>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Everything in Pro</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Team collaboration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Admin dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>SSO integration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Custom branding</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Dedicated support</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upgrade Options */}
            {currentPlan !== 'enterprise' && (
              <div className="pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Upgrade Your Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan === 'free' && (
                    <>
                      <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-blue-500" />
                          <h5 className="font-semibold">Pro Plan</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Unlimited conversations and advanced features
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            $19/month
                          </span>
                          <Link to="/checkout?plan=pro">
                            <Button size="sm">
                              Upgrade
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Crown className="w-5 h-5 text-purple-500" />
                          <h5 className="font-semibold">Enterprise Plan</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Advanced features for teams and organizations
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            $99/month
                          </span>
                          <Link to="/checkout?plan=enterprise">
                            <Button size="sm" variant="outline">
                              Upgrade
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {currentPlan === 'pro' && (
                    <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Crown className="w-5 h-5 text-purple-500" />
                        <h5 className="font-semibold">Enterprise Plan</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Advanced features for teams and organizations
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          $99/month
                        </span>
                        <Link to="/checkout?plan=enterprise">
                          <Button size="sm">
                            Upgrade
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Usage This Month
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Conversations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Messages
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    API Calls
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}