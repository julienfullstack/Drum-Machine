import DrumMachine from "./DrumMachine";

function App() {
  return (
    <DrumMachine
      samples={[
        { url: "/hat-closed.wav", name: "CH" }
      ]}
    />
  );
}

export default App;
