import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'toggle' | 'action';
  icon: string;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'profile',
      title: 'Profil',
      subtitle: 'Osebni podatki in nastavitve',
      type: 'navigation',
      icon: 'person.circle',
    },
    {
      id: 'security',
      title: 'Varnost',
      subtitle: 'PIN, biometrija, dvofaktorska avtentikacija',
      type: 'navigation',
      icon: 'lock.shield',
    },
    {
      id: 'notifications',
      title: 'Obvestila',
      subtitle: 'Push obvestila in email',
      type: 'navigation',
      icon: 'bell',
    },
    {
      id: 'biometric',
      title: 'Biometrična avtentikacija',
      subtitle: 'Odstiski prstov in Face ID',
      type: 'toggle',
      icon: 'touchid',
      value: true,
    },
    {
      id: 'push_notifications',
      title: 'Push obvestila',
      subtitle: 'Prejmi obvestila o transakcijah',
      type: 'toggle',
      icon: 'bell.badge',
      value: true,
    },
    {
      id: 'language',
      title: 'Jezik',
      subtitle: 'Slovenščina',
      type: 'navigation',
      icon: 'globe',
    },
    {
      id: 'currency',
      title: 'Valuta',
      subtitle: 'EUR',
      type: 'navigation',
      icon: 'eurosign.circle',
    },
    {
      id: 'payment_limits',
      title: 'Omejitve plačil',
      subtitle: 'Nastavi maksimalne zneske',
      type: 'navigation',
      icon: 'creditcard',
    },
    {
      id: 'privacy',
      title: 'Zasebnost',
      subtitle: 'Zbiranje in uporaba podatkov',
      type: 'navigation',
      icon: 'hand.raised',
    },
    {
      id: 'help',
      title: 'Pomoč in podpora',
      subtitle: 'FAQ, kontakt, navodila',
      type: 'navigation',
      icon: 'questionmark.circle',
    },
    {
      id: 'about',
      title: 'O aplikaciji',
      subtitle: 'Verzija 2.0.1',
      type: 'navigation',
      icon: 'info.circle',
    },
    {
      id: 'logout',
      title: 'Odjava',
      subtitle: 'Varno zapusti aplikacijo',
      type: 'action',
      icon: 'rectangle.portrait.and.arrow.right',
    },
  ]);

  const handleToggle = (id: string, value: boolean) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  const handlePress = (id: string) => {
    if (id === 'logout') {
      // Handle logout
      console.log('Logout pressed');
    } else {
      // Handle navigation
      console.log(`Navigate to ${id}`);
    }
  };

  const renderSettingItem = (setting: SettingItem) => (
    <TouchableOpacity
      key={setting.id}
      style={[
        styles.settingItem,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
        setting.id === 'logout' && styles.logoutItem,
      ]}
      onPress={() => handlePress(setting.id)}
      disabled={setting.type === 'toggle'}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <IconSymbol
            name={setting.icon}
            size={24}
            color={setting.id === 'logout' ? Colors[colorScheme ?? 'light'].error : Colors[colorScheme ?? 'light'].primary}
          />
        </View>
        <View style={styles.settingInfo}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.settingTitle,
              setting.id === 'logout' && { color: Colors[colorScheme ?? 'light'].error },
            ]}
          >
            {setting.title}
          </ThemedText>
          {setting.subtitle && (
            <ThemedText style={styles.settingSubtitle}>
              {setting.subtitle}
            </ThemedText>
          )}
        </View>
        <View style={styles.settingAction}>
          {setting.type === 'toggle' ? (
            <Switch
              value={setting.value}
              onValueChange={(value) => handleToggle(setting.id, value)}
              trackColor={{ false: '#767577', true: Colors[colorScheme ?? 'light'].primary }}
              thumbColor={setting.value ? '#f4f3f4' : '#f4f3f4'}
            />
          ) : (
            <IconSymbol
              name="chevron.right"
              size={16}
              color={Colors[colorScheme ?? 'light'].icon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Nastavitve
          </ThemedText>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <IconSymbol name="person.fill" size={32} color="white" />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="subtitle" style={styles.profileName}>
                Janez Novak
              </ThemedText>
              <ThemedText style={styles.profileEmail}>
                janez.novak@email.com
              </ThemedText>
              <ThemedText style={styles.profileBank}>
                UniCredit Banka Slovenija
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Račun
          </ThemedText>
          {settings.slice(0, 3).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Varnost in zasebnost
          </ThemedText>
          {settings.slice(3, 6).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Splošno
          </ThemedText>
          {settings.slice(6, 9).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Podpora
          </ThemedText>
          {settings.slice(9, 11).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          {renderSettingItem(settings[11])}
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            FLIK Pay v2.0.1
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2024 UniCredit Banka Slovenija d.d.
          </ThemedText>
        </View>
      </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  profileBank: {
    fontSize: 12,
    opacity: 0.6,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
  },
  settingItem: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutItem: {
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.2)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingAction: {
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
});
