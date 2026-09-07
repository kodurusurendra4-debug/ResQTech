import React, { createContext, useContext, useState } from 'react';
import { UserRole, FamilyProfile } from '../types';

export interface DevicePermissions {
  location: boolean;
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
}

export interface UserSession {
  user_id: string;
  name: string;
  phone: string;
  role: UserRole;
  family_id: string;
  verified_document?: string;
  token: string;
}

interface AuthContextType {
  user: UserSession | null;
  familyProfile: FamilyProfile | null;
  permissions: DevicePermissions;
  requestPermission: (perm: keyof DevicePermissions) => Promise<boolean>;
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => void;
  updateFamilyProfile: (profile: FamilyProfile) => void;
}

const DEFAULT_FAMILY_PROFILE: FamilyProfile = {
  family_id: 'FAM-AP-8921-A',
  household_name: 'Lakshmi Narayana Rao Household',
  head_of_family: 'Lakshmi Narayana Rao',
  contact_phone: '+91-9849001122',
  email: 'ln.rao@gmail.com',
  address: 'Door No 4-82, Ramalayam Street, Kakinada Rural, Andhra Pradesh',
  district: 'Kakinada',
  state: 'Andhra Pradesh',
  latitude: 16.9834,
  longitude: 82.2451,
  ration_card_number: 'AP14028921',
  ration_card_verified: true,
  members: [
    { id: 'MEM-01', name: 'Lakshmi Narayana Rao', relationship: 'Self (Head)', age: 65, age_category: 'Elderly', gender: 'Male', blood_group: 'O+', is_disabled: false, health_complications: ['Hypertension'] },
    { id: 'MEM-02', name: 'Saraswathi Rao', relationship: 'Spouse', age: 62, age_category: 'Elderly', gender: 'Female', blood_group: 'B+', is_disabled: false },
    { id: 'MEM-03', name: 'Srinivas Rao', relationship: 'Son', age: 34, age_category: 'Adult', gender: 'Male', blood_group: 'O+', is_disabled: false },
    { id: 'MEM-04', name: 'Ananya Rao', relationship: 'Daughter-in-Law', age: 31, age_category: 'Adult', gender: 'Female', blood_group: 'A+', is_disabled: false },
    { id: 'MEM-05', name: 'Arjun Rao', relationship: 'Grandson', age: 7, age_category: 'Child', gender: 'Male', blood_group: 'O+', is_disabled: false }
  ],
  total_members: 5,
  children_count: 1,
  elderly_count: 2,
  disabled_count: 0,
  adults_count: 2,
  young_count: 0,
  ex_serviceman_in_family: false,
  forest_experience_in_family: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('suraksha_user');
    return saved ? JSON.parse(saved) : {
      user_id: 'USER-AP-01',
      name: 'Lakshmi Narayana Rao',
      phone: '+91-9849001122',
      role: 'Citizen' as UserRole,
      family_id: 'FAM-AP-8921-A',
      verified_document: 'AP14028921',
      token: 'demo_auth_token_8892'
    };
  });

  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(() => {
    const saved = localStorage.getItem('suraksha_family');
    return saved ? JSON.parse(saved) : DEFAULT_FAMILY_PROFILE;
  });

  const [permissions, setPermissions] = useState<DevicePermissions>(() => {
    const saved = localStorage.getItem('suraksha_permissions');
    return saved ? JSON.parse(saved) : {
      location: true,
      camera: true,
      microphone: true,
      notifications: true
    };
  });

  const requestPermission = async (perm: keyof DevicePermissions): Promise<boolean> => {
    // In real browser, calls navigator.permissions or navigator.mediaDevices
    const updated = { ...permissions, [perm]: true };
    setPermissions(updated);
    localStorage.setItem('suraksha_permissions', JSON.stringify(updated));
    return true;
  };

  const loginWithOTP = async (phone: string, otp: string): Promise<boolean> => {
    if (otp === '112233' || otp === '123456' || otp === '999999' || otp.length === 6) {
      const newUser: UserSession = {
        user_id: `USER-${Math.floor(1000 + Math.random() * 9000)}`,
        name: phone.endsWith('1122') ? 'Lakshmi Narayana Rao' : 'Emergency Citizen Responder',
        phone: phone,
        role: 'Citizen',
        family_id: 'FAM-AP-8921-A',
        verified_document: 'AP14028921',
        token: 'suraksha_demo_jwt_token'
      };
      setUser(newUser);
      localStorage.setItem('suraksha_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    // WebAuthn Passkey simulation: validates credential without storing raw biometric signature
    const newUser: UserSession = {
      user_id: 'USER-BIO-PASSKEY-01',
      name: 'Lakshmi Narayana Rao (Passkey Verified)',
      phone: '+91-9849001122',
      role: 'Citizen',
      family_id: 'FAM-AP-8921-A',
      verified_document: 'AP14028921',
      token: 'suraksha_webauthn_passkey_token'
    };
    setUser(newUser);
    localStorage.setItem('suraksha_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('suraksha_user');
  };

  const updateFamilyProfile = (profile: FamilyProfile) => {
    setFamilyProfile(profile);
    localStorage.setItem('suraksha_family', JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        familyProfile,
        permissions,
        requestPermission,
        loginWithOTP,
        loginWithBiometrics,
        logout,
        updateFamilyProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
