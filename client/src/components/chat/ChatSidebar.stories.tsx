import type { Meta, StoryObj } from '@storybook/react';
import { ChatSidebar } from './ChatSidebar';

const meta: Meta<typeof ChatSidebar> = {
  title: 'Chat/ChatSidebar',
  component: ChatSidebar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ChatSidebar>;

export const Default: Story = {
  args: {
    chats: [
      { id: '1', title: 'Chat 1', lastMessage: 'Hello!', updatedAt: new Date().toISOString() },
      { id: '2', title: 'Chat 2', lastMessage: 'Hi there!', updatedAt: new Date().toISOString() },
    ],
  },
}; 