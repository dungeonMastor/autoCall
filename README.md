# Pushbullet API Caller

A simple web application that sends push notifications via Pushbullet API using Netlify functions.

## Features

-   Send push notifications via Pushbullet API
-   Configurable push type, title, and body
-   Secure token handling via URL parameters
-   CORS-enabled Netlify function

## Usage

1. Deploy to Netlify
2. Access the application with URL parameters:
    ```
    https://your-site.netlify.app/?access_token=YOUR_PUSHBULLET_TOKEN&type=note&title=Test&body=Hello World
    ```

## URL Parameters

-   `access_token` (required): Your Pushbullet access token
-   `type` (optional): Push type (default: 'note')
-   `title` (optional): Push title (default: 'Test Push')
-   `body` (optional): Push body (default: 'This is a test push from the API caller')

## Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy automatically

## Local Development

To test locally with Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

## Troubleshooting

If you get "Unexpected end of JSON input" error:

1. Check that your access_token is valid
2. Verify the Netlify function is deployed correctly
3. Check browser console for detailed error messages
