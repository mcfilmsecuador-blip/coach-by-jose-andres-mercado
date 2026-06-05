const fs = require('fs');
const path = require('path');

async function main() {
  const configPath = path.join(process.env.HOME, '.config/configstore/firebase-tools.json');
  if (!fs.existsSync(configPath)) {
    console.error("Firebase config not found at:", configPath);
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const accessToken = config.tokens.access_token;
  const projectId = 'coach-252e2';

  console.log("Fetching current Firebase Auth config...");
  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;

  try {
    let response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log("Access token expired. Attempting to refresh token...");
      // Let's use the refresh token to get a new access token.
      // For firebase-tools CLI, client_id and client_secret are standard:
      const clientId = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
      const clientSecret = "vEs7CcE1sA7qIL9rsLN2"; // standard Firebase CLI client secret
      
      const refreshUrl = 'https://oauth2.googleapis.com/token';
      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: config.tokens.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!refreshResponse.ok) {
        throw new Error(`Failed to refresh token: ${await refreshResponse.text()}`);
      }

      const refreshData = await refreshResponse.json();
      console.log("Token refreshed successfully!");
      
      // Update config file
      config.tokens.access_token = refreshData.access_token;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Retry request
      response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${refreshData.access_token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    if (!response.ok) {
      throw new Error(`API returned error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    console.log("Current authorized domains:", data.authorizedDomains);

    const targetDomain = 'mcfilms.es';
    if (data.authorizedDomains.includes(targetDomain)) {
      console.log(`Domain "${targetDomain}" is already in the list.`);
      return;
    }

    console.log(`Adding "${targetDomain}" to authorized domains...`);
    const newDomains = [...data.authorizedDomains, targetDomain];

    // Prepare update payload
    const updatePayload = {
      authorizedDomains: newDomains
    };

    const patchResponse = await fetch(`${url}?updateMask=authorizedDomains`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.tokens.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    if (!patchResponse.ok) {
      throw new Error(`Failed to update authorized domains: ${patchResponse.status} ${await patchResponse.text()}`);
    }

    const patchData = await patchResponse.json();
    console.log("Updated authorized domains successfully!", patchData.authorizedDomains);

  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

main();
