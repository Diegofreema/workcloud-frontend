export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      connections: {
        Row: {
          connectedTo: number | null;
          created_at: string;
          id: number;
          owner: string | null;
        };
        Insert: {
          connectedTo?: number | null;
          created_at?: string;
          id?: number;
          owner?: string | null;
        };
        Update: {
          connectedTo?: number | null;
          created_at?: string;
          id?: number;
          owner?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'connections_connectedTo_fkey';
            columns: ['connectedTo'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_connections_owner_fkey';
            columns: ['owner'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          }
        ];
      };
      followers: {
        Row: {
          created_at: string;
          followerId: string | null;
          id: number;
          organizationId: number | null;
        };
        Insert: {
          created_at?: string;
          followerId?: string | null;
          id?: number;
          organizationId?: number | null;
        };
        Update: {
          created_at?: string;
          followerId?: string | null;
          id?: number;
          organizationId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'followers_followerId_fkey';
            columns: ['followerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'followers_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          }
        ];
      };
      organization: {
        Row: {
          avatar: string | null;
          category: string | null;
          created_at: string;
          description: string | null;
          email: string | null;
          end: string | null;
          folllowers: string[] | null;
          followers: number[] | null;
          id: number;
          location: string | null;
          logoId: string | null;
          name: string | null;
          ownerId: string | null;
          start: string | null;
          subTitle: string | null;
          website: string | null;
          workDays: string | null;
          workspaces: number[] | null;
        };
        Insert: {
          avatar?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          end?: string | null;
          folllowers?: string[] | null;
          followers?: number[] | null;
          id?: number;
          location?: string | null;
          logoId?: string | null;
          name?: string | null;
          ownerId?: string | null;
          start?: string | null;
          subTitle?: string | null;
          website?: string | null;
          workDays?: string | null;
          workspaces?: number[] | null;
        };
        Update: {
          avatar?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          end?: string | null;
          folllowers?: string[] | null;
          followers?: number[] | null;
          id?: number;
          location?: string | null;
          logoId?: string | null;
          name?: string | null;
          ownerId?: string | null;
          start?: string | null;
          subTitle?: string | null;
          website?: string | null;
          workDays?: string | null;
          workspaces?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_organization_ownerId_fkey';
            columns: ['ownerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          }
        ];
      };
      personal: {
        Row: {
          active: boolean | null;
          created_at: string;
          id: number;
          leisure: boolean | null;
          organizationId: number | null;
          ownerId: string | null;
          role: string | null;
          signedIn: boolean | null;
          workerId: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string;
          id?: number;
          leisure?: boolean | null;
          organizationId?: number | null;
          ownerId?: string | null;
          role?: string | null;
          signedIn?: boolean | null;
          workerId?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string;
          id?: number;
          leisure?: boolean | null;
          organizationId?: number | null;
          ownerId?: string | null;
          role?: string | null;
          signedIn?: boolean | null;
          workerId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'personal_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'personal_ownerId_fkey';
            columns: ['ownerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'personal_workerId_fkey';
            columns: ['workerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          }
        ];
      };
      post: {
        Row: {
          author: number | null;
          created_at: string;
          id: number;
          pictures: string | null;
        };
        Insert: {
          author?: number | null;
          created_at?: string;
          id?: number;
          pictures?: string | null;
        };
        Update: {
          author?: number | null;
          created_at?: string;
          id?: number;
          pictures?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_post_author_fkey';
            columns: ['author'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          }
        ];
      };
      posts: {
        Row: {
          created_at: string;
          id: number;
          organizationId: number | null;
          postUrl: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          organizationId?: number | null;
          postUrl?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          organizationId?: number | null;
          postUrl?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          }
        ];
      };
      request: {
        Row: {
          created_at: string;
          from: string | null;
          id: number;
          organizationId: number | null;
          pending: boolean | null;
          qualities: string | null;
          responsibility: string;
          role: string;
          salary: string;
          to: string | null;
          workspaceId: number | null;
        };
        Insert: {
          created_at?: string;
          from?: string | null;
          id?: number;
          organizationId?: number | null;
          pending?: boolean | null;
          qualities?: string | null;
          responsibility: string;
          role: string;
          salary: string;
          to?: string | null;
          workspaceId?: number | null;
        };
        Update: {
          created_at?: string;
          from?: string | null;
          id?: number;
          organizationId?: number | null;
          pending?: boolean | null;
          qualities?: string | null;
          responsibility?: string;
          role?: string;
          salary?: string;
          to?: string | null;
          workspaceId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_request_from_fkey';
            columns: ['from'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'public_request_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_request_to_fkey';
            columns: ['to'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'request_workspaceId_fkey';
            columns: ['workspaceId'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          }
        ];
      };
      servicePoint: {
        Row: {
          created_at: string;
          externalLink: boolean | null;
          form: boolean | null;
          formId: number | null;
          id: number;
          link: string | null;
          name: string | null;
          organizationId: number | null;
          service: boolean | null;
          staffId: number | null;
        };
        Insert: {
          created_at?: string;
          externalLink?: boolean | null;
          form?: boolean | null;
          formId?: number | null;
          id?: number;
          link?: string | null;
          name?: string | null;
          organizationId?: number | null;
          service?: boolean | null;
          staffId?: number | null;
        };
        Update: {
          created_at?: string;
          externalLink?: boolean | null;
          form?: boolean | null;
          formId?: number | null;
          id?: number;
          link?: string | null;
          name?: string | null;
          organizationId?: number | null;
          service?: boolean | null;
          staffId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_servicePoint_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_servicePoint_staffId_fkey';
            columns: ['staffId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          }
        ];
      };
      user: {
        Row: {
          avatar: string | null;
          birthday: string | null;
          created_at: string;
          email: string | null;
          id: number;
          name: string | null;
          organizationId: number | null;
          phoneNumber: string | null;
          posts: number[] | null;
          streamToken: string | null;
          userId: string | null;
          workerId: number | null;
          workspaces: number[] | null;
        };
        Insert: {
          avatar?: string | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          organizationId?: number | null;
          phoneNumber?: string | null;
          posts?: number[] | null;
          streamToken?: string | null;
          userId?: string | null;
          workerId?: number | null;
          workspaces?: number[] | null;
        };
        Update: {
          avatar?: string | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          organizationId?: number | null;
          phoneNumber?: string | null;
          posts?: number[] | null;
          streamToken?: string | null;
          userId?: string | null;
          workerId?: number | null;
          workspaces?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_user_workerId_fkey';
            columns: ['workerId'];
            isOneToOne: false;
            referencedRelation: 'worker';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          }
        ];
      };
      waitList: {
        Row: {
          created_at: string;
          customer: string | null;
          id: number;
          workspace: number | null;
        };
        Insert: {
          created_at?: string;
          customer?: string | null;
          id?: number;
          workspace?: number | null;
        };
        Update: {
          created_at?: string;
          customer?: string | null;
          id?: number;
          workspace?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_waitList_customer_fkey';
            columns: ['customer'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          }
        ];
      };
      worker: {
        Row: {
          bossId: string | null;
          created_at: string;
          experience: string | null;
          gender: string | null;
          id: number;
          location: string | null;
          organizationId: number | null;
          personalId: number | null;
          qualifications: string | null;
          role: string | null;
          servicePointId: number | null;
          skills: string | null;
          userId: string | null;
          workspaceId: number | null;
        };
        Insert: {
          bossId?: string | null;
          created_at?: string;
          experience?: string | null;
          gender?: string | null;
          id?: number;
          location?: string | null;
          organizationId?: number | null;
          personalId?: number | null;
          qualifications?: string | null;
          role?: string | null;
          servicePointId?: number | null;
          skills?: string | null;
          userId?: string | null;
          workspaceId?: number | null;
        };
        Update: {
          bossId?: string | null;
          created_at?: string;
          experience?: string | null;
          gender?: string | null;
          id?: number;
          location?: string | null;
          organizationId?: number | null;
          personalId?: number | null;
          qualifications?: string | null;
          role?: string | null;
          servicePointId?: number | null;
          skills?: string | null;
          userId?: string | null;
          workspaceId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_worker_bossId_fkey';
            columns: ['bossId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'public_worker_servicePointId_fkey';
            columns: ['servicePointId'];
            isOneToOne: false;
            referencedRelation: 'servicePoint';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_worker_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'public_worker_workspaceId_fkey';
            columns: ['workspaceId'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'worker_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'worker_personalId_fkey';
            columns: ['personalId'];
            isOneToOne: false;
            referencedRelation: 'personal';
            referencedColumns: ['id'];
          }
        ];
      };
      workspace: {
        Row: {
          active: boolean | null;
          created_at: string;
          id: number;
          leisure: boolean | null;
          locked: boolean | null;
          organizationId: number | null;
          ownerId: string | null;
          personal: boolean | null;
          responsibility: string | null;
          role: string | null;
          salary: string | null;
          signedIn: boolean | null;
          workerId: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string;
          id?: number;
          leisure?: boolean | null;
          locked?: boolean | null;
          organizationId?: number | null;
          ownerId?: string | null;
          personal?: boolean | null;
          responsibility?: string | null;
          role?: string | null;
          salary?: string | null;
          signedIn?: boolean | null;
          workerId?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string;
          id?: number;
          leisure?: boolean | null;
          locked?: boolean | null;
          organizationId?: number | null;
          ownerId?: string | null;
          personal?: boolean | null;
          responsibility?: string | null;
          role?: string | null;
          salary?: string | null;
          signedIn?: boolean | null;
          workerId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workspace_workerId_fkey';
            columns: ['workerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          },
          {
            foreignKeyName: 'workspace_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organization';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_ownerId_fkey';
            columns: ['ownerId'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['userId'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
