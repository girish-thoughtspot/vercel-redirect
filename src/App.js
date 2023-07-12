import React from 'react';
import './App.css';

function App() {
  const [cluster, setCluster] = React.useState('')
  const [token, setToken] = React.useState('')

  const handleNext = () => {
    console.log('handleNext')
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className='form-element'>
          <span>ThoughtSpot Cluster</span>
          <input value={cluster} onChange={(e) => setCluster(e.target.value)}/>
        </div>
        <div className='form-element'>
          <span>Authorization token</span>
          <input value={token} onChange={(e) => setToken(e.target.value)}/>
        </div>
        <div>
          <button onClick={handleNext}>Next</button>
        </div>
      </header>
    </div>
  );
}

export default App;
