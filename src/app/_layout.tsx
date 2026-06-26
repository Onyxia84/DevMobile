import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AppLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) Alert.alert("Erreur", error.message);
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) Alert.alert("Erreur", error.message);
    else Alert.alert("Succès", "Compte créé et connecté !");
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue !</Text>
        
        {/* Ajout des labels ici */}
        <Text style={styles.label}>Adresse Email</Text>
        <TextInput style={styles.input} placeholder="Ex: jean@mail.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
        
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput style={styles.input} placeholder="Ton mot de passe secret" value={password} onChangeText={setPassword} secureTextEntry />
        
        <View style={styles.buttonGroup}>
          <Button title="Se connecter" onPress={signIn} color="#28a745" />
        </View>
        <View style={styles.buttonGroup}>
          <Button title="Créer un compte" onPress={signUp} color="#007bff" />
        </View>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#28a745' }}>
      <Tabs.Screen name="index" options={{ title: 'Mes Dépenses', tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} />
      <Tabs.Screen name="add" options={{ title: 'Ajouter', tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#000' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' }, // Style du label
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8, backgroundColor: '#f9f9f9' },
  buttonGroup: { marginBottom: 15 }
});
