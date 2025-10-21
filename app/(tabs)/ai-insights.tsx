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
          <ThemedText type="subtitle" style={styles.headerTitle}>
            AI vpogled
          </ThemedText>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => setShowMonthModal(true)}
          >
            <IconSymbol name="calendar" size={20} color="#0066CC" />
            <ThemedText style={styles.periodText}>{selectedPeriod}</ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#0066CC" />
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
                    <IconSymbol name="circle" size={20} color="#0066CC" />
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  periodSelector: {
    marginBottom: 24,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066CC',
    marginHorizontal: 8,
  },
  overviewCard: {
    backgroundColor: '#E6F4FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  totalSpent: {
    alignItems: 'center',
  },
  totalSpentLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  totalSpentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginRight: 12,
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 16,
    flex: 1,
  },
  insightDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '80%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedMonthItem: {
    backgroundColor: '#E6F4FE',
  },
  monthText: {
    fontSize: 16,
  },
  selectedMonthText: {
    color: '#0066CC',
    fontWeight: '600',
  },
});
