import React from "react";
import * as Tone from "tone";
import { useEffect, useState, useRef } from 'react';


import styles from "./DrumMachine.module.scss";

const NOTE = "C2";

type Track = {
  id: number;
  sampler: Tone.Sampler;
};



type Props = {
  samples: { url: string; name: string }[];
  numOfSteps?: number;
};

export default function DrumMachine({ samples, numOfSteps = 16 }: Props) {
  const [recorder] = React.useState(new Tone.Recorder());
  const [audioURL, setAudioURL] = React.useState(''); 
  const [bpm, setBpm] = React.useState(Tone.Transport.bpm.value);
  
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'lowpass' | 'highpass'>('lowpass');
  const [filterFreq, setFilterFreq] = React.useState(1000);
  const filterRef = React.useRef<Tone.Filter | null>(null);
  const [distortionValue, setDistortionValue] = React.useState(0.8);


  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);
  const distortionRef = React.useRef<Tone.Distortion | null>(null);
  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;
  const [activeSteps, setActiveSteps] = useState(() => 
  Array(samples.length).fill(Array(numOfSteps).fill(false))
  );
  const [playingNotes, setPlayingNotes] = React.useState<boolean[]>(Array(samples.length).fill(false));

  const handleStartClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      seqRef.current?.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      seqRef.current?.start(0);
      setIsPlaying(true);
    }
  };

  Tone.Destination.connect(recorder);

  const handleRecordClick = async () => {
    if (recorder.state === 'started') {
      const recordedAudioBuffer = await recorder.stop();
      setAudioURL(URL.createObjectURL(recordedAudioBuffer));
    } else {
      recorder.start();
    }
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = audioURL;
    link.download = 'recorded-audio.wav';
    link.click();
  };
  
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(e.target.value);
    setBpm(newBpm); 
    Tone.Transport.bpm.value = newBpm;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreq = Number(e.target.value);
    setFilterFreq(newFreq);
    if (filterRef.current) {
      filterRef.current.frequency.value = newFreq;
    }
  };

  const handleDistortionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDistortionValue = parseFloat(event.target.value);
    setDistortionValue(newDistortionValue);
    if (distortionRef.current) {
      distortionRef.current.distortion = newDistortionValue;
    }
  };

  React.useEffect(() => {
    tracksRef.current.forEach(track => {
      track.sampler.disconnect();
      track.sampler.dispose();
    });
    
    if (filterRef.current) {
      filterRef.current.disconnect();
      filterRef.current.dispose();
    }
    if (distortionRef.current) {
      distortionRef.current.disconnect();
      distortionRef.current.dispose();
    }
    
    distortionRef.current = new Tone.Distortion(distortionValue).toDestination();

    if (filterRef.current) {
      filterRef.current.disconnect();
    }
  
    const filter = new Tone.Filter({
      frequency: filterFreq,
      type: filterType,
      rolloff: -12, 
      Q: 8, 
    }).connect(distortionRef.current);

      filterRef.current = filter;
  
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).connect(filter),  

    }));

    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).connect(filter),
    }));
  }, [samples, filterFreq, filterType, distortionValue]);
  
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked && !playingNotes[trk.id]) {
            trk.sampler.triggerAttack(NOTE, time);
            setPlayingNotes(prev => {
              const newPlayingNotes = [...prev];
              newPlayingNotes[trk.id] = true;
              return newPlayingNotes;
            });
          }
          lampsRef.current[step].checked = true;
        });
      },
      [...stepIds],
      "16n"
    );

    
  React.useEffect(() => {
    return () => {
      Tone.Transport.stop();
      setActiveSteps(steps => steps.map(track => track.map(() => false)));
      stepsRef.current = [[]];
      
    };
    
  }, []);

  return (
    <div className={styles.machine}>
      <div className={styles.labelList}>
        {samples.map((sample) => (
          <div>{sample.name}</div>
        ))}
      </div>
      <div className={styles.grid}>
        <div className={styles.row}>
          {stepIds.map((stepId) => (
            <label className={styles.lamp}>
              <input
                type="radio"
                name="lamp"
                id={"lamp" + "-" + stepId}
                disabled
                ref={(elm) => {
                  if (!elm) return;
                  lampsRef.current[stepId] = elm;
                }}
                className={styles.lamp__input}
              />
              <div className={styles.lamp__content} />
            </label>
          ))}
        </div>
        <div className={styles.cellList}>
          {trackIds.map((trackId) => (
            <div key={trackId} className={styles.row}>
              {stepIds.map((stepId) => {
                const id = trackId + "-" + stepId;
                return (
                  <label className={styles.cell}>
                    <input
                      key={id}
                      id={id}
                      type="checkbox"
                      ref={(elm) => {
                        if (!elm) return;
                        if (!stepsRef.current[trackId]) {
                          stepsRef.current[trackId] = [];
                        }
                        stepsRef.current[trackId][stepId] = elm;
                      }}
                      className={styles.cell__input}
                    />
                    <div className={styles.cell__content} />
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button onClick={handleStartClick} className={styles.button}>
          {isPlaying ? "Pause" : "Start"}
        </button>
        <button onClick={handleRecordClick} className={styles.button}>
        {recorder.state === 'started' ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioURL && (
        <button onClick={handleDownloadClick} className={styles.button}>
          Download Recorded Audio
        </button>
        )}
        <label className={styles.fader}>
          <span>BPM: {bpm}</span>
          <input
            type="range"
            min={30}
            max={300}
            step={1}
            onChange={handleBpmChange}
            defaultValue={120}
          />
        </label>
        <label className={styles.fader}>
          <span>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            defaultValue={1}
          />
        </label>
        <button onClick={() => setFilterType(prevType => prevType === 'lowpass' ? 'highpass' : 'lowpass')}className={styles.button} >
        Switch to {filterType === 'lowpass' ? 'Highpass' : 'Lowpass'}
      </button>
        <label className={styles.fader}>
          <span>Filter Frequency</span>
          <input
            type="range"
            min={20}
            max={20000}
            step={1}
            onChange={handleFilterChange}
            defaultValue={filterFreq}
          />
        </label>
        <label className={styles.fader}>
        <span>Distortion</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={distortionValue}
          onChange={handleDistortionChange}
        />
      </label>
      </div>
    </div>
  );
}
