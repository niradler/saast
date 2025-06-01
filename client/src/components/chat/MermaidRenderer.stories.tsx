import type { Meta, StoryObj } from '@storybook/react';
import { MermaidRenderer } from './MermaidRenderer';

const meta: Meta<typeof MermaidRenderer> = {
  title: 'Chat/MermaidRenderer',
  component: MermaidRenderer,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MermaidRenderer>;

export const Diagram: Story = {
  args: {
    content: 'graph TD; A-->B; A-->C; B-->D; C-->D;',
  },
}; 