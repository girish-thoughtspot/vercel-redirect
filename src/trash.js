
    async function fetchToken() {
        const response = await fetch('https://api.vercel.com/v2/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000'
          })
        })
        const res = await response.json()
        console.log(response)
        console.log(res)
      }
      fetchToken();