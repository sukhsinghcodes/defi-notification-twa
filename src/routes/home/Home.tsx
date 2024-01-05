import {
  Avatar,
  Container,
  Heading,
  Icon,
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
import { isTwa } from '../../utils';
import { WalletMenu } from './WalletMenu';
import { setTwaBg } from '../../twa-ui-kit/theme';

export function Home() {
  const user = useUser();

  const { data, isLoading } = useProjects({ enabled: user.isAuthenticated });

  useEffect(() => {
    if (user.isAuthenticated) {
      // do something
      if (isTwa) {
        setTwaBg('secondary_bg_color');

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
                console.log('revisit set');
              });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, []);

  return (
    <Container>
      <VStack spacing={8} mb={8} alignItems="stretch">
        <div>
          <Heading as="h1" size="lg">
            {user.isAuthenticated ? `Logged In!` : 'Not Logged In.'}
          </Heading>
          {user.userId && <p>userId: {user.userId}</p>}
        </div>
        <WalletMenu />
        {isLoading ? (
          <Spinner />
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
      </VStack>
    </Container>
  );
}
