import { Stack } from 'expo-router';
import { Camera, Heart, Settings, Video, LogOut, MapPin, Check, Wallet, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, Smartphone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MEDIA_DATA } from '@/constants/media';
import { useAuth, GhanaRegion } from '@/contexts/auth';

const GHANA_REGIONS: GhanaRegion[] = [
  "Ashanti",
  "Brong Ahafo",
  "Central",
  "Eastern",
  "Greater Accra",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Savannah",
  "Bono East",
  "Oti",
  "Ahafo",
  "Western North",
  "North East",
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, isLoading, updateSubscribedRegions } = useAuth();
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<GhanaRegion[]>(user?.subscribedRegions || []);
  const [isSaving, setIsSaving] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false);
  const [isLinkMomoVisible, setIsLinkMomoVisible] = useState(false);
  const [linkedMomo, setLinkedMomo] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  
  const userVideos = MEDIA_DATA.filter((item) => item.type === 'video').length;
  const userPhotos = MEDIA_DATA.filter((item) => item.type === 'image').length;
  const totalMedia = MEDIA_DATA.length;

  const transactions = [
    { id: '1', type: 'received' as const, amount: 250, from: 'John Doe', date: '2 hours ago' },
    { id: '2', type: 'sent' as const, amount: 100, to: 'Market Purchase', date: 'Yesterday' },
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

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const toggleRegion = (region: GhanaRegion) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        return prev.filter(r => r !== region);
      }
      return [...prev, region];
    });
  };

  const handleSaveRegions = async () => {
    setIsSaving(true);
    const result = await updateSubscribedRegions(selectedRegions);
    setIsSaving(false);
    
    if (result.success) {
      setShowRegionModal(false);
      Alert.alert('Success', 'Your subscription preferences have been updated!');
    } else {
      Alert.alert('Error', result.error || 'Failed to update subscription');
    }
  };

  const openRegionModal = () => {
    setSelectedRegions(user?.subscribedRegions || []);
    setShowRegionModal(true);
  };

  const stats = [
    { label: 'Media', value: totalMedia },
    { label: 'Videos', value: userVideos },
    { label: 'Photos', value: userPhotos },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsButton}>
            <Settings size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName[0]}{user.lastName[0]}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet</Text>
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletIconContainer}>
                <Wallet size={24} color="#FFD700" strokeWidth={2} />
              </View>
              <Text style={styles.walletTitle}>My Wallet</Text>
            </View>

            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>GH₵{balance.toFixed(2)}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.walletActionButton}
                onPress={() => setIsAddMoneyVisible(true)}
              >
                <View style={styles.walletActionIconContainer}>
                  <Plus size={20} color="#000" strokeWidth={2.5} />
                </View>
                <Text style={styles.walletActionButtonText}>Add Money</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.walletActionButton}
                onPress={() => setIsLinkMomoVisible(true)}
              >
                <View style={styles.walletActionIconContainer}>
                  <Smartphone size={20} color="#000" strokeWidth={2.5} />
                </View>
                <Text style={styles.walletActionButtonText}>
                  {linkedMomo ? 'Linked' : 'Link Momo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.walletActionButton}
              >
                <View style={styles.walletActionIconContainer}>
                  <ArrowDownLeft size={20} color="#000" strokeWidth={2.5} />
                </View>
                <Text style={styles.walletActionButtonText}>Receive</Text>
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

          {transactions.length > 0 && (
            <View style={styles.transactionsSection}>
              <Text style={styles.transactionsSectionTitle}>Recent Transactions</Text>
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
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <Pressable style={styles.subscriptionCard} onPress={openRegionModal}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <MapPin size={24} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Regional Content</Text>
              <Text style={styles.actionSubtitle}>
                {user?.subscribedRegions.length === 0 
                  ? 'Select regions to customize your content'
                  : `${user?.subscribedRegions.length} region${user?.subscribedRegions.length === 1 ? '' : 's'} selected`
                }
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' }]}>
              <Camera size={24} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Upload Media</Text>
              <Text style={styles.actionSubtitle}>Add photos or videos</Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#E94B3C' }]}>
              <Heart size={24} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Favorites</Text>
              <Text style={styles.actionSubtitle}>Your liked content</Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#F5A623' }]}>
              <Video size={24} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Recently Watched</Text>
              <Text style={styles.actionSubtitle}>Continue watching</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Edit Profile</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Settings</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Storage & Data</Text>
          </Pressable>

          <Pressable style={[styles.menuItem, styles.menuItemLast]} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuText, styles.menuTextDanger]}>Sign Out</Text>
              <LogOut size={20} color="#E94B3C" />
            </View>
          </Pressable>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      <Modal
        visible={showRegionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + 16 }]}>
            <Text style={styles.modalTitle}>Select Regions</Text>
            <TouchableOpacity onPress={() => setShowRegionModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalDescription}>
              Choose the regions you&apos;re interested in to customize content in your gallery, palace, entertainment, and marketplace.
            </Text>

            <View style={styles.regionsGrid}>
              {GHANA_REGIONS.map((region) => {
                const isSelected = selectedRegions.includes(region);
                return (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.regionItem,
                      isSelected && styles.regionItemSelected,
                    ]}
                    onPress={() => toggleRegion(region)}
                  >
                    <Text style={[
                      styles.regionText,
                      isSelected && styles.regionTextSelected,
                    ]}>
                      {region}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Check size={16} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionCount}>
                {selectedRegions.length} region{selectedRegions.length === 1 ? '' : 's'} selected
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaving && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveRegions}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Subscription'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAddMoneyVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddMoneyVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.walletModalContent}>
            <Text style={styles.walletModalTitle}>Add Money</Text>
            <Text style={styles.walletModalSubtitle}>Enter amount to add to your wallet</Text>
            
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.walletModalButtons}>
              <TouchableOpacity 
                style={[styles.walletModalButton, styles.cancelButton]}
                onPress={() => setIsAddMoneyVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.walletModalButton, styles.confirmButton]}
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
          <View style={styles.walletModalContent}>
            <Text style={styles.walletModalTitle}>Link Mobile Money</Text>
            <Text style={styles.walletModalSubtitle}>Enter your mobile money number</Text>
            
            <TextInput
              style={styles.input}
              placeholder="024XXXXXXX"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={momoNumber}
              onChangeText={setMomoNumber}
            />

            <View style={styles.walletModalButtons}>
              <TouchableOpacity 
                style={[styles.walletModalButton, styles.cancelButton]}
                onPress={() => setIsLinkMomoVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.walletModalButton, styles.confirmButton]}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: '#999',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  menuItem: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
  },
  menuTextDanger: {
    color: '#E94B3C',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  version: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  chevron: {
    fontSize: 28,
    color: '#666',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#fff',
  },
  modalClose: {
    fontSize: 32,
    color: '#999',
    fontWeight: '300' as const,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: '#999',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 24,
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  regionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regionItemSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  regionText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500' as const,
  },
  regionTextSelected: {
    fontWeight: '600' as const,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  selectionInfo: {
    marginBottom: 12,
  },
  selectionCount: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#fff',
  },
  walletCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIconContainer: {
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
  walletActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  walletActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletActionButtonText: {
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
  transactionsSection: {
    marginTop: 16,
  },
  transactionsSectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 12,
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
  walletModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  walletModalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  walletModalSubtitle: {
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
  walletModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  walletModalButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
