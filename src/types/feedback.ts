export type Role = 'ADMINISTRADOR' | 'MODERADOR' | 'COMUM';

export interface Feedback {
  id: number;
  user_name?: string; // Vem na rota admin
  admin_name?: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  created_at: string;
}

export interface Message {
  id: number;
  author_name: string;
  author_type: Role;
  content: string;
  is_read: boolean;
  created_at: string;
}