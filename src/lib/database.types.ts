export interface DbSound {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  duration: number;
  tags: string[];
  author: string;
  license: "CC0" | "CC BY" | "CC BY-SA";
  status: "approved" | "pending" | "rejected";
  listen_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbUpload {
  id: string;
  session_id: string;
  title: string;
  file_url: string;
  tags: string[] | null;
  location: string | null;
  license_agreed: boolean;
  status: "pending" | "approved" | "rejected";
  moderator_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: "free" | "premium";
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      sounds: {
        Row: DbSound;
        Insert: Omit<DbSound, "id" | "created_at" | "updated_at" | "listen_count"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          listen_count?: number;
        };
        Update: Partial<Omit<DbSound, "id" | "created_at">>;
      };
      uploads: {
        Row: DbUpload;
        Insert: Omit<DbUpload, "id" | "created_at" | "updated_at" | "status" | "moderator_note"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
          moderator_note?: string | null;
        };
        Update: Partial<Omit<DbUpload, "id" | "created_at">>;
      };
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, "id" | "created_at" | "updated_at" | "plan"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          plan?: string;
        };
        Update: Partial<Omit<DbUser, "id" | "created_at">>;
      };
    };
  };
}
