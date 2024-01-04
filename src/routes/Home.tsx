import { Container, Heading } from '@chakra-ui/react';
import { useFirebase } from '../providers';

export function Home() {
  const fb = useFirebase();

  return (
    <Container>
      <Heading as="h1" size="lg">
        {fb.isAuthenticated ? 'Logged In!' : 'Not Logged In.'}
      </Heading>
    </Container>
  );
}
