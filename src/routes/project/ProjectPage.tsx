import {
  Box,
  Container,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../../firebase';
import { useMemo } from 'react';
import { borderRadius, colors } from '../../twa-ui-kit/theme';
import { BackButton, List, ListItem } from '../../twa-ui-kit';
import { BiPlusCircle } from 'react-icons/bi';
import { MdCircle } from 'react-icons/md';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useProjects({ enabled: !!projectId });

  const project = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.find((project) => project.id === projectId);
  }, [data, projectId]);

  if (isLoading || !project) {
    return <div>Loading...</div>;
  }

  return (
    <VStack alignItems="stretch">
      <BackButton />
      <Box backgroundColor={project.background} pt={8} pb={16}>
        <Container>
          <VStack spacing={4}>
            <Image src={project.logo} width={24} height={24} />
            <Heading as="h1" size="md" color={project.foreground}>
              {project.name}
            </Heading>
          </VStack>
        </Container>
      </Box>
      <Box
        mt="-2rem"
        borderTopRightRadius={borderRadius}
        borderTopLeftRadius={borderRadius}
        backgroundColor={colors.secondary_bg_color}
      >
        <Container>
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
        </Container>
      </Box>
    </VStack>
  );
}
