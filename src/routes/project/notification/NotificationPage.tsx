import { Box, Heading, Spinner, Text, VStack, Image } from '@chakra-ui/react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Project } from '../../../firebase/types';
import { useMemo } from 'react';
import { DataDisplayItem } from '../../../twa-ui-kit';

export function NotificationPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const { notificationId } = useParams<{ notificationId: string }>();

  const notification = useMemo(() => {
    if (!project) {
      return null;
    }

    return project.notificationDefinitions.find(
      (noti) => noti.notificationId === notificationId
    );
  }, [project, notificationId]);

  console.log(notification);

  if (!notification) {
    return (
      <VStack justifyContent="center" alignItems="center">
        <Spinner />
      </VStack>
    );
  }

  return (
    <VStack spacing={4} mb={8} pt={8} alignItems="stretch">
      <DataDisplayItem
        StartTextSlot={
          <Box>
            <Heading as="h1" size="md">
              {notification?.displayName}
            </Heading>
            <Text>{notification?.description}</Text>
          </Box>
        }
        EndIconSlot={
          <Image
            src={`/networks/${
              notification.network ? notification.network : project.network
            }.png`}
            minW={10}
            width={10}
            height={10}
            fallbackSrc="/networks/generic.png"
          />
        }
      />
    </VStack>
  );
}
