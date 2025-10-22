import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { GroupMember, MOCK_MEMBERS, useGroups } from '@/contexts/GroupsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AddGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const GROUP_COLORS = [
  '#FF9AA2', // Stronger pink
  '#A8E6CF', // Stronger mint
  '#88D8F0', // Stronger blue
  '#FFEAA7', // Stronger yellow
  '#FFB347', // Stronger peach
];

export default function AddGroupModal({ visible, onClose }: AddGroupModalProps) {
  const colorScheme = useColorScheme();
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([MOCK_MEMBERS[0]]); // You are selected by default
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0]);
  const [memberSearchText, setMemberSearchText] = useState('');
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  // Filter members based on search text (first name or last name)
  const getFilteredMembers = () => {
    if (!memberSearchText.trim()) {
      return MOCK_MEMBERS.filter(member => !selectedMembers.some(m => m.id === member.id));
    }
    
    const searchLower = memberSearchText.toLowerCase();
    return MOCK_MEMBERS.filter(member => {
      const isAlreadySelected = selectedMembers.some(m => m.id === member.id);
      if (isAlreadySelected) return false;
      
      const nameParts = member.name.toLowerCase().split(' ');
      return nameParts.some(part => part.startsWith(searchLower));
    });
  };

  const handleMemberToggle = (member: GroupMember) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Napaka', 'Prosimo, vnesite ime skupine.');
      return;
    }

    if (selectedMembers.length < 2) {
      Alert.alert('Napaka', 'Skupina mora imeti vsaj 2 člana.');
      return;
    }

    const budgetAmount = budget ? parseFloat(budget) : 0;
    if (budget && (isNaN(budgetAmount) || budgetAmount < 0)) {
      Alert.alert('Napaka', 'Proračun mora biti veljavno nenegativno število.');
      return;
    }

    addGroup({
      name: groupName.trim(),
      members: selectedMembers,
      budget: budgetAmount,
      currency: 'EUR',
      color: selectedColor,
      ownerId: selectedMembers[0]?.id ?? '1',
    });

    // Reset form
    setGroupName('');
    setBudget('');
    setSelectedMembers([MOCK_MEMBERS[0]]); // Reset to just you
    setSelectedColor(GROUP_COLORS[0]);
    setMemberSearchText('');
    setShowAllMembers(false);
    setMemberToRemove(null);
    
    Alert.alert('Uspeh', 'Skupina je bila uspešno ustvarjena!');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setGroupName('');
    setBudget('');
    setSelectedMembers([MOCK_MEMBERS[0]]); // Reset to just you
    setSelectedColor(GROUP_COLORS[0]);
    setMemberSearchText('');
    setShowAllMembers(false);
    setMemberToRemove(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <IconSymbol name="creditcard.fill" size={24} color="white" />
              </View>
              <ThemedText type="title" style={styles.headerTitle}>
                Nova skupina
              </ThemedText>
            </View>
            <ThemedText style={styles.headerSubtitle}>
              Ustvarite novo skupino za deljenje stroškov
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <ThemedText style={styles.cancelButtonText}>Prekliči</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateGroup} style={styles.createButton}>
              <ThemedText style={styles.createButtonText}>Ustvari</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Group Name */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Ime skupine</ThemedText>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Vnesite ime skupine..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            />
          </View>

          {/* Budget */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Proračun (opcijsko)</ThemedText>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
              value={budget}
              onChangeText={setBudget}
              placeholder="Vnesite proračun..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              keyboardType="numeric"
            />
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Barva skupine</ThemedText>
            <View style={styles.colorGrid}>
              {GROUP_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <IconSymbol name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Member Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Člani skupine ({selectedMembers.length})
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Izberite vsaj 2 člana za skupino
            </ThemedText>
            
            {/* Selected Members Display */}
            <View style={styles.selectedMembersContainer}>
              {selectedMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.selectedMemberChip,
                    memberToRemove === member.id && styles.selectedMemberChipRemove
                  ]}
                  onPress={() => {
                    if (memberToRemove === member.id) {
                      // Remove the member
                      handleMemberToggle(member);
                      setMemberToRemove(null);
                    } else {
                      // Show remove state
                      setMemberToRemove(member.id);
                    }
                  }}
                  onLongPress={() => {
                    // Long press to remove immediately
                    handleMemberToggle(member);
                    setMemberToRemove(null);
                  }}
                >
                  <View style={[styles.memberAvatar, { backgroundColor: selectedColor }]}>
                    <ThemedText style={styles.memberInitial}>
                      {member.name.charAt(0)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.memberChipName}>{member.name}</ThemedText>
                  {memberToRemove === member.id && (
                    <View style={styles.removeIconContainer}>
                      <IconSymbol name="xmark.circle.fill" size={18} color="#FF3B30" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Search Bar */}
            <TouchableOpacity 
              style={styles.searchContainer}
              onPress={() => {
                setShowAllMembers(!showAllMembers);
              }}
            >
              <IconSymbol name="magnifyingglass" size={18} color={Colors[colorScheme ?? 'light'].icon} />
              <TextInput
                style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
                value={memberSearchText}
                onChangeText={(text) => {
                  setMemberSearchText(text);
                  setShowAllMembers(true);
                }}
                placeholder="Išči in dodaj člane..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                onFocus={() => {
                  setShowAllMembers(true);
                }}
              />
              {memberSearchText.length > 0 ? (
                <TouchableOpacity onPress={() => {
                  setMemberSearchText('');
                  setShowAllMembers(true);
                }}>
                  <IconSymbol name="xmark.circle.fill" size={18} color={Colors[colorScheme ?? 'light'].icon} />
                </TouchableOpacity>
              ) : (
                <IconSymbol 
                  name="chevron.down" 
                  size={16} 
                  color={Colors[colorScheme ?? 'light'].icon} 
                />
              )}
            </TouchableOpacity>

            {/* Search Results */}
            {showAllMembers && (
              <View style={styles.searchResults}>
                {getFilteredMembers().length > 0 ? (
                  getFilteredMembers().map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      style={styles.memberResultOption}
                      onPress={() => {
                        handleMemberToggle(member);
                        setMemberSearchText('');
                        setShowAllMembers(false);
                      }}
                    >
                      <View style={[styles.memberAvatar, { backgroundColor: selectedColor }]}>
                        <ThemedText style={styles.memberInitial}>
                          {member.name.charAt(0)}
                        </ThemedText>
                      </View>
                      <View style={styles.memberDetails}>
                        <ThemedText type="defaultSemiBold" style={styles.memberName}>
                          {member.name}
                        </ThemedText>
                        <ThemedText style={styles.memberPhone}>
                          {member.phone}
                        </ThemedText>
                      </View>
                      <IconSymbol name="plus.circle.fill" size={20} color={Colors[colorScheme ?? 'light'].primary} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <ThemedText style={styles.noResultsText}>
                      Ni rezultatov za iskanje
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  createButtonText: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  selectedMember: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 102, 204, 0.3)',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  selectedMembersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectedMemberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 102, 204, 0.3)',
  },
  selectedMemberChipRemove: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  memberChipName: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 4,
  },
  removeIconContainer: {
    marginLeft: 4,
  },
  searchResults: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  memberResultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
