import DrumMachine from "./DrumMachine";

function App() {
  return (
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
    />
  );
}

export default App;
