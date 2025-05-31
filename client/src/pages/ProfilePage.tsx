import { Layout } from '../components/layout/Layout';
import { UserProfile } from '../components/profile/UserProfile';

export function ProfilePage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and subscription
            </p>
          </div>
          
          <UserProfile />
        </div>
      </div>
    </Layout>
  );
}