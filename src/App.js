import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './App.css';

const files = [
  'https://staging.bleedingfingersmusic.com/assets/audio/test/silence.mp3',
  'https://staging.bleedingfingersmusic.com/assets/audio/test/track-01/hls.m3u8',
  'https://staging.bleedingfingersmusic.com/assets/audio/test/track-02/hls.m3u8',
];

function App() {
  const [selectedSrc, setSelectedSrc] = useState('');
  const [started, setStarted] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [audioNode] = useState(new Audio(files[0]));
  // const audioNode = useRef(null);
  // const [hlsNode] = useState(new Hls());
  const hlsNode = new Hls({
    enableWorker: false,
  });

  useEffect(() => {
    if (Hls.isSupported()) {
      console.log('in hls mode');
      if (hlsNode) {
        hlsNode.destroy();
      }
    } else {
      document.addEventListener('touchstart', () => {
        audioNode.loop = true;
        audioNode.play();
      });
    }
  }, []);

  useEffect(() => {
    if (started) {
      audioNode.addEventListener('playing', () =>
        console.log('playing the asset'),
      );
      audioNode.addEventListener('ended', () => loadNextTrack());
      audioNode.addEventListener('progress', () =>
        console.log('loading the asset'),
      );
    }
    return () => {
      audioNode.addEventListener('playing', () => {});
      audioNode.removeEventListener('ended', () => loadNextTrack());
    };
  }, [started]);

  useEffect(() => {
    audioNode.loop = false;
    setSelectedSrc(`${files[playIndex]}`);
  }, [playIndex]);

  useEffect(() => {
    if (selectedSrc.length > 0 && started) {
      if (Hls.isSupported()) {
        hlsNode.loadSource(selectedSrc);
        hlsNode.attachMedia(audioNode);
        hlsNode.on(Hls.Events.MANIFEST_PARSED, function () {
          audioNode.play();
        });
      } else {
        audioNode.src = selectedSrc;
        audioNode.play();
      }
    }
  }, [selectedSrc]);

  const getNextIndex = (prevIdx) =>
    prevIdx < files.length - 1 ? prevIdx + 1 : 1; // offset from beginning of files[] by 1

  const loadNextTrack = () => setPlayIndex((prevIdx) => getNextIndex(prevIdx));

  return (
    <div className="App">
      <h1>{'<audio>'} element test</h1>
      {started ? (
        <>
          <div>{playIndex}</div>
          {files.map((item, i) =>
            i > 0 ? (
              <button data-src={item} onClick={() => setPlayIndex(i)}>
                Load src {i}
              </button>
            ) : null,
          )}
          {/* <button onClick={() => setPlayIndex(3)}>Load src 3</button> */}
          <h3>{selectedSrc}</h3>
        </>
      ) : (
        <button onClick={() => setStarted(true)}>START</button>
      )}
      {/* <audio ref={audioNode} /> */}
    </div>
  );
}

export default App;
