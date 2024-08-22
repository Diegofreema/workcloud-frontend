import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import {
  ConnectionType,
  Followers,
  Org,
  Organization,
  PostType,
  Profile,
  Requests,
  WK,
  WaitList,
  Wks,
  WorkType,
  WorkerWithWorkspace,
  Workers,
  connections,
} from '../constants/types';

const api = process.env.EXPO_PUBLIC_BACKEND_API!;
export const useFollowers = () => {
  const getFollowers = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('connections')
      .order('connections', { ascending: false });

    return {
      connections: data as connections,
      error,
    };
  };
  return useQuery({
    queryKey: ['connections'],
    queryFn: async () => getFollowers(),
  });
};

export const usePersonalOrgs = (id: any) => {
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select('*, ownerId (*)')
      .eq('ownerId', id);
    return {
      organizations: data as Organization[],
      error,
    };
  };
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => getOrgs(),
  });
};
export const useGetFollowers = (id: any) => {
  const getFollowers = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('organizationId', id);
    return {
      followers: data as Followers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['followers', id],
    queryFn: async () => getFollowers(),
  });
};
export const useOrg = (id: any) => {
  const getOrg = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select('*')
      .eq('id', id)
      .single();
    return {
      organization: data as Organization,
      error,
    };
  };
  return useQuery({
    queryKey: ['use_organization'],
    queryFn: async () => getOrg(),
  });
};

export const useOtherOrgs = (id: any) => {
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select('*, organizationId(*) , ownerId(*)')
      .eq('workerId', id);
    return {
      workspace: data as WK[],
      error,
    };
  };
  return useQuery({
    queryKey: ['assignedWk'],
    queryFn: async () => getOrgs(),
  });
};

export const useProfile = (id: any) => {
  const getProfile = async () => {
    const { data, error } = await supabase
      .from('user')
      .select(
        `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
      )
      .eq('userId', id)
      .single();

    return {
      // @ts-ignore
      profile: data as Profile,
      error,
    };
  };
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => getProfile(),
    refetchOnWindowFocus: true,
  });
};

export const useGetPosts = (id: any) => {
  const getProfile = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('organizationId', id)
      .order('created_at', { ascending: false });

    return {
      imgUrls: data as PostType[],
      error,
    };
  };
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => getProfile(),
  });
};

export const useGetWks = (id: any) => {
  const getWks = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select()
      .eq('ownerId', id);
    return {
      wks: data as Wks[],
      error,
    };
  };

  return useQuery({
    queryKey: ['wks', id],
    queryFn: async () => getWks(),
  });
};
export const useGetWk = (id: any) => {
  const getWks = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select(`*, organizationId(*), workerId(*)`)
      .eq('id', id)
      .single();
    return {
      wks: data as WK,
      error,
    };
  };

  return useQuery({
    queryKey: ['wk', id],
    queryFn: async () => getWks(),
  });
};

export const useGetPersonalWk = (id: any) => {
  const getWks = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select(`*, organizationId(*), workerId(*)`)
      .eq('ownerId', id)
      .eq('personal', true)
      .single();
    return {
      wks: data as Wks,
      error,
    };
  };

  return useQuery({
    queryKey: ['personal', id],
    queryFn: async () => getWks(),
  });
};

export const useGetWaitList = (id: any) => {
  const getWaitList = async () => {
    const { data, error } = await supabase
      .from('waitList')
      .select(`*,  customer(*)`)
      .eq('workspace', id);
    return {
      waitList: data as WaitList[],
      error,
    };
  };

  return useQuery({
    queryKey: ['waitList', id],
    queryFn: async () => getWaitList(),
  });
};

export const useSearch = (value: string) => {
  console.log('🚀 ~ useSearch ~ value:', value);
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select()
      .textSearch('description', value, {
        type: 'websearch',
        config: 'english',
      });

    return {
      organization: data as Org[],
      error,
    };
  };

  return useQuery({
    queryKey: ['search', value],
    queryFn: async () => getOrgs(),
  });
};
export const useSearchName = (value: string) => {
  console.log('🚀 ~ useSearch ~ value:', value);
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select()
      .textSearch('name', value, {
        type: 'websearch',
        config: 'english',
      });

    return {
      org: data as Org[],
      error,
    };
  };

  return useQuery({
    queryKey: ['search_name', value],
    queryFn: async () => getOrgs(),
  });
};
export const useWorkers = () => {
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select()
      .eq('userId', '');

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => getWorkers(),
  });
};

export const useGetPersonalWorkers = (id: any) => {
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select()
      .eq('orgId', id);

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['personal_workers'],
    queryFn: async () => getWorkers(),
  });
};
export const useGetOtherWorkers = (id: any) => {
  const getAllStaffs = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select(`*, userId (name, avatar, userId, email)`)
      .neq('userId', id);
    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['other_workers'],
    queryFn: async () => getAllStaffs(),
  });
};

export const usePendingWorkers = (id: any) => {
  const getPendingWorker = async () => {
    const { data, error } = await supabase
      .from('request')
      .select(`*, to (name, avatar, userId, email, workerId(*))`)
      .eq('from', id);

    return {
      requests: data as Requests[],
      error,
    };
  };
  return useQuery({
    queryKey: ['pending_worker', id],
    queryFn: async () => getPendingWorker(),
  });
};
export const usePendingRequest = (id: any) => {
  const getPending = async () => {
    const { data, error } = await supabase
      .from('request')
      .select(`*, to(*), from (name, avatar, userId, email, organizationId(*))`)
      .eq('to', id);

    return {
      requests: data as Requests[],
      error,
    };
  };
  return useQuery({
    queryKey: ['pending_requests', id],
    queryFn: async () => getPending(),
  });
};

export const useGetConnection = (id: any) => {
  const getConnections = async () => {
    const { data, error } = await supabase
      .from('connections')
      .select(`*, connectedTo (*)`)
      .eq('owner', id);

    return {
      connections: data as ConnectionType[],
      error,
    };
  };
  return useQuery({
    queryKey: ['connections', id],
    queryFn: async () => getConnections(),
  });
};

export const useGetWorkerProfile = (id: any) => {
  const getWorker = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select(`*, userId (*), organizationId (name, avatar)`)
      .eq('userId', id)
      .single();
    return {
      worker: data as Workers,
      error,
    };
  };
  return useQuery({
    queryKey: ['worker', id],
    queryFn: async () => getWorker(),
  });
};

export const useGetRequests = (from: any, to: any) => {
  const getRequest = async () => {
    const { data, error } = await supabase
      .from('request')
      .select()
      .eq('from', from)
      .eq('to', to)
      .single();
    return {
      request: data as Requests,
      error,
    };
  };
  return useQuery({
    queryKey: ['request', from, to],
    queryFn: async () => getRequest(),
  });
};
export const useGetRequest = (id: any) => {
  const getRequest = async () => {
    const { data, error } = await supabase
      .from('request')
      .select('*, from(*, organizationId (*)), to(*)')
      .eq('id', id)
      .single();
    return {
      request: data as Requests,
      error,
    };
  };
  return useQuery({
    queryKey: ['single', id],
    queryFn: async () => getRequest(),
  });
};

export const useGetMyStaffs = (id: any) => {
  const getMyStaffs = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select('*, userId (*), workspaceId (*)')
      .eq('bossId', id);
    return {
      staffs: data as WorkType[],
      error,
    };
  };
  return useQuery({
    queryKey: ['myStaffs', id],
    queryFn: async () => getMyStaffs(),
  });
};

export const useGetOrg = (id: string) => {
  const getOrg = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select()
      .eq('id', id)
      .single();
    return {
      org: data as Org,
      error,
    };
  };
  return useQuery({
    queryKey: ['get_single_orgs', id],
    queryFn: getOrg,
  });
};

export const useOrgsWorkers = (id: any) => {
  const getOrg = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select(`*, workspaceId(*), userId(*)`)
      .eq('organizationId', id);

    return {
      workers: data as WorkerWithWorkspace[],
      error,
    };
  };
  return useQuery({
    queryKey: ['single_orgs', id],
    queryFn: getOrg,
  });
};
