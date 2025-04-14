/**
 * USER: default role when registered
 * ADMIN: take the role by system
 * AGENT: take the role by admin
 * CUSTOMER: take the role by another system
 */
export const roles = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  AGENT: 'agent',
});

export const userRolesByAdmin = Object.freeze({
  USER: 'user',
  AGENT: 'agent',
});

/**
 * AVAILABLE: Agent is available to take a new chat
 * BUSY: Agent is busy & not available to take a new chat
 * AWAY: Agent is away & not available to take a new chat
 */
export const statuses = Object.freeze({
  AVAILABLE: 'available',
  BUSY: 'busy',
  AWAY: 'away',
});

/**
 * AVAILABLE: Agent become avaiable & Search for pending chats
 * BUSY: Agent is busy & not available to take a new chat
 */
export const userStatusesBySystem = Object.freeze({
  AVAILABLE: 'available',
  BUSY: 'busy',
});

/**
 * AVAILABLE: Agent become avaiable & Search for pending chats
 * AWAY: Make his chats pending till re-assign them to another agent
 */
export const userStatusesByAgent = Object.freeze({
  AVAILABLE: 'available',
  AWAY: 'away',
});
