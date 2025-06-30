// /api/pushbullet.js
export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_token, ...pushData } = req.body;
    
    // Use token from request body or environment variable
    const token = access_token || process.env.PUSHBULLET_TOKEN;
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Access token required. Provide via access_token parameter or environment variable.' 
      });
    }

    // Set defaults for Pushbullet
    const payload = {
      type: 'note',
      title: 'API Push',
      body: 'Sent via serverless function',
      ...pushData
    };

    console.log('Sending push:', payload);

    const response = await fetch('https://api.pushbullet.com/v2/pushes', {
      method: 'POST',
      headers: {
        'Access-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: responseData.error?.message || 'Pushbullet API error',
        details: responseData
      });
    }

    return res.status(200).json({
      success: true,
      pushId: responseData.iden,
      data: responseData
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
