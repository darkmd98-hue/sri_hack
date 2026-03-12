import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const iconMap: Record<string, string> = {
  encrypted: 'lock',
  ios: 'apple',
  shield_person: 'shield',
};

export function stitchIconName(name: string): string {
  return iconMap[name] ?? name.replace(/_/g, '-');
}

export function StitchIcon({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return <MaterialIcons color={color} name={stitchIconName(name)} size={size} />;
}
