import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <Text style={styles.subtitle}>Tu es connecté.</Text>
      <View style={styles.button}>
        <Button title="Se déconnecter" onPress={signOut} color="#dc3545" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
  button: { width: '100%' }
});
