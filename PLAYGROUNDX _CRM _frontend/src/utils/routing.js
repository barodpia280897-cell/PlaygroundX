export const ROLE_PREFIX_MAP = {
  'TENANT_OWNER': 'ceo',
  'MANAGER': 'manager',
  'SUPERVISOR': 'supervisor',
  'AGENT': 'agent',
  'RECEPTIONIST': 'reception',
  'VIEWER': 'viewer',
  'PLATFORM_ADMIN': 'platform',
  'PLATFORM_OWNER': 'platform',
  'PLATFORM_SUPPORT': 'platform'
};

export const getRolePrefix = (role) => {
  return ROLE_PREFIX_MAP[role] || 'app';
};

export const getAppPath = (path, role) => {
  let prefix = 'app';
  if (role) {
    prefix = getRolePrefix(role);
  } else {
    const storedAuth = localStorage.getItem('pgx_auth_user');
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth);
        if (user && user.role) {
          prefix = getRolePrefix(user.role);
        }
      } catch (e) {
        // ignore
      }
    }
  }
  
  // ensure path starts with slash
  let safePath = path.startsWith('/') ? path : `/${path}`;
  
  // If the path already has the prefix (e.g. we passed /ceo/dashboard to getAppPath)
  // we shouldn't double it. Let's strip any existing known prefix or /app/
  const parts = safePath.split('/');
  if (parts.length > 1) {
    const existingPrefix = parts[1];
    if (existingPrefix === 'app' || Object.values(ROLE_PREFIX_MAP).includes(existingPrefix)) {
      parts.splice(1, 1);
      safePath = parts.join('/') || '/';
    }
  }

  // If path is root, just return /prefix
  if (safePath === '/') return `/${prefix}`;
  
  return `/${prefix}${safePath}`;
};
