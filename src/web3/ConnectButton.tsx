import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MainButton } from '../twa-ui-kit';
import { Box, Text } from '@chakra-ui/react';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Box>
        <Text>{address}</Text>
        <MainButton onClick={disconnect} text="Disconnect" />
      </Box>
    );
  }

  return <MainButton onClick={connect} text="Connect" />;
}
