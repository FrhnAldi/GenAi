import type { StoredCredential } from '../types/auth';

// Demo-only credentials. In a real deployment these would live behind a proper
// authentication backend, never hard-coded in the client bundle.
export const DEMO_USERS: StoredCredential[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Budi Santoso',
    role: 'admin',
  },
  {
    username: 'pelanggan',
    password: 'pelanggan123',
    name: 'Rangga Pratama',
    role: 'pelanggan',
  },
];
