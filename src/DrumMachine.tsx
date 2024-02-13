import React from "react";
import * as Tone from "tone";

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

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [filterFreq, setFilterFreq] = React.useState(1000);

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const handleStartClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
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
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreq = Number(e.target.value);
    setFilterFreq(newFreq);
  };

  const filterRef = React.useRef(null);

  React.useEffect(() => {
    
    const filter = new Tone.Filter(filterFreq, 'lowpass').toDestination();

    filterRef.current = new Tone.Filter({
      frequency: filterFreq,
      type: 'lowpass'
    }).toDestination();

    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).connect(filter),
    }));

    filterRef.current?.connect(recorder);

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          lampsRef.current[step].checked = true;
        });
      },
      [...stepIds],
      "16n"
    );
    seqRef.current.start(0);
  }, [samples, numOfSteps, filterFreq, recorder]);

  React.useEffect(() => {
    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => {
        trk.sampler.disconnect();
      });
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
          <span>BPM</span>
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
  
        
      </div>
    </div>
  );
}
