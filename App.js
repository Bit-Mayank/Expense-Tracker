import Navigator from './src/navigation/Navigator';
import { UserPreferences } from './src/context/UserPreferences';

export default function App() {
  return (
    <UserPreferences>
      <Navigator />
    </UserPreferences>
  );
}