/**
 * NEW: Chat created & No agents available
 * OPEN: Chat created & Assigned to an agent
 * PENDING: By Agent when he asked the customer a question & Waiting for a response
 * RESOLVED: By Agent when he resolved the issue & Remove the chat from agent
 */
export const statuses = Object.freeze({
  NEW: 'new',
  OPEN: 'open',
  PENDING: 'pending',
  RESOLVED: 'resolved',
});

export const chatStatusesBySystem = Object.freeze({
  NEW: 'new',
  OPEN: 'open',
});

export const chatStatusesByAgent = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
});

export const priorities = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});
