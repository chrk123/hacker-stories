import * as React from 'react';

interface welcome {
  greeting: string,
  title: string,
}

const welcomeStrings: welcome = { greeting: "Hey", title: "React"};

function App() {
  return (
    <div>
      <h1>{welcomeStrings.greeting} {welcomeStrings.title}</h1>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;