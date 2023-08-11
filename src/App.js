import React from 'react';
import './App.css';

const CLIENT_ID = 'oac_yLfaITMJiCjRBscm4xFpXFom'
const CLIENT_SECRET = 'kWXH76nKYvU2rBLQeW0R73u9'
const TOKEN_RESPONSE = {
  "access_token":"kFcWXDXMDUrqxSBqHhurAHsi",
  "token_type":"Bearer",
  "installation_id":"icfg_qZHFfUfMLSK9EE0GrpYoNzFr",
  "user_id":"G2KKqqfZh4agndAeOckgXcqS",
  "team_id":null
}
const PROJECT_ID = 'prj_W8AdmDjAuYDmaEAWO1WC18p8r2gf'
function App() {
  const [cluster, setCluster] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState('')
  const [code, setCode] = React.useState('')
  const [pid, setPID] = React.useState('')
  const [vercelToken, setVercelToken] = React.useState('')
  const [loader, setLoader] = React.useState(false)

  const initiate = async () => {
    let pid='';
    const obj = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000'
    }
    const param = new URLSearchParams()
    param.append('code', code)
    param.append('client_id', CLIENT_ID)
    param.append('client_secret', CLIENT_SECRET)
    param.append('redirect_uri', 'http://localhost:3000')
    const response = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: param
    })
    const res = await response.json()
    console.log(response)
    console.log(res)
    setVercelToken(res.access_token)

    const projRes = await fetch(`https://api.vercel.com/v9/projects/`, {
      "headers": {
        "Authorization": `Bearer ${res.access_token}`
      },
      "method": "get"
    })
    const projData = await projRes.json()
    console.log(projRes)
    console.log(projData)
    pid = projData.projects[0].id
    setPID(pid)
    
    const EnvRes = await fetch(`https://api.vercel.com/v9/projects/${pid}/env?decrypt=true&source=vercel-cli:pull`, {
      "headers": {
        "Authorization": `Bearer ${res.access_token}`
      },
      "method": "get"
    })
    const envData = await EnvRes.json()
    console.log(EnvRes)
    console.log(envData)
  }

  React.useEffect(() => {
    if(code)
      initiate();
  }, [code])

  const saveEnv = async(key, value) => {
    await fetch(`https://api.vercel.com/v10/projects/${pid}/env?upsert=true`, {
      "body": JSON.stringify({
        "key": key,
        "value": value,
        "type": "plain",
        "target": [
          "production",
          "preview"
        ],
      }),
      "headers": {
        "Authorization": `Bearer ${vercelToken}`
      },
      "method": "post"
    })

  }

  const finalize = async() => {
    let _token = ''
    const tokenRes = await fetch(`https://${cluster}/api/rest/2.0/auth/token/full`, {
      headers: {
        "content-type": "application/json"
      },
      body: `{\"username\":\"${username}\",\"validity_time_in_sec\":3000,\"org_id\":0,\"auto_create\":false,\"password\":\"${password}\"}`,
      method: "POST"
    })
    const tokenData = await tokenRes.json()
    _token = tokenData.token
    console.log('_token', _token)
    await fetch(`https://${cluster}/callosum/v1/session/info`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "Authorization": `Bearer ${_token}`,
      },
      "method": "GET",
    }).then(r => r.json()).then(c => console.log(c));


    const param = new URLSearchParams()
    param.append('name', `vercel-db-conn_${Date.now()}`)
    param.append('type', 'RDBMS_POSTGRES')
    param.append('createEmpty', true)
    param.append('state', -1)
    param.append('metadata', JSON.stringify({
      "configuration": {
        "host": "ep-lingering-bread-029957.ap-southeast-1.aws.neon.tech",
        "password": "MJvN7YlHuq4W",
        "database": "Test",
        "port": "5432",
        "user": "durgesh.yadav"
      }
    }))
    await fetch(`https://${cluster}/callosum/v1/tspublic/v1/connection/create`, {
      "headers": {
        "accept": "application/json",
        "content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${_token}`
      },
      "method": "POST",
      "body": param,
    })

    await saveEnv('TS_CLUSTER', cluster)
    await saveEnv('TS_USERNAME', username)
    await saveEnv('TS_PASSWORD', password)
    await saveEnv('TS_TOKEN', _token)
    console.log('done')
    setTimeout(() => {
      console.log('closing')
      window.location = (new URLSearchParams(window.location.search)).get('next')
    }, 1000)
  }
  React.useEffect(() => {
    if(loader) {
      finalize()
    }
  }, [loader])

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    for (const p of searchParams) {
      console.log(p);
      if(p[0] === 'code')
        setCode(p[1])
    }
    console.log('------------------')
  },[])
  const handleNext = () => {
    console.log('handleNext')
    setLoader(true)
  }
  return (
    <div className="App">
      <header className="App-header">
        {loader ? (
          <div> Setting up TS integration...</div>
        ) : (
          <>
            <div className='form-element'>
              <span>ThoughtSpot Cluster</span>
              <input value={cluster} onChange={(e) => setCluster(e.target.value)}/>
            </div>
            {/* <div className='form-element'>
              <span>Authorization token</span>
              <input value={token} onChange={(e) => setToken(e.target.value)}/>
            </div> */}
            <div className='form-element'>
              <span>Username</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className='form-element'>
              <span>Password</span>
              <input value={password} type='password' onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
              <button onClick={handleNext} style={{padding: '16px', borderRadius: '4px'}}>Next</button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
