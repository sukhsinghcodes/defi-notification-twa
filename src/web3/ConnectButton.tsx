import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MainButton } from '../components';
import { Text } from '@chakra-ui/react';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <>
        <Text>{address}</Text>
        <MainButton onClick={disconnect} text="Disconnect" />
      </>
    );
  }

  return <MainButton onClick={connect} text="Connect" />;
}
