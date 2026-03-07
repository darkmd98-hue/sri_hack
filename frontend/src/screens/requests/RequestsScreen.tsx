import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { SwapRequest } from '../../models/swapRequest';
import { useStoreSelector } from '../../state/store';

type Tab = 'inbox' | 'sent';

function RequestCard({
  item,
  isInbox,
  onAccept,
  onReject,
}: {
  item: SwapRequest;
  isInbox: boolean;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const pendingInbox = isInbox && item.status === 'pending';

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.otherUserName ?? 'Unknown'}</Text>
      <Text style={styles.subtitle}>
        {item.status}
        {item.message !== undefined && item.message.length > 0
          ? ` - ${item.message}`
          : ''}
      </Text>
      {pendingInbox ? (
        <View style={styles.actions}>
          <Pressable
            onPress={() => onAccept(item.id)}
            style={({ pressed }) => [styles.acceptButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
          <Pressable
            onPress={() => onReject(item.id)}
            style={({ pressed }) => [styles.rejectButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export function RequestsScreen() {
  const { requestStore } = useAppServices();
  const loading = useStoreSelector(requestStore, store => store.isLoading);
  const error = useStoreSelector(requestStore, store => store.error);
  const inbox = useStoreSelector(requestStore, store => store.inbox);
  const sent = useStoreSelector(requestStore, store => store.sent);
  const [tab, setTab] = useState<Tab>('inbox');

  useEffect(() => {
    requestStore.refresh().catch(() => {
      // Store exposes refresh errors through state.
    });
  }, [requestStore]);

  const items = useMemo(() => (tab === 'inbox' ? inbox : sent), [inbox, sent, tab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setTab('inbox')}
          style={[styles.tabButton, tab === 'inbox' ? styles.activeTab : null]}
        >
          <Text style={[styles.tabText, tab === 'inbox' ? styles.activeTabText : null]}>
            Inbox
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('sent')}
          style={[styles.tabButton, tab === 'sent' ? styles.activeTab : null]}
        >
          <Text style={[styles.tabText, tab === 'sent' ? styles.activeTabText : null]}>
            Sent
          </Text>
        </Pressable>
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0a7a5a" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={item => String(item.id)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {tab === 'inbox' ? 'No incoming requests' : 'No sent requests'}
            </Text>
          }
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                requestStore.refresh().catch(() => {
                  // Store exposes refresh errors through state.
                });
              }}
              refreshing={loading}
              tintColor="#0a7a5a"
            />
          }
          renderItem={({ item }) => (
            <RequestCard
              isInbox={tab === 'inbox'}
              item={item}
              onAccept={id => {
                requestStore.respond(id, 'accept').catch(() => {
                  // Store exposes respond errors through state.
                });
              }}
              onReject={id => {
                requestStore.respond(id, 'reject').catch(() => {
                  // Store exposes respond errors through state.
                });
              }}
            />
          )}
        />
      )}

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    margin: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c4d2c8',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    backgroundColor: '#f2f7f3',
  },
  activeTab: {
    backgroundColor: '#0a7a5a',
  },
  tabText: {
    color: '#34584b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d7e1da',
    padding: 12,
  },
  name: {
    color: '#18392e',
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#35574a',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#2c8b3f',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rejectButton: {
    backgroundColor: '#c94a4a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rejectText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#40665a',
  },
  errorText: {
    color: '#b00020',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});
