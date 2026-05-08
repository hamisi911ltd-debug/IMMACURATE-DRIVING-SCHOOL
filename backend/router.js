// Advanced Router for DSMS Backend
// Handles all API routes with proper error handling and validation

export class Router {
  constructor() {
    this.routes = {
      GET: new Map(),
      POST: new Map(),
      PUT: new Map(),
      DELETE: new Map(),
      PATCH: new Map()
    };
  }

  // Register route handlers
  get(path, handler) {
    this.routes.GET.set(path, handler);
    return this;
  }

  post(path, handler) {
    this.routes.POST.set(path, handler);
    return this;
  }

  put(path, handler) {
    this.routes.PUT.set(path, handler);
    return this;
  }

  delete(path, handler) {
    this.routes.DELETE.set(path, handler);
    return this;
  }

  patch(path, handler) {
    this.routes.PATCH.set(path, handler);
    return this;
  }

  // Match route with parameters
  matchRoute(method, pathname) {
    const routes = this.routes[method];
    if (!routes) return null;

    // Try exact match first
    if (routes.has(pathname)) {
      return { handler: routes.get(pathname), params: {} };
    }

    // Try pattern matching
    for (const [pattern, handler] of routes.entries()) {
      const regex = this.pathToRegex(pattern);
      const match = pathname.match(regex);
      
      if (match) {
        const params = this.extractParams(pattern, match);
        return { handler, params };
      }
    }

    return null;
  }

  // Convert path pattern to regex
  pathToRegex(path) {
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)')
      .replace(/\*/g, '.*');
    return new RegExp(`^${pattern}$`);
  }

  // Extract parameters from matched route
  extractParams(pattern, match) {
    const params = {};
    const paramNames = pattern.match(/:(\w+)/g);
    
    if (paramNames && match.groups) {
      paramNames.forEach(param => {
        const name = param.slice(1);
        params[name] = match.groups[name];
      });
    }
    
    return params;
  }

  // Handle incoming request
  async handle(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: this.corsHeaders()
      });
    }

    // Match route
    const match = this.matchRoute(method, pathname);
    
    if (!match) {
      return this.jsonResponse({
        success: false,
        error: 'Route not found',
        path: pathname,
        method: method
      }, 404);
    }

    try {
      // Create context object
      const context = {
        request,
        env,
        ctx,
        params: match.params,
        query: Object.fromEntries(url.searchParams),
        url
      };

      // Execute handler
      const result = await match.handler(context);
      
      // Return response
      if (result instanceof Response) {
        return result;
      }
      
      return this.jsonResponse(result);
    } catch (error) {
      console.error('Route handler error:', error);
      return this.jsonResponse({
        success: false,
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }, 500);
    }
  }

  // CORS headers
  corsHeaders() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };
  }

  // JSON response helper
  jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...this.corsHeaders()
      }
    });
  }
}

// Request body parser
export async function parseBody(request) {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    return Object.fromEntries(new URLSearchParams(text));
  }
  
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  }
  
  return {};
}

// Validation helper
export function validate(data, rules) {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && !value) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (rule.type && value) {
      if (rule.type === 'email' && !isValidEmail(value)) {
        errors[field] = `${field} must be a valid email`;
      }
      if (rule.type === 'phone' && !isValidPhone(value)) {
        errors[field] = `${field} must be a valid phone number`;
      }
      if (rule.type === 'number' && isNaN(value)) {
        errors[field] = `${field} must be a number`;
      }
    }
    
    if (rule.min && value && value.length < rule.min) {
      errors[field] = `${field} must be at least ${rule.min} characters`;
    }
    
    if (rule.max && value && value.length > rule.max) {
      errors[field] = `${field} must be at most ${rule.max} characters`;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[\d\s-()]+$/.test(phone);
}

// Generate unique ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date
export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Pagination helper
export function paginate(query, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return {
    limit,
    offset,
    page
  };
}
