// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.3.fill': 'group',
  'brain.head.profile': 'psychology',
  'creditcard.fill': 'credit-card',
  'gearshape.fill': 'settings',
  'arrow.up.right': 'arrow-upward',
  'arrow.down.left': 'arrow-downward',
  'plus': 'add',
  'creditcard': 'credit-card',
  'calendar': 'calendar-today',
  'chevron.down': 'keyboard-arrow-down',
  'chart.bar.fill': 'bar-chart',
  'fork.knife': 'restaurant',
  'tram.fill': 'tram',
  'bag.fill': 'shopping-bag',
  'lock.shield': 'security',
  'eye': 'visibility',
  'minus': 'remove',
  'circle': 'circle',
  'checkmark.circle': 'check-circle',
  'person.circle': 'account-circle',
  'bell': 'notifications',
  'touchid': 'fingerprint',
  'bell.badge': 'notifications-active',
  'globe': 'language',
  'eurosign.circle': 'euro',
  'hand.raised': 'pan-tool',
  'questionmark.circle': 'help',
  'info.circle': 'info',
  'rectangle.portrait.and.arrow.right': 'logout',
  'person.fill': 'person',
  'envelope': 'email',
  'moon.fill': 'dark-mode',
  'square.and.arrow.down': 'download',
  'text.bubble': 'feedback',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
