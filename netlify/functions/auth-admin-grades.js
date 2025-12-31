// Netlify Function for admin grades endpoint
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  // Extract grade ID from path if present
  let path = event.rawPath || event.path || '';
  const originalPath = event.headers['x-netlify-original-path'] || 
                       event.headers['x-forwarded-uri'] ||
                       event.headers['referer']?.split('?')[0] ||
                       '';
  
  if (originalPath && originalPath.includes('/grades/')) {
    path = originalPath;
  }
  
  const pathParts = path.split('/').filter(p => p);
  let gradeId = null;
  
  // Find grade ID in path
  const gradesIndex = pathParts.indexOf('grades');
  if (gradesIndex !== -1 && pathParts.length > gradesIndex + 1) {
    gradeId = pathParts[gradesIndex + 1];
  }
  
  // If still no gradeId, check if it's in the query string
  if (!gradeId && event.queryStringParameters && event.queryStringParameters.id) {
    gradeId = event.queryStringParameters.id;
  }

  // Build API URL
  let apiUrl = 'https://elghazaly.runasp.net/api/Admin/grades';
  if (gradeId) {
    apiUrl = `https://elghazaly.runasp.net/api/Admin/grades/${gradeId}`;
  }

  // If we still don't have a gradeId but the method is DELETE/PUT, 
  // try to extract from the full request URL
  if (!gradeId && (event.httpMethod === 'DELETE' || event.httpMethod === 'PUT')) {
    const fullUrl = event.headers['x-forwarded-uri'] || 
                    event.headers['referer'] || 
                    event.headers['x-original-uri'] ||
                    '';
    
    if (fullUrl) {
      const urlMatch = fullUrl.match(/\/grades\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        gradeId = urlMatch[1];
        apiUrl = `https://elghazaly.runasp.net/api/Admin/grades/${gradeId}`;
      }
    }
  }

  console.log('Grades API call:', { method: event.httpMethod, apiUrl, gradeId });

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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
