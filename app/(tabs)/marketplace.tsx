import { Stack } from 'expo-router';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight,
  Smartphone
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

const SPACING = 12;

export default function MarketplaceScreen() {
  const [balance, setBalance] = useState(0);
  const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false);
  const [isLinkMomoVisible, setIsLinkMomoVisible] = useState(false);
  const [linkedMomo, setLinkedMomo] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [momoNumber, setMomoNumber] = useState('');

  const transactions = [
    { id: '1', type: 'received', amount: 250, from: 'John Doe', date: '2 hours ago' },
    { id: '2', type: 'sent', amount: 100, to: 'Market Purchase', date: 'Yesterday' },
  ];

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      setBalance(prev => prev + value);
      setAmount('');
      setIsAddMoneyVisible(false);
      if (Platform.OS !== 'web') {
        Alert.alert('Success', `GH₵${value.toFixed(2)} added to your wallet`);
      }
    }
  };

  const handleLinkMomo = () => {
    if (momoNumber.length >= 10) {
      setLinkedMomo(momoNumber);
      setMomoNumber('');
      setIsLinkMomoVisible(false);
      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Mobile Money account linked successfully');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Place</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIcon}>
              <Wallet size={24} color="#FFD700" strokeWidth={2} />
            </View>
            <Text style={styles.walletTitle}>My Wallet</Text>
          </View>

          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>GH₵{balance.toFixed(2)}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsAddMoneyVisible(true)}
            >
              <View style={styles.actionIconContainer}>
                <Plus size={20} color="#000" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionButtonText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsLinkMomoVisible(true)}
            >
              <View style={styles.actionIconContainer}>
                <Smartphone size={20} color="#000" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionButtonText}>
                {linkedMomo ? 'Linked' : 'Link Momo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
            >
              <View style={styles.actionIconContainer}>
                <ArrowDownLeft size={20} color="#000" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionButtonText}>Receive</Text>
            </TouchableOpacity>
          </View>

          {linkedMomo && (
            <View style={styles.linkedMomoContainer}>
              <CreditCard size={16} color="#FFD700" />
              <Text style={styles.linkedMomoText}>
                Linked: {linkedMomo.slice(0, 3)}****{linkedMomo.slice(-3)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'received' ? '#0A4D0A' : '#4D0A0A' }
                ]}>
                  {transaction.type === 'received' ? (
                    <ArrowDownLeft size={18} color="#4ADE80" strokeWidth={2.5} />
                  ) : (
                    <ArrowUpRight size={18} color="#F87171" strokeWidth={2.5} />
                  )}
                </View>
                <View>
                  <Text style={styles.transactionTitle}>
                    {transaction.type === 'received' 
                      ? `From ${transaction.from}` 
                      : `To ${transaction.to}`}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'received' ? '#4ADE80' : '#F87171' }
              ]}>
                {transaction.type === 'received' ? '+' : '-'}GH₵{transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isAddMoneyVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddMoneyVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money</Text>
            <Text style={styles.modalSubtitle}>Enter amount to add to your wallet</Text>
            
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddMoneyVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddMoney}
              >
                <Text style={styles.confirmButtonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLinkMomoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLinkMomoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Link Mobile Money</Text>
            <Text style={styles.modalSubtitle}>Enter your mobile money number</Text>
            
            <TextInput
              style={styles.input}
              placeholder="024XXXXXXX"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={momoNumber}
              onChangeText={setMomoNumber}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsLinkMomoVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLinkMomo}
              >
                <Text style={styles.confirmButtonText}>Link Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING,
  },
  walletCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFD700',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600' as const,
  },
  linkedMomoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  linkedMomoText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#000',
  },
});
