import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
//import RtcEngine, { ChannelProfile, ClientRole } from 'react-native-agora';

const AGORA_APP_ID = 'd5ca0258481e4285a9a6286cb5215581'; // Set your Agora App ID here

const LiveStreamHost = ({ route, navigation }) => {
  const [joined, setJoined] = useState(false);
  const { meetingId } = route.params;

  useEffect(() => {
    const init = async () => {
      const engine = await RtcEngine.create(AGORA_APP_ID);
      await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await engine.setClientRole(ClientRole.Broadcaster);

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log(`Joined channel ${channel} successfully!`);
        setJoined(true);
      });

      engine.joinChannel(null, 'demoChannel', null, 0);
    };

    init();

    return () => {
      RtcEngine.destroy();
    };
  }, [meetingId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {joined ? <Text>Streaming...</Text> : <Text>Setting up stream...</Text>}
    </View>
  );
};

export default LiveStreamHost;
