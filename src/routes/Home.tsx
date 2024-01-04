import {
  Avatar,
  CircularProgress,
  Container,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { useProjects } from '../firebase';
import { List, ListItem } from '../components';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ConnectButton } from '../web3';
import { useUser } from '../user';

export function Home() {
  const user = useUser();

  const { data, isLoading } = useProjects({ enabled: user.isAuthenticated });

  return (
    <Container>
      <VStack spacing={8} mb={8} alignItems="stretch">
        <div>
          <Heading as="h1" size="lg">
            {user.isAuthenticated ? `Logged In!` : 'Not Logged In.'}
          </Heading>
          {user.userId && <p>userId: {user.userId}</p>}
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
