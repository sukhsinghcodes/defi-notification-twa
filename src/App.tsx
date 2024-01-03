import { Home } from './pages/Home';
import { FirebaseProvider } from './providers';

function App() {
  return (
    <FirebaseProvider>
      <div>
        <Home />
      </div>
    </FirebaseProvider>
  );
}

export default App;
