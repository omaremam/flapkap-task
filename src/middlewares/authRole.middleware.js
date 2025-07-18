const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Unified authentication and role-based authorization middleware.
 * @param {Object} options
 * @param {string[]} [options.roles] - Allowed roles.
 * @param {'AND'|'OR'} [options.logic='OR'] - Role check logic.
 */
function authRole(options = {}) {
  const { roles, logic = 'OR' } = options;

  return (req, res, next) => {
    // 1. Authenticate
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 2. Role check (if roles specified)
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const userRole = req.user.role;
      if (!userRole) {
        return res.status(403).json({ error: 'Forbidden: no user role' });
      }
      if (logic === 'AND') {
        // User must have all roles (for multi-role users, e.g., userRole is array)
        if (Array.isArray(userRole)) {
          const hasAll = roles.every(role => userRole.includes(role));
          if (!hasAll) {
            return res.status(403).json({ error: 'Forbidden: insufficient roles (AND logic)' });
          }
        } else {
          // Single role, must match all (impossible)
          if (roles.length > 1 || !roles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: insufficient roles (AND logic)' });
          }
        }
      } else { // 'OR' logic (default)
        if (Array.isArray(userRole)) {
          const hasAny = roles.some(role => userRole.includes(role));
          if (!hasAny) {
            return res.status(403).json({ error: 'Forbidden: insufficient roles (OR logic)' });
          }
        } else {
          if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: insufficient roles (OR logic)' });
          }
        }
      }
    }
    // 3. All checks passed
    next();
  };
}

module.exports = authRole; 