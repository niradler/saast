import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
      </CardHeader>
      <CardContent>
        This is a default card.
      </CardContent>
    </Card>
  ),
};

export const Glass: Story = {
  render: () => (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Glass Card</CardTitle>
      </CardHeader>
      <CardContent>
        This is a glass variant card.
      </CardContent>
    </Card>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
      </CardHeader>
      <CardContent>
        This is a bordered variant card.
      </CardContent>
    </Card>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <Card padding="none">
      <CardHeader>
        <CardTitle>No Padding Card</CardTitle>
      </CardHeader>
      <CardContent>
        This card has no padding.
      </CardContent>
    </Card>
  ),
}; 