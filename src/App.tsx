import React from 'react';
import DrumMachine from "./DrumMachine";
import { Route, Link } from 'react-router-dom';
import Resume from './Resume'; 


function App() {
  return (
    <div>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/resume">Resume</Link>
      {/* <Route path="/resume" component={Resume} /> */}
    </nav>
    <DrumMachine
      samples={[
        { url: "/B.wav", name: "B" },
        { url: "/Asharp.wav", name: "A#" },
        { url: "/A.wav", name: "A" },
        { url: "/Gsharp.wav", name: "G#" },
        { url: "/G.wav", name: "G" },
        { url: "/Fsharp.wav", name: "F#" },
        { url: "/F.wav", name: "F" },
        { url: "/E.wav", name: "E" },
        { url: "/Dsharp.wav", name: "D#" },
        { url: "/D.wav", name: "D" },
        { url: "/Csharp.wav", name: "C#" },
        { url: "/C.wav", name: "C" },
      ]}
      samples2={[
        { url: "/B.wav", name: "D" },
        { url: "/Asharp.wav", name: "A#" },
        { url: "/A.wav", name: "A" },
        { url: "/Gsharp.wav", name: "G#" },
        { url: "/G.wav", name: "G" },
        { url: "/Fsharp.wav", name: "F#" },
        { url: "/F.wav", name: "F" },
        { url: "/E.wav", name: "E" },
        { url: "/Dsharp.wav", name: "D#" },
        { url: "/D.wav", name: "D" },
        { url: "/Csharp.wav", name: "C#" },
        { url: "/C.wav", name: "C" },
      ]}
    />
  </div>
  );
}

export default App;
