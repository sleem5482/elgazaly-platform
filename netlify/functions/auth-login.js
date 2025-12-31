// Netlify Function for login endpoint
exports.handler = async (event, context) => {
  // Handle CORS preflight
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

  const apiUrl = 'https://elghazaly.runasp.net/api/Auth/login';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: event.body,
    });

    const responseText = await response.text();

    // Debug logging
    console.log('API Response Status:', response.status);
    console.log('API Response Text Length:', responseText ? responseText.length : 0);
    console.log('API Response Text:', responseText ? responseText.substring(0, 200) : '(empty)');

    // Check if the upstream response is ok and try to keep its headers
    const upstreamContentType = response.headers.get('content-type') || 'application/json';

    // If the response from the upstream server is not OK, we will create a structured JSON error response
    // to ensure the client doesn't fail parsing a non-JSON body (like an HTML error page).
    if (!response.ok) {
      let errorBody;
      
      // Handle empty response
      if (!responseText || responseText.trim() === '') {
        errorBody = JSON.stringify({ 
          error: 'Internal Server Error',
          message: `Server returned ${response.status} with no response body`,
          statusCode: response.status
        });
      } else {
        try {
          // Attempt to parse the upstream error body, it might be valid JSON.
          JSON.parse(responseText);
          errorBody = responseText; // It is JSON, so we can forward it.
        } catch (e) {
          // It's not JSON, so create a new JSON error object to send to the client.
          const details = responseText.length > 500 ? responseText.substring(0, 500) : responseText;
          errorBody = JSON.stringify({ 
            error: 'Upstream API error',
            message: details,
            statusCode: response.status
          });
        }
      }

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json', // Always return JSON for errors.
          'Access-Control-Allow-Origin': '*',
        },
        body: errorBody,
      };
    }

    // If the response is successful, forward it as is.
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': upstreamContentType,
        'Access-Control-Allow-Origin': '*',
      },
      body: responseText,
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

