import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { Eye, EyeOff, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../services/authService';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { login: loginUser, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function handleGoogleLogin() {
    // TODO: Implement Google OAuth
  }

  function handleGithubLogin() {
    // TODO: Implement GitHub OAuth
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await login(data);
      loginUser(response.user, response.token);
      toast.success('Welcome back!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <Card variant="glass" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 mb-6">
              <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleLogin}>
                <span className="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.8-5.8C34.36 3.61 29.64 1.5 24 1.5 14.98 1.5 7.06 7.44 3.68 15.09l6.77 5.25C12.06 14.09 17.55 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9.18h12.42c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.59C43.93 37.09 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.45 28.34A14.5 14.5 0 019.5 24c0-1.51.26-2.98.73-4.34l-6.77-5.25A23.94 23.94 0 001.5 24c0 3.77.9 7.34 2.48 10.59l7.19-5.59z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.84l-7.19-5.59c-2 1.36-4.56 2.18-8.7 2.18-6.45 0-11.94-4.59-13.55-10.75l-7.19 5.59C7.06 40.56 14.98 46.5 24 46.5z"/><path fill="none" d="M1.5 1.5h45v45h-45z"/></g></svg>
                </span>
                Continue with Google
              </Button>
              <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={handleGithubLogin}>
                <span className="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </span>
                Continue with GitHub
              </Button>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}