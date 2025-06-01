import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessages } from './ChatMessages';

const meta: Meta<typeof ChatMessages> = {
  title: 'Chat/ChatMessages',
  component: ChatMessages,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ChatMessages>;

export const Default: Story = {
  args: {
    messages: [
      { id: '1', content: 'Hello!', sender: 'user', timestamp: new Date().toISOString() },
      { id: '2', content: 'Hi there!', sender: 'assistant', timestamp: new Date().toISOString() },
    ],
  },
}; 