import * as Tone from 'tone';
import { useEffect, useRef } from 'react';
import DrumMachine from './DrumMachine';

const SpectrumAnalyzer = () => {
  window.onload = function() {
    // Step 1: Create an analyser node
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = 2048; // Change this to change the frequency bin count
  
    // Step 2: Connect the master output to the analyser
    Tone.Destination.connect(analyser);
  
    // Step 3: Create a data array and a function to update and draw the visualization
    const data = new Uint8Array(analyser.frequencyBinCount);
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
  
    function draw() {
      // Update the data array
      analyser.getByteFrequencyData(data);
  
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw the frequency data
      for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const value = data[i];
        const percent = value / 255;
        const height = canvas.height * percent;
        const offset = canvas.height - height - 1;
        const barWidth = canvas.width / analyser.frequencyBinCount;
        ctx.fillStyle = 'black';
        ctx.fillRect(i * barWidth, offset, barWidth, height);
      }
  
      // Call this function again on the next frame
      requestAnimationFrame(draw);
    }
  
    // Start the drawing loop
    draw();
  }
}

export default SpectrumAnalyzer;