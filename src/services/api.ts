import { Feedback, Message } from "../types/feedback";

const BASE_URL = 'http://localhost:3000';

export const feedbackService = {
  
  
    getFeedbacks: async (role: string, token: string): Promise<Feedback[]> => {
    const endpoint = (role === 'ADMINISTRADOR' || role === 'MODERADOR') 
      ? '/feedbacks/admin' 
      : '/feedbacks';
    
    const response = await fetch(`${}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getMessages: async (id: number, token: string, role: string): Promise<Message[]> => {
    const endpoint = (role === 'ADMINISTRADOR' || role === 'MODERADOR')
      ? `/feedbacks/admin/messages/${id}`
      : `/feedbacks/${id}/messages`;
      
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};