import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './App.css';

const files = [
  'http://dev.sjm-create.co.uk/bf/audio/silence.mp3',
  'http://dev.sjm-create.co.uk/bf/audio/track-01/hls.m3u8',
  'http://dev.sjm-create.co.uk/bf/audio/track-02/hls.m3u8',
  // 'http://192.168.0.13:3010/assets/audio/track-01/hls.m3u8',
  // 'http://192.168.0.13:3010/assets/audio/track-02/hls.m3u8',
  // 'http://192.168.0.13:3010/assets/audio/alcohol.mp3',
  // 'http://192.168.0.13:3010/assets/audio/and.mp3',
  // 'http://192.168.0.13:3010/assets/audio/china.mp3',
];

function App() {
  const [selectedSrc, setSelectedSrc] = useState('');
  const [started, setStarted] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  // const [audioNode] = useState(new Audio(files[0]));
  const audioNode = useRef(null);
  // const [hlsNode] = useState(new Hls());
  const hlsNode = new Hls({
    enableWorker: false,
  });

  useEffect(() => {
    if (Hls.isSupported()) {
      if (hlsNode) {
        hlsNode.destroy();
      }
    } else {
      document.addEventListener('touchstart', () => {
        audioNode.current.loop = true;
        audioNode.current.play();
      });
    }
  }, []);

  useEffect(() => {
    if (started) {
      audioNode.current.addEventListener('playing', () =>
        console.log('playing'),
      );
      audioNode.current.addEventListener('ended', () => loadNextTrack());
    }
    return () => {
      audioNode.current.addEventListener('playing', () => {});
      audioNode.current.removeEventListener('ended', () => loadNextTrack());
    };
  }, [started]);

  useEffect(() => {
    audioNode.current.loop = false;
    setSelectedSrc(`${files[playIndex]}`);
  }, [playIndex]);

  useEffect(() => {
    if (selectedSrc.length > 0 && started) {
      if (Hls.isSupported()) {
        hlsNode.loadSource(selectedSrc);
        hlsNode.attachMedia(audioNode.current);
        hlsNode.on(Hls.Events.MANIFEST_PARSED, function () {
          audioNode.current.play();
        });
      } else {
        audioNode.current.src = selectedSrc;
        audioNode.current.play();
      }
    }
  }, [selectedSrc]);

  const getNextIndex = (prevIdx) =>
    prevIdx < files.length - 1 ? prevIdx + 1 : 1;

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
      <audio ref={audioNode} />
    </div>
  );
}

export default App;
