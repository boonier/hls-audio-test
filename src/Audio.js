import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// styled-component
const PlayButton = styled.div`
  background-color: darkgrey;
  padding: 2rem;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;

// play audio function
// I got this function from this stackoverflow question:
// https://stackoverflow.com/questions/47686345/playing-sound-in-reactjs
const useAudio = (url) => {
  const [playing, setPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const toggle = () => {
    if (audioRef) {
      // console.log(audioRef);

      if (audioRef.src !== url) {
        audioRef.src = url;
      }
      // audioRef.load();

      if (!playing) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    console.log('useEffect' + audioRef);
    if (audioRef) {
      audioRef.src = url;
      audioRef.load();
    }
  }, [audioRef, url]);

  return [playing, toggle, setAudioRef];
};

const PlayAudio = ({ url }) => {
  const [playing, toggle, setAudioRef] = useAudio(url);

  //console.log("render  PlayAudio");
  return (
    <>
      <PlayButton onClick={toggle}>
        {playing ? 'Pause' : 'Play'}
        <audio ref={(c) => setAudioRef(c)} />
      </PlayButton>
      <br />
      <p>(audio is {playing ? 'Playing' : 'Paused'})</p>
      <p>
        {playing
          ? 'Might take a few seconds to load, and audio is a little low (will not play on mobile)'
          : ''}
      </p>
    </>
  );
};

export default PlayAudio;
