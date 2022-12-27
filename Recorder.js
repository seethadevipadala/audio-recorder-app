import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { Audio } from "expo-av";
const Recorder = () => {
  const [recording, setRecording] = React.useState();
    const [uri, setUri] = useState();
    const [sound, setSound] = useState();
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    setUri(uri);
  }

//   async function playSound() {
//     console.log("Loading Sound");
//     const  sound  = await Audio.Sound.createAsync(
//       {uri}
//     //    { uri: uri}
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }
    const prepareToPlay = async () => {
    console.log(uri,"fileuri")
    const sound = new Audio.Sound();

    try {
        await sound.loadAsync({
            uri: uri,
            shouldPlay: true,
        });
        await sound.playAsync();
        console.log("Your sound is playing!")

    } catch (error) {
        // An error occurred!
        console.error('AUDIO PLAY: ', error);
    }
};
  return (
    <View>
      <Button title="start" onPress={startRecording} />
          <Button title="Stop" onPress={stopRecording} />
      <Button title="Play" onPress={prepareToPlay } />
          
    </View>
  );
};
export default Recorder;
