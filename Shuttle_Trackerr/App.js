import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, Text, SegmentedButtons, Card, Chip, Menu, IconButton } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();

function TrackerScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [shuttles, setShuttles] = useState([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('list');
  const [screen, setScreen] = useState('landing');
  const [region, setRegion] = useState({
    latitude: 17.4462,
    longitude: 78.3497,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadShuttles() {
      try {
        const res = await fetch('http://localhost:4000/api/shuttles', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isActive) setShuttles(data.shuttles || []);
      } catch (e) {
        if (isActive) setError(String(e.message || e));
      }
    }

    loadShuttles();
    const id = setInterval(loadShuttles, 3000);
    return () => {
      isActive = false;
      controller.abort();
      clearInterval(id);
    };
  }, []);

  //we ask the permission to the user to access the location.
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      } catch { }
    })();
  }, []);

  const handleSignOut = async () => {
    setMenuVisible(false);
    await signOut();
  };

  return (
    <View style={styles.container}>
      {screen === 'landing' ? (
        <View style={styles.landingWrap}>
          <Text variant="headlineMedium" style={styles.brand}>Smart Shuttle Tracker</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Real-time campus shuttle locations, ETAs, and routes</Text>
          {user && (
            <Text variant="bodyMedium" style={styles.welcomeText}>Welcome, {user.name}!</Text>
          )}
          <Button mode="contained" onPress={() => setScreen('tracker')}>Open Tracker</Button>
        </View>
      ) : (
        <>
          <Appbar.Header>
            <Appbar.Content title="Smart Shuttle Tracker" />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="account-circle"
                  size={24}
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                leadingIcon="account"
                title={user?.name || 'User'}
                disabled
              />
              <Menu.Item
                leadingIcon="email"
                title={user?.email || ''}
                disabled
              />
              <Menu.Item
                leadingIcon="logout"
                onPress={handleSignOut}
                title="Sign Out"
              />
            </Menu>
          </Appbar.Header>
          <View style={styles.controlsRow}>
            <SegmentedButtons
              value={mode}
              onValueChange={setMode}
              buttons={[
                { value: 'list', label: 'List' },
                { value: 'map', label: 'Map' },
              ]}
            />
            {error ? <Chip mode="flat" selected color="red">{`Error: ${error}`}</Chip> : null}
          </View>
          {mode === 'list' ? (
            <FlatList
              data={shuttles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Title title={item.name} subtitle={`Route: ${item.routeId}`} />
                  <Card.Content>
                    <Text>Lat: {item.latitude?.toFixed(5)} Lng: {item.longitude?.toFixed(5)}</Text>
                    <Text>Speed: {item.speedKph} km/h</Text>
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={<Text>No shuttles yet</Text>}
              contentContainerStyle={styles.list}
            />
          ) : (
            <MapView style={styles.map} initialRegion={region} onRegionChangeComplete={setRegion}>
              {shuttles.map((s) => (
                <Marker
                  key={s.id}
                  coordinate={{ latitude: s.latitude, longitude: s.longitude }}
                  title={s.name}
                  description={`Route: ${s.routeId} | ${s.speedKph} km/h`}
                />
              ))}
            </MapView>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn">
        {(props) => {
          const { signIn } = useAuth();
          return <SignInScreen {...props} onSignIn={signIn} />;
        }}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => {
          const { signUp } = useAuth();
          return <SignUpScreen {...props} onSignUp={signUp} />;
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tracker" component={TrackerScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  landingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  segmentBtnActive: {
    backgroundColor: '#111',
  },
  segmentText: {
    color: '#111',
  },
  segmentTextActive: {
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  list: {
    gap: 10,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  card: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
});
