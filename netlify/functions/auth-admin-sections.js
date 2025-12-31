// Netlify Function for admin sections endpoint
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  // Extract section ID from path if present
  let path = event.rawPath || event.path || '';
  const originalPath = event.headers['x-netlify-original-path'] || 
                       event.headers['x-forwarded-uri'] ||
                       event.headers['referer']?.split('?')[0] ||
                       '';
  
  if (originalPath && originalPath.includes('/sections/')) {
    path = originalPath;
  }
  
  const pathParts = path.split('/').filter(p => p);
  let sectionId = null;
  
  // Find section ID in path
  const sectionsIndex = pathParts.indexOf('sections');
  if (sectionsIndex !== -1 && pathParts.length > sectionsIndex + 1) {
    sectionId = pathParts[sectionsIndex + 1];
  }
  
  // If still no sectionId, check if it's in the query string
  if (!sectionId && event.queryStringParameters && event.queryStringParameters.id) {
    sectionId = event.queryStringParameters.id;
  }

  // Build API URL
  let apiUrl = 'https://elghazaly.runasp.net/api/Admin/sections';
  if (sectionId) {
    apiUrl = `https://elghazaly.runasp.net/api/Admin/sections/${sectionId}`;
  }

  // If we still don't have a sectionId but the method is DELETE, 
  // try to extract from the full request URL
  if (!sectionId && event.httpMethod === 'DELETE') {
    const fullUrl = event.headers['x-forwarded-uri'] || 
                    event.headers['referer'] || 
                    event.headers['x-original-uri'] ||
                    '';
    
    if (fullUrl) {
      const urlMatch = fullUrl.match(/\/sections\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        sectionId = urlMatch[1];
        apiUrl = `https://elghazaly.runasp.net/api/Admin/sections/${sectionId}`;
      }
    }
  }

  console.log('Sections API call:', { method: event.httpMethod, apiUrl, sectionId });

  try {
    // Forward the request to the actual API
    const response = await fetch(apiUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(event.headers.authorization && { 'Authorization': event.headers.authorization }),
      },
      body: event.body || undefined,
    });

    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      },
      body: data,
    };
  } catch (error) {
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
