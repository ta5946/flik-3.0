import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AIInsightsScreen() {
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState('november 2024');
  const [showMonthModal, setShowMonthModal] = useState(false);

  const availableMonths = [
    'january 2024',
    'february 2024', 
    'march 2024',
    'april 2024',
    'may 2024',
    'june 2024',
    'july 2024',
    'august 2024',
    'september 2024',
    'october 2024',
    'november 2024',
    'december 2024',
  ];

  const monthlySummary = {
    totalSpent: 1247.50,
    categories: [
      { name: 'Hrana in pijača', amount: 456.30, percentage: 37, trend: 'up' },
      { name: 'Transport', amount: 234.80, percentage: 19, trend: 'down' },
      { name: 'Nakupovanje', amount: 198.40, percentage: 16, trend: 'up' },
      { name: 'Zabava', amount: 156.20, percentage: 13, trend: 'stable' },
      { name: 'Drugo', amount: 201.80, percentage: 15, trend: 'down' },
    ],
    insights: [
      {
        type: 'saving',
        title: 'Prihranite na hrani',
        description: 'Vaši izdatki za hrano so se povečali za 12% glede na prejšnji mesec. Razmislite o pripravljanju kosila doma.',
        icon: 'fork.knife',
        color: '#28A745',
      },
      {
        type: 'trend',
        title: 'Pozitivna sprememba',
        description: 'Vaši transportni stroški so se zmanjšali za 8%. Nadaljujte z uporabo javnega prevoza.',
        icon: 'tram.fill',
        color: '#0066CC',
      },
      {
        type: 'alert',
        title: 'Pozor na nakupovanje',
        description: 'Vaši izdatki za nakupovanje so se povečali za 15%. Razmislite o nastavitvi mesečnega proračuna.',
        icon: 'bag.fill',
        color: '#FFC107',
      },
    ],
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} EUR`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'arrow.up.right';
      case 'down':
        return 'arrow.down.right';
      case 'stable':
        return 'minus';
      default:
        return 'circle';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#DC3545';
      case 'down':
        return '#28A745';
      case 'stable':
        return '#6C757D';
      default:
        return '#6C757D';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoIcon}>
                <IconSymbol name="creditcard.fill" size={24} color="white" />
              </View>
              <ThemedText type="title" style={styles.headerTitle}>
                AI vpogled
              </ThemedText>
            </View>
            <ThemedText style={styles.headerSubtitle}>
              Pametna analiza vaših financ
            </ThemedText>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => setShowMonthModal(true)}
          >
            <IconSymbol name="calendar" size={20} color="#1e40af" />
            <ThemedText style={styles.periodText}>{selectedPeriod}</ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#1e40af" />
          </TouchableOpacity>
        </View>

        {/* Monthly Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.totalSpent}>
            <ThemedText style={styles.totalSpentLabel}>Skupaj porabljeno</ThemedText>
            <ThemedText type="title" style={styles.totalSpentAmount}>
              {formatAmount(monthlySummary.totalSpent)}
            </ThemedText>
          </View>
        </View>

        {/* Spending Categories */}
        <View style={styles.categoriesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Kategorije stroškov
          </ThemedText>
          {monthlySummary.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <ThemedText type="defaultSemiBold" style={styles.categoryName}>
                  {category.name}
                </ThemedText>
                <ThemedText style={styles.categoryAmount}>
                  {formatAmount(category.amount)}
                </ThemedText>
              </View>
              <View style={styles.categoryDetails}>
                <View style={styles.categoryBar}>
                  <View 
                    style={[
                      styles.categoryProgress, 
                      { 
                        width: `${category.percentage}%`,
                        backgroundColor: Colors[colorScheme ?? 'light'].primary,
                      }
                    ]} 
                  />
                </View>
                <View style={styles.categoryStats}>
                  <ThemedText style={styles.categoryPercentage}>
                    {category.percentage}%
                  </ThemedText>
                  <IconSymbol 
                    name={getTrendIcon(category.trend)} 
                    size={16} 
                    color={getTrendColor(category.trend)} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.insightsSection}>
           <ThemedText type="subtitle" style={styles.sectionTitle}>
             AI nasveti (novo)
           </ThemedText>
          {monthlySummary.insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                  <IconSymbol name={insight.icon} size={20} color={insight.color} />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.insightTitle}>
                  {insight.title}
                </ThemedText>
              </View>
              <ThemedText style={styles.insightDescription}>
                {insight.description}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Izberi mesec
              </ThemedText>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMonthModal(false)}
              >
                <IconSymbol name="chevron.down" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.monthList}>
              {availableMonths.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthItem,
                    selectedPeriod === month && styles.selectedMonthItem
                  ]}
                  onPress={() => {
                    setSelectedPeriod(month);
                    setShowMonthModal(false);
                  }}
                >
                  <ThemedText 
                    style={[
                      styles.monthText,
                      selectedPeriod === month && styles.selectedMonthText
                    ]}
                  >
                    {month}
                  </ThemedText>
                  {selectedPeriod === month && (
                    <IconSymbol name="circle" size={20} color="#1e40af" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  periodSelector: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginHorizontal: 12,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  totalSpent: {
    alignItems: 'center',
  },
  totalSpentLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },
  totalSpentAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    letterSpacing: -1,
  },
  categoriesSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  categoryItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  categoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginRight: 16,
  },
  categoryProgress: {
    height: 8,
    borderRadius: 4,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: '#1e40af',
  },
  insightsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: '#1e293b',
  },
  insightDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '85%',
    maxHeight: '70%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  monthList: {
    maxHeight: 300,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedMonthItem: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  selectedMonthText: {
    color: '#1e40af',
    fontWeight: '700',
  },
});
