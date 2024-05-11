export type connections =
  | {
      name: string;
      image: string;
      id: any;
      time: string;
    }[]
  | null;

export type Organization = {
  avatar: string;
  category: string;
  created_at: string;
  description: string;
  email: string;
  end: string;
  folllowers: string[];
  followers: number[];
  id: number;
  location: string;
  name: string;
  ownerId: Profile | null;
  start: string;
  website: string;
  workDays: string;
  workspaces: number[];
};

type UserWithOrg = {};
export type Org = {
  subTitle?: string;
  avatar: string;
  category: string;
  created_at: string;
  description: string;
  email: string;
  end: string;
  folllowers: string[];
  followers: number[];
  id: number;
  location: string;
  name: string;
  ownerId: string;
  start: string;
  website: string;
  workDays: string;
  workspaces: number[];
};

export type PostType = {
  postUrl: string;
  id: number;
  organizationId: number;
};
export type Profile = {
  avatar: string;
  birthday?: string;
  created_at?: string;
  email: string;
  id?: number;
  name: string;
  organizationId?: {
    id: number;
    avatar: string;
    category: string;
    created_at?: string;
    description: string;
    email: string;
    end: string;
    folllowers: string[];
    followers: number[];

    location: string;
    name: string;
    ownerId: string;
    start: string;
    website: string;
    workDays: string;
    workspaces: number[];
  };
  phoneNumber?: string;
  posts?: number[];
  streamToken: string;
  userId: string;
  workerId?: {
    created_at: string;
    experience: string;
    id: number;
    location: string;
    organizationId: number;
    qualifications: string;
    servicePointId: number;
    skills: string;
    userId: number;
    workspaceId: number;
  } | null;

  workspace?: {
    active: boolean | null;
    created_at: string;
    id: number;
    leisure: boolean | null;
    organizationId: number | null;
    ownerId: number | null;
    responsibility: string | null;
    salary: string | null;
    waitlist: number[] | null;
  }[];
};

export type Wks = {
  active: boolean;
  created_at: string;
  id: number;
  leisure: boolean;
  organizationId: number;
  ownerId: number;
  responsibility: string;
  salary: string;
  waitlist: number[];
  role: string;
  workerId: string;
};

export type Workers = {
  created_at: string;
  experience?: string;
  id?: number;
  location?: string;
  organizationId?: Organization;
  qualifications?: string;
  servicePointId?: number;
  skills: string;
  userId: Profile;
  workspaceId?: number;
  role: string;
  bossId: string;
  gender: string;
};
type UserWthWorkerProfile = {
  avatar: string;
  birthday: string;
  created_at: string;
  email: string;
  id: number;
  name: string;
  organizationId: number;
  phoneNumber: string;
  posts: number[];
  streamToken: string;
  userId: string;
  workerId: Workers;
  workspaces: number[];
};

export type WorkerWithWorkspace = {
  created_at: string;
  experience?: string;
  id?: number;
  location?: string;
  organizationId?: Organization;
  qualifications?: string;
  servicePointId?: number;
  skills: string;
  userId: Profile;
  workspaceId?: WK;
  role: string;
  bossId: string;
};
export type Requests = {
  created_at: string;
  from?: Profile;
  id: number;
  responsibility: string;
  role: string;
  salary: string;
  to: UserWthWorkerProfile;
  pending: boolean;
  workspaceId: string | number;
  qualities: string;
};

export type WK = {
  bossId: string;
  created_at: string;
  experience: string;
  gender: string;
  id: number;
  location: string;
  organizationId: Org;
  qualifications: string;
  role: string;
  servicePointId: number;
  skills: string;
  userId: string;
  workspaceId: number;
  workerId: Profile;
  active: boolean;
  leisure: boolean;
  locked: boolean;
  signedIn: boolean;
  personal: boolean;
  ownerId: Profile;
};
export type Person = {
  user: {
    avatarUrl: string;
    dateOfBirth: string | null;
    email: string;
    followers: number;
    id: string;
    name: string;
    organizations: { _id: string };
    posts: number;
    streamToken: string;
    workspace: number;
    worker: { _id: string };
    phoneNumber: string;
  };
};
export type Followers = {
  id: string;
  organizationId: string;
  followerId: string;
};
export type ConnectionType = {
  id: number;
  owner: string;
  connectedTo: Org;
  created_at: string;
};

export type WorkerProfile = {
  profile: {
    _id: string;
    createdAt: string;
    exp: string;
    gender: string;
    location: string;
    qualifications: string;
    skills: string;
    updatedAt: string;
    userId: {
      _id: string;
      avatar: {
        public_id: string;
        url: string;
      };
      email: string;
      name: string;
    };
    assignedWorkspace?: { _id: string; role: string };
  };
};

export type WorkerProfileArray = {
  profile: {
    _id: string;
    createdAt: string;
    exp: string;
    gender: string;
    location: string;
    qualifications: string;
    skills: string;
    updatedAt: string;
    userId: {
      _id: string;
      avatar: {
        public_id: string;
        url: string;
      };
      email: string;
      name: string;
    };
    assignedWorkspace?: string;
  }[];
};

export type WorkType = {
  created_at?: string;
  experience?: string;
  id?: number;
  location?: string;
  organizationId?: number;
  qualifications?: string;
  servicePointId?: number;
  skills?: string;
  userId?: {
    avatar: string;
    birthday: string;
    created_at: string;
    email: string;
    id: number;
    name: string;
    organizationId: number;
    phoneNumber: string;
    posts: number[];
    streamToken: string;
    userId: string;
    workerId: number;
  };
  workspaceId?: Workspace;
  bossId: string;
  role: string;
};

export type Workspace = {
  active: boolean;
  created_at: string;
  id: number;
  leisure: boolean;
  organizationId: number;
  ownerId: string;
  responsibility: string;
  role: string;
  salary: string;
  waitlist: number[];
  workerId: string;
  locked: boolean;
  signedIn: boolean;
};

export type WaitList = {
  id: number;
  created_at: number;
  workspace: number;
  customer: Profile;
};
