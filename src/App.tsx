import type {PropsWithChildren} from 'react';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {makeRequest, NetworkRequestType} from './lib/networking';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Example 1: Simple Get Request
    makeRequest('https://dummyjson.com/products/1', {
      type: NetworkRequestType.GET,
      headers: {'Content-Type': 'application/json'},
    })
      .then(data => {
        console.log('(1) Response: ', data);
      })
      .catch(err => {
        console.log('(1) Native Error: ', err);
      });

    // Example 2: Protected Get Request
    makeRequest('https://dummyjson.com/auth/product/1', {
      type: NetworkRequestType.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZyIsImlhdCI6MTY5NzE2MTU2MCwiZXhwIjoxNjk3MTY1MTYwfQ.77DXyiL2HQqOzGOBya2r_lAYpTrfHDarc_jj5Njo5mI',
      },
    })
      .then(data => {
        console.log('(2) Response: ', data);
      })
      .catch(err => {
        console.log('(2) Native Error: ', err);
      });

    // Example 3: Errored Get Request
    makeRequest('https://dummyjson.com/http/404/Hello_Peter', {
      type: NetworkRequestType.GET,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        console.log('(3) Response: ', data);
      })
      .catch(err => {
        console.log('(3) Native Err: ', err);
      });

    // Example 4: Post Request
    makeRequest('https://dummyjson.com/auth/login', {
      type: NetworkRequestType.POST,
      body: {
        username: 'kminchelle',
        password: '0lelplR',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        console.log('(4) Response: ', data);
      })
      .catch(err => {
        console.log('(4) Native Err: ', err);
      });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
