import { useFirebase } from '../providers';

export function Home() {
  const fb = useFirebase();

  return (
    <div>
      <h1>{fb.isAuthenticated ? 'Logged In!' : 'Not Logged In.'}</h1>
    </div>
  );
}
