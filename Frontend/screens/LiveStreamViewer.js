import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
//import RtcEngine, { ChannelProfile, ClientRole } from 'react-native-agora';

const AGORA_APP_ID = 'd5ca0258481e4285a9a6286cb5215581'; // Set your Agora App ID here

const LiveStreamViewer = () => {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      const engine = await RtcEngine.create(AGORA_APP_ID);
      await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await engine.setClientRole(ClientRole.Audience);

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log(`Joined channel ${channel} successfully as a viewer!`);
        setJoined(true);
      });

      engine.joinChannel(null, 'demoChannel', null, 0);
    };

    init();

    return () => {
      RtcEngine.destroy();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {joined ? <Text>Viewing the stream...</Text> : <Text>Joining the stream...</Text>}
    </View>
  );
};

export default LiveStreamViewer;
