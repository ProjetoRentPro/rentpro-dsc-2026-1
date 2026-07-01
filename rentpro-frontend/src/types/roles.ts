export const UserRole = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
