// Netlify Function to proxy API requests and avoid CORS issues
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Extract the API path from the original request
  // Netlify passes the original path in x-netlify-original-path header or rawPath
  let path = event.headers['x-netlify-original-path'] || 
             event.rawPath || 
             event.path;
  
  // Remove /api prefix if present
  if (path.startsWith('/api')) {
    path = path.replace('/api', '');
  }
  
  // Remove function path if present
  if (path.includes('/.netlify/functions/api-proxy')) {
    path = path.replace('/.netlify/functions/api-proxy', '');
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  const apiUrl = `https://elghazaly.runasp.net/api${path}`;

  console.log('Proxying request to:', apiUrl);
  console.log('Request body:', event.body);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: event.body,
    });

    const data = await response.text();
    
    console.log('API Response status:', response.status);
    console.log('API Response:', data);
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

