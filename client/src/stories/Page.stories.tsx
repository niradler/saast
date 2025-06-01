import type { Meta } from '@storybook/react-vite';
import { BrowserRouter as Router } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ChatPage } from '../pages/chat/ChatPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

const meta: Meta = {
  title: 'App/Pages',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Home = {
  render: () => (
    <Router>
    <HomePage />
    </Router>
  ),
};

export const Chat = {
  render: () => (
    <Router>
    <ChatPage />
    </Router>
  ),
};

export const Checkout = {
  render: () => (
    <Router>
    <CheckoutPage />
    </Router>
  ),
};

export const Profile = {
  render: () => (
    <Router>
    <ProfilePage />
    </Router>
  ),
};

export const Login = {
  render: () => (
    <Router>
    <LoginPage />
    </Router>
  ),
};

export const Register = {
  render: () => (
    <Router>
    <RegisterPage />
    </Router>
  ),
};
