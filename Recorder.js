import React, { useEffect, useState } from "react";
import { View, Text, Button, Vibration } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from "react-native-vector-icons/Feather";

const Recorder = () => {
  var recordingTimer;
  const [recording, setRecording] = React.useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsplaying] = useState(false);
  const [uri, setUri] = useState();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [playingHours, setPlayingHours] = useState(hours);
  const [playingMinutes, setPlayingMinutes] = useState(minutes);
  const [playingSeconds, setPlayingSeconds] = useState(seconds);
  console.log(seconds);

  console.log(isRecording, "isrecording");
  useEffect(() => {
    if (isPlaying) {
      recordingTimer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        if (seconds === 0) {
          setSeconds(0)
          setShowPlayIcon(false);
          setIsplaying(false);
          setShowPlayIcon(false)
        }
      }, 1000);
    }
    return () => clearInterval(recordingTimer);
  });
  useEffect(() => {
    if (isRecording) {
      console.log(isRecording, "isrecording");

      recordingTimer = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(recordingTimer);
  });
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

  const prepareToPlay = async () => {
    console.log(uri, "fileuri");
    setIsplaying(true);
    const sound = new Audio.Sound();

    try {
      await sound.loadAsync({
        uri: uri,
        shouldPlay: true,
      });
      await sound.playAsync();
      console.log("Your sound is playing!");
    } catch (error) {
      console.error("AUDIO PLAY: ", error);
    }
  };
  return (
    <View>
      <View
        style={{
          height: 200,
          width: 210,
          backgroundColor: "rgb(74, 133, 212)",
          borderRadius: 120,
        }}
      >
        <View style={{ marginLeft: 30, marginBottom: 50 }}>
          {isRecording ? (
            <Icon
              name="settings-voice"
              size={150}
              color="white"
              onPress={() => {
                stopRecording();
                setShowPlayIcon(true);
                Vibration.vibrate();

                setIsRecording(false);
              }}
            />
          ) : (
            <Icon
              name="keyboard-voice"
              size={150}
              color="white"
              onPress={() => {
                startRecording();
                setIsRecording(true);
              Vibration.vibrate();

              }}
            />
          )}
        </View>
        <View></View>
      </View>
      <Text style={{ marginLeft: 10, fontSize: 50 }}>
        {/* {hours}:{minutes}:{seconds} */}
        {hours < 10 ? "0" + hours : hours}:
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </Text>
      <View style={{ marginLeft: 70, marginTop: 60 }}>
        {showPlayIcon && (
          <Icons
            name="play-circle"
            size={70}
            color="rgb(74, 133, 212)"
            onPress={() => {
              prepareToPlay();
              setPlayingSeconds(seconds);
            }}
          />
        )}
      </View>
      {/* <Icons name="pause-circle" size={40} color="rgb(74, 133, 212)"/> */}
{/* 
      <View style={{ flexDirection: "row", marginTop: 130 }}>
        <Button
          title="start"
          onPress={() => {
            startRecording();
            setIsRecording(true);
          }}
        />
        <View style={{ marginLeft: 100 }}>
          <Button
            title=" Stop "
            onPress={() => {
              stopRecording();
              setShowPlayIcon(true);

              setIsRecording(false);
            }}
          />
        </View>
      </View> */}
    </View>
  );
};
export default Recorder;
