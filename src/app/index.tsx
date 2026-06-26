import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function IndexScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour gérer la dépense sélectionnée (pour la Modal)
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  async function fetchExpenses() {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setExpenses(data);
    setLoading(false);
  }

  async function deleteExpense(id: string) {
    Alert.alert(
      "Supprimer",
      "Es-tu sûr de vouloir supprimer cette dépense ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: async () => {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) {
              Alert.alert("Erreur", error.message);
            } else {
              fetchExpenses();
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.empty}>Aucune dépense trouvée.</Text>}
                    renderItem={({ item }) => (
            // On remplace le TouchableOpacity global par une View
            <View style={styles.item}> 
              
              {/* ZONE 1 : Pour ouvrir la Modal (Texte + Image) */}
              <TouchableOpacity 
                style={styles.contentContainer} 
                onPress={() => setSelectedExpense(item)}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.amount}>{item.amount} €</Text>
                </View>

                {item.receipt_url ? (
                  <Image source={{ uri: item.receipt_url }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.noImagePlaceholder}>
                    <Text style={{fontSize: 10, color: '#aaa'}}>Pas de ticket</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* ZONE 2 : Bouton Supprimer isolé */}
              <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
              </TouchableOpacity>

            </View>
          )}

        />
      )}

      {/* FENÊTRE MODAL POUR AFFICHER EN GRAND */}
      <Modal
        visible={selectedExpense !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedExpense(null)} // Pour le bouton retour d'Android
      >
        <View style={styles.modalContainer}>
          {selectedExpense && (
            <>
              <Text style={styles.modalTitle}>{selectedExpense.description}</Text>
              <Text style={styles.modalAmount}>{selectedExpense.amount} €</Text>
              
              {selectedExpense.receipt_url ? (
                <Image source={{ uri: selectedExpense.receipt_url }} style={styles.fullImage} />
              ) : (
                <View style={styles.modalNoImage}>
                  <Text style={{color: '#aaa', fontSize: 16}}>Aucun ticket associé à cette dépense.</Text>
                </View>
              )}

              <View style={styles.closeButtonContainer}>
                <Button title="Fermer" onPress={() => setSelectedExpense(null)} color="#007bff" />
              </View>
            </>
          )}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textContainer: { flex: 1 },
  desc: { fontSize: 16, fontWeight: '500', color: '#000' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#dc3545', marginTop: 4 },
  thumbnail: { width: 50, height: 50, borderRadius: 5, marginLeft: 10 },
  noImagePlaceholder: { width: 50, height: 50, borderRadius: 5, marginLeft: 10, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  deleteButton: { marginLeft: 15, padding: 5 },
  
  // Styles pour la Modal
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalAmount: { fontSize: 22, fontWeight: 'bold', color: '#dc3545', marginBottom: 20 },
  fullImage: { width: '100%', height: 400, resizeMode: 'contain', borderRadius: 10, marginBottom: 30 },
  modalNoImage: { width: '100%', height: 300, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 30 },
  closeButtonContainer: { width: '100%', paddingHorizontal: 50 }
});
