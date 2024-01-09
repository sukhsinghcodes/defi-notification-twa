import { Box, Container, Heading, Image, VStack } from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';
import { useProjects } from '../../firebase';
import { useEffect, useMemo } from 'react';
import { borderRadius, colors } from '../../twa-ui-kit/theme';
import { BackButton } from '../../twa-ui-kit';
import { useTheme } from '../../ThemeProvider';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useProjects({ enabled: !!projectId });
  const { setHeaderColor } = useTheme();

  const project = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.find((project) => project.id === projectId);
  }, [data, projectId]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const color = project.background[0].startsWith('#')
      ? project.background[0].substring(1)
      : project.background[0];

    setHeaderColor(`#${color}`);

    return () => {
      setHeaderColor('secondary_bg_color');
    };
  }, [setHeaderColor, project]);

  if (isLoading || !project) {
    return <div>Loading...</div>;
  }

  return (
    <VStack alignItems="stretch">
      <BackButton />
      <Box backgroundColor={project.background[0]} pt={8} pb={16}>
        <Container>
          <VStack spacing={4}>
            <Box borderRadius="full" overflow="hidden">
              <Image
                src={project.logo}
                width={20}
                height={20}
                p={3}
                alt={project.name}
                backgroundColor={project.background[0]}
              />
            </Box>
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
          <Outlet context={{ project }} />
        </Container>
      </Box>
    </VStack>
  );
}
