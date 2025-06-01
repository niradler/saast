import type { Meta, StoryObj } from '@storybook/react';
import { Message } from './Message';

const meta: Meta<typeof Message> = {
  title: 'Chat/Message',
  component: Message,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Message>;

export const User: Story = {
  args: {
    message: {
      id: '1',
      conversationId: 'conv-1',
      role: 'user',
      content: 'This is a user message.',
      timestamp: new Date().toISOString(),
    },
  },
};

export const Assistant: Story = {
  args: {
    message: {
      id: '2',
      conversationId: 'conv-1',
      role: 'assistant',
      content: 'This is an assistant message.',
      timestamp: new Date().toISOString(),
      metadata: { model: 'gpt-4', tokens: 42 },
    },
  },
}; 