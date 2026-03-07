import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { MatchUser } from '../../models/matchUser';
import { useStoreSelector } from '../../state/store';

function MatchCard({ user }: { user: MatchUser }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name.length > 0 ? user.name[0].toUpperCase() : '?'}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{user.name}</Text>
          {user.verificationStatus === 'verified' ? (
            <Text style={styles.verified}>Verified</Text>
          ) : null}
        </View>
        <Text style={styles.meta}>
          Match {user.matchScore}% - Rating {user.avgRating.toFixed(1)}
        </Text>
        <Text style={styles.skills}>
          {user.skills.length > 0 ? user.skills.join(', ') : 'No matching skills'}
        </Text>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const { matchStore } = useAppServices();
  const loading = useStoreSelector(matchStore, store => store.isLoading);
  const error = useStoreSelector(matchStore, store => store.error);
  const recommended = useStoreSelector(matchStore, store => store.recommended);

  useEffect(() => {
    matchStore.loadRecommended().catch(() => {
      // Store exposes load errors through state.
    });
  }, [matchStore]);

  if (loading && recommended.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0a7a5a" />
      </View>
    );
  }

  if (error !== null && recommended.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (recommended.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No recommendations yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={recommended}
      keyExtractor={item => String(item.id)}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            matchStore.loadRecommended().catch(() => {
              // Store exposes refresh errors through state.
            });
          }}
          refreshing={loading}
          tintColor="#0a7a5a"
        />
      }
      renderItem={({ item }) => <MatchCard user={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#b00020',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: '#38574a',
    fontSize: 15,
    textAlign: 'center',
  },
  listContent: {
    padding: 12,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d8e3db',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a7a5a',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: '#14352b',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  verified: {
    color: '#1c7f3b',
    fontWeight: '700',
    fontSize: 12,
  },
  meta: {
    marginTop: 4,
    color: '#34584b',
    fontSize: 13,
  },
  skills: {
    marginTop: 6,
    color: '#203a32',
    fontSize: 13,
  },
});
