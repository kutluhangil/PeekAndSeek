# Google Cloud Setup Prompt for Gemini Cloud Assist

I have a React web application called "Peek & Seek" that uses Google Maps to create a hide-and-seek game. The app is running locally on http://localhost:3000 in development mode.

**Current Status:**

- Project name: peek-and-seek
- App needs: Google Maps to render an interactive map with custom styling
- Frontend uses: @vis.gl/react-google-maps library
- Backend: Express server that proxies Street View API requests
- Storage: API key will be stored in a .env file as VITE_GOOGLE_MAPS_API_KEY

**Required APIs to Enable:**

1. Maps JavaScript API - for interactive map rendering
2. Street View Static API - for Street View imagery on the map
3. Geocoding API - for converting coordinates to location names (clues)

**What I Need Help With (step by step):**

1. **Enable the three required APIs** in the peek-and-seek Google Cloud project
   - Show me exactly where to click in the Console
   - Confirm which APIs are now enabled

2. **Create or retrieve an API Key** that works for all three services
   - Where to find/create the key in the project
   - Copy the key and verify it's unrestricted (or properly scoped)

3. **Configure API Key Restrictions** for development safety
   - Set HTTP referrer restrictions to allow: http://localhost:3000/\*
   - Ensure the key is restricted to only the three required APIs (Maps JS, Street View Static, Geocoding)

4. **Verify Billing is Enabled**
   - Confirm the project has a billing account attached
   - Check if there are any free quota limits that apply

5. **Test the Configuration**
   - How to verify the APIs are working (console checks, test endpoints)
   - Any troubleshooting steps if authentication still fails

**Additional Context:**

- The app runs on port 3000 locally
- Frontend sends the API key via environment variable (VITE_GOOGLE_MAPS_API_KEY)
- The backend also uses this key to proxy Street View Static API requests
- Users can also input a personal API key in the landing page UI

Please guide me through this setup process in a clear, numbered format so I can complete it without missing any critical configuration steps.
