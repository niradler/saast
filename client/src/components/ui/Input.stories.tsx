import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Type here...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Input with Error',
    error: 'This field is required',
    placeholder: 'Type here...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Input with Helper',
    helperText: 'Helper text goes here',
    placeholder: 'Type here...',
  },
}; 