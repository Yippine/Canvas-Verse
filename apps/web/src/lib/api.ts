// API Client for Canvas-Verse
// Use relative URL - Vite proxy handles forwarding to backend
const API_BASE = '/api';

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
  isExample?: boolean;
  visibility?: 'private' | 'team' | 'public';
  teamId?: string | null;
  shareToken?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  owner?: User;
  myRole?: 'owner' | 'admin' | 'member';
  memberCount?: number;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date | string;
  user?: User;
}

interface InviteCode {
  id: string;
  code: string;
  teamId: string;
  createdById: string;
  expiresAt: Date | string;
  usedCount: number;
  maxUses: number;
  createdAt: Date | string;
  createdBy?: User;
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

  // Example Canvases (Phase 4)
  async getExamples(): Promise<Canvas[]> {
    const data = await this.fetch('/canvases/examples');
    return data.canvases;
  }

  async copyCanvas(id: string): Promise<Canvas> {
    const data = await this.fetch(`/canvases/${id}/copy`, {
      method: 'POST',
    });
    return data.canvas;
  }

  // Canvas Sharing (Phase 6)
  async setCanvasVisibility(id: string, visibility: 'private' | 'team' | 'public', teamId?: string): Promise<Canvas> {
    const data = await this.fetch(`/canvases/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ visibility, teamId }),
    });
    return data.canvas;
  }

  async generateShareLink(id: string): Promise<{ shareToken: string; shareUrl: string; canvas: Canvas }> {
    const data = await this.fetch(`/canvases/${id}/share`, {
      method: 'POST',
    });
    return data;
  }

  async getSharedCanvas(token: string): Promise<Canvas> {
    const data = await this.fetch(`/canvases/shared/${token}`);
    return data.canvas;
  }

  // Teams
  async createTeam(name: string): Promise<Team> {
    const data = await this.fetch('/teams', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return data.team;
  }

  async getTeams(): Promise<Team[]> {
    const data = await this.fetch('/teams');
    return data.teams;
  }

  async getTeam(id: string): Promise<Team> {
    const data = await this.fetch(`/teams/${id}`);
    return data.team;
  }

  async updateTeam(id: string, name: string): Promise<Team> {
    const data = await this.fetch(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return data.team;
  }

  async deleteTeam(id: string): Promise<void> {
    await this.fetch(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Members
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const data = await this.fetch(`/teams/${teamId}/members`);
    return data.members;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await this.fetch(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Invitations
  async generateInvite(teamId: string, options?: { expiresAt?: string; maxUses?: number }): Promise<{ inviteCode: InviteCode; inviteUrl: string }> {
    const data = await this.fetch(`/teams/${teamId}/invites`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
    return data;
  }

  async getTeamInvites(teamId: string): Promise<InviteCode[]> {
    const data = await this.fetch(`/teams/${teamId}/invites`);
    return data.invites;
  }

  async joinTeam(code: string): Promise<{ team: Team; membership: TeamMember; message: string }> {
    const data = await this.fetch(`/teams/join/${code}`, {
      method: 'POST',
    });
    return data;
  }

  async getTeamCanvases(teamId: string): Promise<Canvas[]> {
    const data = await this.fetch(`/teams/${teamId}/canvases`);
    return data.canvases;
  }
}

export const api = new ApiClient();
export type { User, Canvas, Team, TeamMember, InviteCode };
