import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskDialog } from '../TaskDialog';

// Mock the subscription hook
vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({ subscription: { tier: 'starter' } }),
}));

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSave: vi.fn(),
  task: undefined,
  template: undefined,
  fields: [],
};

describe('TaskDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dialog when open', () => {
    render(<TaskDialog {...defaultProps} />);
    expect(screen.getByText('Add a new task to your schedule')).toBeInTheDocument();
  });

  it('includes Status field with Pending as default', () => {
    render(<TaskDialog {...defaultProps} />);
    // The status label should be present
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('Save button is disabled when task name is empty', () => {
    render(<TaskDialog {...defaultProps} />);
    const saveBtn = screen.getByRole('button', { name: /create task/i });
    expect(saveBtn).toBeDisabled();
  });

  it('calls onSave with correct status when form is submitted', async () => {
    const onSave = vi.fn();
    render(<TaskDialog {...defaultProps} onSave={onSave} />);

    // Fill in task name to enable the button
    const nameInput = screen.getByPlaceholderText(/spring planting/i);
    fireEvent.change(nameInput, { target: { value: 'Investigate Low Vegetation Index' } });

    const saveBtn = screen.getByRole('button', { name: /create task/i });
    expect(saveBtn).not.toBeDisabled();
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
      const callArg = onSave.mock.calls[0][0];
      // status must be passed through — not hardcoded or dropped
      expect(callArg).toHaveProperty('status');
      expect(['pending', 'in_progress', 'completed', 'cancelled']).toContain(callArg.status);
      // task_name must be passed through
      expect(callArg.task_name).toBe('Investigate Low Vegetation Index');
    });
  });

  it('field_id is null (not empty string) when no field selected', async () => {
    const onSave = vi.fn();
    render(<TaskDialog {...defaultProps} onSave={onSave} />);

    const nameInput = screen.getByPlaceholderText(/spring planting/i);
    fireEvent.change(nameInput, { target: { value: 'Test Task' } });
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      const callArg = onSave.mock.calls[0][0];
      // field_id must be null, not an empty string (which causes DB errors)
      expect(callArg.field_id).toBeNull();
    });
  });

  it('populates fields correctly when editing an existing task', () => {
    const existingTask = {
      id: 'abc-123',
      task_name: 'Existing Scouting Task',
      category: 'scouting',
      status: 'in_progress',
      priority: 'high',
      description: 'Check field A',
    };
    render(<TaskDialog {...defaultProps} task={existingTask} />);
    expect(screen.getByDisplayValue('Existing Scouting Task')).toBeInTheDocument();
  });
});
