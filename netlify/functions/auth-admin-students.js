// Netlify Function for admin students endpoint
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  // Extract student ID from path if present
  // Netlify redirects might use event.path or event.rawPath
  // Also check headers for the original request path
  // Path format: /api/Admin/students or /api/Admin/students/{id} or /api/Admin/students/{id}/toggle-active
  let path = event.rawPath || event.path || '';
  
  // Check if the original path is in headers (Netlify might pass it this way)
  const originalPath = event.headers['x-netlify-original-path'] || 
                       event.headers['x-forwarded-uri'] ||
                       event.headers['referer']?.split('?')[0] ||
                       '';
  
  // Use original path if available and contains the ID
  if (originalPath && (originalPath.includes('/students/') || originalPath.includes('/toggle-active'))) {
    path = originalPath;
  }
  
  const pathParts = path.split('/').filter(p => p);
  let studentId = null;
  let isToggleActive = false;
  
  // Debug logging
  console.log('Netlify Function Debug:', {
    path: event.path,
    rawPath: event.rawPath,
    originalPath: originalPath,
    httpMethod: event.httpMethod,
    pathParts: pathParts,
    headers: Object.keys(event.headers)
  });
  
  // Find student ID in path
  const studentsIndex = pathParts.indexOf('students');
  if (studentsIndex !== -1 && pathParts.length > studentsIndex + 1) {
    const nextPart = pathParts[studentsIndex + 1];
    if (nextPart === 'toggle-active' && studentsIndex > 0) {
      // This is a toggle-active request, get ID from previous part
      studentId = pathParts[studentsIndex - 1];
      isToggleActive = true;
    } else if (nextPart !== 'toggle-active') {
      studentId = nextPart;
      // Check if the part after ID is 'toggle-active'
      if (pathParts.length > studentsIndex + 2 && pathParts[studentsIndex + 2] === 'toggle-active') {
        isToggleActive = true;
      }
    }
  }
  
  // Also check if the path ends with /toggle-active
  if (path.endsWith('/toggle-active') && !isToggleActive) {
    isToggleActive = true;
    // Extract ID from path (second to last part)
    const parts = path.split('/').filter(p => p);
    if (parts.length >= 2) {
      studentId = parts[parts.length - 2];
    }
  }
  
  // If still no studentId, check if it's in the query string
  if (!studentId && event.queryStringParameters && event.queryStringParameters.id) {
    studentId = event.queryStringParameters.id;
  }
  
  console.log('Extracted:', { studentId, isToggleActive, finalPath: path });

  // Build API URL
  let apiUrl = 'https://elghazaly.runasp.net/api/Admin/students';
  if (studentId && isToggleActive) {
    apiUrl = `https://elghazaly.runasp.net/api/Admin/students/${studentId}/toggle-active`;
  } else if (studentId) {
    apiUrl = `https://elghazaly.runasp.net/api/Admin/students/${studentId}`;
  }

  // If we still don't have a studentId but the method is DELETE/PUT/PATCH, 
  // try to extract from the full request URL
  if (!studentId && (event.httpMethod === 'DELETE' || event.httpMethod === 'PUT' || event.httpMethod === 'PATCH')) {
    // Try to get from the full URL in headers
    const fullUrl = event.headers['x-forwarded-uri'] || 
                    event.headers['referer'] || 
                    event.headers['x-original-uri'] ||
                    '';
    
    if (fullUrl) {
      const urlMatch = fullUrl.match(/\/students\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        studentId = urlMatch[1];
        if (fullUrl.includes('/toggle-active')) {
          isToggleActive = true;
        }
        // Rebuild URL with extracted ID
        if (studentId && isToggleActive) {
          apiUrl = `https://elghazaly.runasp.net/api/Admin/students/${studentId}/toggle-active`;
        } else if (studentId) {
          apiUrl = `https://elghazaly.runasp.net/api/Admin/students/${studentId}`;
        }
      }
    }
  }

  // Determine HTTP method
  let method = event.httpMethod;
  if (isToggleActive) {
    method = 'PATCH';
  }
  
  console.log('Final API call:', { method, apiUrl, studentId, isToggleActive });

  try {
    // Forward the request to the actual API
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward authorization header if present
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
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

