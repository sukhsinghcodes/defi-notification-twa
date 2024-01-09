import {
  Container,
  HStack,
  Heading,
  Icon,
  Image,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useProjects } from '../../firebase';
import { List, ListItem } from '../../twa-ui-kit';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { StorageKeys, useUser } from '../../user';
import { useEffect } from 'react';
import Twa from '@twa-dev/sdk';
import { WalletMenu } from './WalletMenu';

export function HomePage() {
  const user = useUser();

  const { data, isLoading } = useProjects({ enabled: user.isAuthenticated });

  useEffect(() => {
    if (user.isAuthenticated) {
      try {
        Twa.CloudStorage.getItem(StorageKeys.REVISIT, (err, revisit) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!revisit) {
            Twa.CloudStorage.setItem(StorageKeys.REVISIT, '1', (err) => {
              if (err) {
                console.log(err);
                return;
              }
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [user.isAuthenticated]);

  if (user.isSigningIn) {
    return (
      <Container>
        <VStack
          justifyContent={'center'}
          alignItems={'center'}
          height={'100vh'}
        >
          <Spinner />
        </VStack>
      </Container>
    );
  }

  return (
    <Container>
      <VStack spacing={8} mb={8} pt={8} alignItems="stretch">
        <WalletMenu />
        {isLoading ? (
          <HStack justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </HStack>
        ) : (
          <List mode="display">
            {data?.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <ListItem
                  StartIconSlot={
                    <Image src={project.logo} width={10} height={10} />
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
      </VStack>
    </Container>
  );
}
