import type { Meta, StoryObj } from '@storybook/react';
import { ContentRenderer } from './ContentRenderer';

const meta: Meta<typeof ContentRenderer> = {
  title: 'Chat/ContentRenderer',
  component: ContentRenderer,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ContentRenderer>;

export const Markdown: Story = {
  args: {
    content: '# Hello World!\nThis is a **markdown** message.',
    type: 'markdown',
  },
}; 