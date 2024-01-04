import {
  Avatar,
  CircularProgress,
  Container,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { useFirebase, useProjects } from '../firebase';
import { List, ListItem } from '../components';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ConnectButton } from '../web3';

export function Home() {
  const fb = useFirebase();

  const { data, isLoading } = useProjects({ enabled: fb.isAuthenticated });

  return (
    <Container>
      <VStack spacing={8} mb={8} alignItems="stretch">
        <div>
          <Heading as="h1" size="lg">
            {fb.isAuthenticated ? `Logged In!` : 'Not Logged In.'}
          </Heading>
          {fb.userId && <p>userId: {fb.userId}</p>}
        </div>
        {isLoading ? (
          <CircularProgress isIndeterminate thickness="3px" />
        ) : (
          <List mode="display">
            {data?.map((project) => (
              <Link key={project.id} to="#">
                <ListItem
                  StartIconSlot={
                    <Avatar
                      src={project.logo}
                      fontSize={28}
                      bgColor={project.background}
                    />
                  }
                  StartTextSlot={
                    <Heading as="h3" variant="bodyTitle">
                      {project.name}
                    </Heading>
                  }
                  EndIconSlot={<Icon as={IoChevronForward} />}
                />
              </Link>
            ))}
          </List>
        )}
        <ConnectButton />
      </VStack>
    </Container>
  );
}
