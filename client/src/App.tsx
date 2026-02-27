import { useGoogleAuth } from './hooks/useGoogleAuth';
import { AppRouter } from './router/AppRouter';

function App() {
  const AuthListener: React.FC = () => {
    useGoogleAuth();
    return null;
  };
  return (
    <>
      <AuthListener />
      <AppRouter></AppRouter>
    </>
  );
}

export default App;
