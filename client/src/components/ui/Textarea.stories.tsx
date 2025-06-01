import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Default Textarea',
    placeholder: 'Type here...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Textarea with Error',
    error: 'This field is required',
    placeholder: 'Type here...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Textarea with Helper',
    helperText: 'Helper text goes here',
    placeholder: 'Type here...',
  },
};

export const NoResize: Story = {
  args: {
    label: 'No Resize',
    resize: false,
    placeholder: 'Cannot resize this textarea',
  },
}; 