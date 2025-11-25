// API Client for Canvas-Verse
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3004/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}

interface Canvas {
  id: string;
  title: string;
  type: 'react' | 'html';
  code: string;
  description?: string;
  tags?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

class ApiClient {
  private async fetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async getMe(): Promise<User | null> {
    try {
      const data = await this.fetch('/auth/me');
      return data.user;
    } catch {
      return null;
    }
  }

  async logout() {
    await this.fetch('/auth/logout');
  }

  // Canvases
  async getCanvases(): Promise<Canvas[]> {
    const data = await this.fetch('/canvases');
    return data.canvases;
  }

  async getCanvas(id: string): Promise<Canvas> {
    const data = await this.fetch(`/canvases/${id}`);
    return data.canvas;
  }

  async createCanvas(canvas: { title: string; type: string; code: string; description?: string; tags?: string[] }): Promise<Canvas> {
    const data = await this.fetch('/canvases', {
      method: 'POST',
      body: JSON.stringify(canvas),
    });
    return data.canvas;
  }

  async updateCanvas(id: string, canvas: Partial<Canvas>): Promise<Canvas> {
    const data = await this.fetch(`/canvases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(canvas),
    });
    return data.canvas;
  }

  async deleteCanvas(id: string): Promise<void> {
    await this.fetch(`/canvases/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export type { User, Canvas };
