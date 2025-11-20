import { WorkRole } from './roadmap';

export type UserProfile = {
  name: string;
  position: string;
  phone: string;
  email: string;
  linkedin: string;
};

export type RoleConfig = {
  enabled: boolean;
  label: string;
  shortLabel: string;
  icon: string;
};

export type RolesSettings = {
  [key in WorkRole]: RoleConfig;
};

export const userProfile: UserProfile = {
  name: 'Dung Hoang',
  position: 'COO',
  phone: '0977 096 665',
  email: 'dungbk811@gmail.com',
  linkedin: 'https://linkedin.com/in/dung-hoang-18092654',
};

export const rolesSettings: RolesSettings = {
  COO: {
    enabled: true,
    label: 'COO - Operations',
    shortLabel: 'COO',
    icon: '⚙️',
  },
  CPO: {
    enabled: true,
    label: 'CPO - People & HR',
    shortLabel: 'CPO',
    icon: '👥',
  },
  CFO: {
    enabled: true,
    label: 'CFO - Finance',
    shortLabel: 'CFO',
    icon: '💰',
  },
  CLO: {
    enabled: true,
    label: 'CLO - Legal',
    shortLabel: 'CLO',
    icon: '⚖️',
  },
};
