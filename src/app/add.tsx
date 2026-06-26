import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AddScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState<string | null>(null); // Nouvel état pour l'image
  const router = useRouter();

  // Fonction pour ouvrir la galerie
    // 1. Fonction pour afficher le menu de choix
  function selectImageSource() {
    Alert.alert(
      "Ticket de caisse",
      "Comment souhaites-tu ajouter ton ticket ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Prendre une photo", onPress: takePhoto },
        { text: "Choisir dans la galerie", onPress: pickImage }
      ]
    );
  }

  // 2. Fonction pour ouvrir l'appareil photo
  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Désolé', 'Nous avons besoin de la permission pour accéder à la caméra !');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.2, // <-- On baisse à 0.2 pour éviter le Timeout !
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  // 3. Fonction pour ouvrir la galerie
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Désolé', 'Nous avons besoin de la permission pour accéder à tes photos !');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.2, // <-- Pareil ici
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }


    async function addExpense() {
    if (!description || !amount) {
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    Alert.alert("Patientez", "Enregistrement en cours...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      let receipt_url = null;

      // 1. Si on a une image, on l'envoie sur Supabase Storage
            // 1. Si on a une image, on l'envoie sur Supabase Storage (MÉTHODE CORRIGÉE)
      if (image) {
        // On lit l'image au format base64
        const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        
        // On crée un nom de fichier unique avec la date
        const fileName = `ticket-${Date.now()}.jpg`;

        // On envoie le fichier décodé à Supabase
        const { data, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, decode(base64), { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        // On récupère le lien public de l'image
        const { data: publicUrlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);

        receipt_url = publicUrlData.publicUrl;
      }


      // 2. On sauvegarde la dépense dans la base de données (avec ou sans image)
      const { error } = await supabase.from('expenses').insert({
        description,
        amount: parseFloat(amount),
        user_id: session?.user.id,
        receipt_url: receipt_url // La nouvelle colonne !
      });

      if (error) throw error;

      Alert.alert("Succès", "Dépense ajoutée avec l'image !");
      setDescription('');
      setAmount('');
      setImage(null);
      router.push('/');

    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  }


    return (
    <View style={styles.container}>
      <Text style={styles.label}>Description de la dépense</Text>
      <TextInput style={styles.input} placeholder="Ex: Restaurant, Train..." value={description} onChangeText={setDescription} />
      
      <Text style={styles.label}>Montant (€)</Text>
      <TextInput style={styles.input} placeholder="Ex: 25.50" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      
            <TouchableOpacity style={styles.imageButton} onPress={selectImageSource}>
        <Text style={styles.imageButtonText}>
          {image ? 'Changer le ticket de caisse' : '📸 Ajouter un ticket'}
        </Text>
      </TouchableOpacity>


      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Ajouter la dépense" onPress={addExpense} color="#28a745" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' }, // Le label
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8, backgroundColor: '#f9f9f9' },
  imageButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  imageButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  imagePreview: { width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover', marginBottom: 15 }
});
