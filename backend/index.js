// Main Worker Entry Point
// Cloudflare Workers backend for DSMS

import { createApp } from './app.js';

export default {
  async fetch(request, env, ctx) {
    const app = createApp();
    
    try {
      return await app.handle(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
