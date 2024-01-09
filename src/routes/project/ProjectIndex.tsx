import { VStack, Heading, Icon, Box, Image } from '@chakra-ui/react';
import { BiPlusCircle } from 'react-icons/bi';
import { Link, useOutletContext } from 'react-router-dom';
import { List, ListItem } from '../../twa-ui-kit';
import { Project } from '../../firebase/types';

export function ProjectIndex() {
  const { project } = useOutletContext<{ project: Project }>();

  return (
    <VStack spacing={4} py={8} alignItems="stretch">
      <List mode="display">
        {project.notificationDefinitions.map((noti) => (
          <Link
            key={noti.notificationId}
            to={`notification/${noti.notificationId}`}
          >
            <ListItem
              StartIconSlot={
                <Image
                  src={`/networks/${
                    noti.network ? noti.network : project.network
                  }.png`}
                  width={10}
                  height={10}
                  fallbackSrc="/networks/generic.png"
                />
              }
              StartTextSlot={
                <Box>
                  <Heading as="h3" variant="bodyTitle">
                    {noti.displayName}
                  </Heading>
                </Box>
              }
              EndIconSlot={<Icon as={BiPlusCircle} />}
            />
          </Link>
        ))}
      </List>
    </VStack>
  );
}
