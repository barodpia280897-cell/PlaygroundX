import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext();

export const AVAILABLE_DEPARTMENTS = [
  { id: 'all', name: 'All Departments', flag: '🌍' },
  { id: 'en', name: 'English Department', flag: '🇬🇧' },
  { id: 'es', name: 'Spanish Department', flag: '🇪🇸' },
  { id: 'fr', name: 'French Department', flag: '🇫🇷' },
  { id: 'pt', name: 'Portuguese Department', flag: '🇵🇹' },
  { id: 'de', name: 'German Department', flag: '🇩🇪' },
  { id: 'ar', name: 'Arabic Department', flag: '🇦🇪' },
  { id: 'hi', name: 'Hindi Department', flag: '🇮🇳' },
  { id: 'bn', name: 'Bengali Department', flag: '🇧🇩' },
  { id: 'zh', name: 'Chinese Department', flag: '🇨🇳' },
  { id: 'ko', name: 'Korean Department', flag: '🇰🇷' },
];

export function DepartmentProvider({ children }) {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(AVAILABLE_DEPARTMENTS[0]);

  // If a user has a designated language, default to that department
  useEffect(() => {
    if (user && user.language) {
      const userDept = AVAILABLE_DEPARTMENTS.find(d => d.id === user.language || d.name.toLowerCase().includes(user.language.toLowerCase()));
      if (userDept) setSelectedDepartment(userDept);
    }
  }, [user]);

  const value = {
    selectedDepartment,
    setSelectedDepartment,
    availableDepartments: AVAILABLE_DEPARTMENTS,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
}
