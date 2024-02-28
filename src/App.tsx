import DrumMachine from "./DrumMachine";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Resume from './Resume'; 


function App() {
  return (
    <div> 
    <Router>
      <Link to="/">Home</Link>
      <Link to="/resume">Resume</Link>
      <Routes>
        <Route path="/resume" element={<Resume />} />
        <Route path="/" element={<DrumMachine 
        samples={[{ url: "/B.wav", name: "B" },
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
          { url: "/C.wav", name: "C" }]} samples2={[]} />} />
      </Routes>
    </Router>
    </div>
  );
  
}

export default App;
