// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadData, saveData, checkVersionAndMigrate, resetDatabase } from '../utils/storage';
import { INITIAL_PLATFORM_DATABASE } from '../mock/platformDatabase';
import { INITIAL_TENANT_DATABASE } from '../mock/tenantDatabase';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [dataStore, setDataStore] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth(); // Depend on user scope to load relevant DB

  useEffect(() => {
    // 1. Check version and migrate/reset if necessary
    checkVersionAndMigrate();

    // 2. Load DB based on scope
    const loadedStore = {};
    const DB_SOURCE = user?.scope === 'PLATFORM' ? INITIAL_PLATFORM_DATABASE : INITIAL_TENANT_DATABASE;
    const DB_PREFIX = user?.scope === 'PLATFORM' ? 'platform_' : 'tenant_';

    if (DB_SOURCE) {
      Object.keys(DB_SOURCE).forEach(key => {
        const storageKey = `${DB_PREFIX}${key}`;
        const stored = loadData(storageKey);
        if (stored) {
          loadedStore[key] = stored;
        } else {
          saveData(storageKey, DB_SOURCE[key]);
          loadedStore[key] = DB_SOURCE[key];
        }
      });
    }

    setDataStore(loadedStore);
    setIsInitialized(true);
  }, [user?.scope]); // Re-initialize when scope changes (e.g. login)

  const getStorageKey = (key) => {
    return user?.scope === 'PLATFORM' ? `platform_${key}` : `tenant_${key}`;
  };

  const updateEntity = (key, newEntityData) => {
    setDataStore(prev => {
      const nextStore = { ...prev, [key]: newEntityData };
      saveData(getStorageKey(key), newEntityData);
      return nextStore;
    });
  };

  const updateItemInEntity = (entityKey, itemId, itemUpdater) => {
    setDataStore(prev => {
      const list = prev[entityKey] || [];
      const nextList = list.map(item => item.id === itemId ? itemUpdater(item) : item);
      const nextStore = { ...prev, [entityKey]: nextList };
      saveData(getStorageKey(entityKey), nextList);
      return nextStore;
    });
  };

  const addItemToEntity = (entityKey, newItem) => {
    setDataStore(prev => {
      const list = prev[entityKey] || [];
      const nextList = [newItem, ...list];
      const nextStore = { ...prev, [entityKey]: nextList };
      saveData(getStorageKey(entityKey), nextList);
      return nextStore;
    });
  };

  const deleteItemFromEntity = (entityKey, itemId) => {
    setDataStore(prev => {
      const list = prev[entityKey] || [];
      const nextList = list.filter(item => item.id !== itemId);
      const nextStore = { ...prev, [entityKey]: nextList };
      saveData(getStorageKey(entityKey), nextList);
      return nextStore;
    });
  };

  const updateUIState = (key, value) => {
     setDataStore(prev => {
         const nextStore = { ...prev, [`ui_${key}`]: value };
         saveData(`ui_${key}`, value);
         return nextStore;
     })
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-neon-blue font-bold">Initializing Relational Database...</div>;
  }

  return (
    <DataContext.Provider value={{ 
      dataStore, 
      updateEntity, 
      updateItemInEntity, 
      addItemToEntity, 
      deleteItemFromEntity,
      updateUIState,
      resetDatabase,
      scope: user?.scope 
    }}>
      {children}
    </DataContext.Provider>
  );
}

// Keep the old generic hook for backwards compatibility with existing UI components during this transition
export function useDataStore(key) {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataStore must be used within DataProvider');
  
  const data = ctx.dataStore[key] || [];
  
  const setCollection = (newData) => ctx.updateEntity(key, newData);
  const addItem = (item) => ctx.addItemToEntity(key, item);
  
  const updateItem = (id, updaterOrObject) => {
    ctx.updateItemInEntity(key, id, (item) => {
      if (typeof updaterOrObject === 'function') {
        return updaterOrObject(item);
      }
      return { ...item, ...updaterOrObject };
    });
  };
  
  const deleteItem = (id) => ctx.deleteItemFromEntity(key, id);

  return [data, { setCollection, addItem, updateItem, deleteItem }];
}

// Clean API for Tenant Data specifically
export function useTenantData(key) {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useTenantData must be used within DataProvider');
  
  if (ctx.scope !== 'TENANT') {
    console.warn(`useTenantData called but current scope is ${ctx.scope}`);
  }

  const data = ctx.dataStore[key] || [];
  const setCollection = (newData) => ctx.updateEntity(key, newData);
  const addItem = (item) => ctx.addItemToEntity(key, item);
  const updateItem = (id, updaterOrObject) => {
    ctx.updateItemInEntity(key, id, (item) => {
      if (typeof updaterOrObject === 'function') return updaterOrObject(item);
      return { ...item, ...updaterOrObject };
    });
  };
  const deleteItem = (id) => ctx.deleteItemFromEntity(key, id);

  return [data, { setCollection, addItem, updateItem, deleteItem }];
}

// Clean API for Platform Data specifically
export function usePlatformData(key) {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('usePlatformData must be used within DataProvider');
  
  if (ctx.scope !== 'PLATFORM') {
    console.warn(`usePlatformData called but current scope is ${ctx.scope}`);
  }

  const data = ctx.dataStore[key] || [];
  const setCollection = (newData) => ctx.updateEntity(key, newData);
  const addItem = (item) => ctx.addItemToEntity(key, item);
  const updateItem = (id, updaterOrObject) => {
    ctx.updateItemInEntity(key, id, (item) => {
      if (typeof updaterOrObject === 'function') return updaterOrObject(item);
      return { ...item, ...updaterOrObject };
    });
  };
  const deleteItem = (id) => ctx.deleteItemFromEntity(key, id);

  return [data, { setCollection, addItem, updateItem, deleteItem }];
}

// Hook for persisting UI state — resilient to missing context (e.g. during HMR)
export function useUIState(key, defaultValue) {
  const ctx = useContext(DataContext);

  // Fallback local state when DataProvider is not yet mounted
  const [localVal, setLocalVal] = useState(() => {
    // Only attempt localStorage read if ctx is absent
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`ui_${key}`);
        if (raw !== null) return JSON.parse(raw);
      } catch (_) {}
    }
    return defaultValue;
  });

  if (!ctx) {
    // Return a local fallback — no persistence, no crash
    return [localVal, setLocalVal];
  }

  const storedVal = ctx.dataStore[`ui_${key}`];
  let val = storedVal;

  if (val === undefined) {
    const fromStorage = loadData(`ui_${key}`);
    val = fromStorage !== null ? fromStorage : defaultValue;
  }

  const setVal = (newVal) => {
    if (typeof newVal === 'function') {
      const currentVal = ctx.dataStore[`ui_${key}`] !== undefined
        ? ctx.dataStore[`ui_${key}`]
        : (loadData(`ui_${key}`) !== null ? loadData(`ui_${key}`) : defaultValue);
      ctx.updateUIState(key, newVal(currentVal));
    } else {
      ctx.updateUIState(key, newVal);
    }
  };

  return [val, setVal];
}
