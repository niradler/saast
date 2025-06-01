import type { Meta, StoryObj } from '@storybook/react';
import { CodeRenderer } from './CodeRenderer';

const meta: Meta<typeof CodeRenderer> = {
  title: 'Chat/CodeRenderer',
  component: CodeRenderer,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CodeRenderer>;

export const JavaScript: Story = {
  args: {
    code: 'console.log("Hello, world!");',
    language: 'javascript',
  },
}; 