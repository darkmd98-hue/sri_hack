import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';

function displayValue(value: unknown, fallback = '-'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value);
  return normalized.length > 0 ? normalized : fallback;
}

export function ExploreScreen() {
  const { skillsApi } = useAppServices();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const rows = await skillsApi.searchTeach({ query: query.trim() });
      setResults(rows);
    } catch (searchError) {
      setError(String(searchError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          autoCapitalize="none"
          editable={!loading}
          onChangeText={setQuery}
          placeholder="Search skill or person"
          style={styles.input}
          value={query}
        />
        <Pressable
          disabled={loading}
          onPress={() => {
            search().catch(() => {
              // Screen state handles search errors.
            });
          }}
          style={({ pressed }) => [
            styles.button,
            loading ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </Pressable>
      </View>

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={results}
        keyExtractor={(item, index) => String(item.id ?? `search-${index}`)}
        ListEmptyComponent={
          loading ? null : <Text style={styles.emptyText}>No search results yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {displayValue(item.skill_name, 'Skill')} - {displayValue(item.user_name, 'User')}
            </Text>
            <Text style={styles.resultSubtitle}>
              {displayValue(item.level)} - {displayValue(item.mode)} - Rating{' '}
              {displayValue(item.avg_rating, '0')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#c3d1c6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#17382d',
  },
  button: {
    backgroundColor: '#0a7a5a',
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  errorText: {
    color: '#b00020',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 18,
    gap: 8,
  },
  emptyText: {
    color: '#40665a',
    textAlign: 'center',
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d8e3db',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17382d',
  },
  resultSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#34584b',
  },
});
