import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { searchArtists } from '../services/songService';
import { decodeHtml } from '../utils/decodeHtml';

const MENU_ITEMS = [
  { id: 'play',     label: 'Play',                 icon: 'play-circle-outline' },
  { id: 'next',     label: 'Play Next',            icon: 'play-forward-outline' },
  { id: 'queue',    label: 'Add to Playing Queue', icon: 'list-outline' },
  { id: 'playlist', label: 'Add to Playlist',      icon: 'add-circle-outline' },
  { id: 'share',    label: 'Share',                icon: 'share-outline' },
];

const ArtistsContent = () => {
  const navigation = useNavigation<any>();
  const [artists, setArtists] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await searchArtists('arijit');
      setArtists(data.data.results || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Count + Sort header */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>
          {artists.length} artists
        </Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>Date Added</Text>
          <Ionicons
            name="swap-vertical-outline"
            size={15}
            color="#ff8c1a"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Artist', {
                artistId: item.id,
                artistName: item.name,
                artistImage: item.image?.[2]?.url,
              })
            }
            activeOpacity={0.75}
          >
            <Image
              source={{
                uri: item.image?.[2]?.url || item.image?.[1]?.url,
              }}
              style={styles.avatar}
            />

            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {decodeHtml(item.name)}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.albumCount
                  ? `${item.albumCount} Album${item.albumCount > 1 ? 's' : ''}`
                  : '1 Album'}
                {'  |  '}
                {item.songCount
                  ? `${item.songCount} Songs`
                  : '20 Songs'}
              </Text>
            </View>

            {/* 3-dot menu button */}
            <TouchableOpacity
              onPress={() => {
                setSelectedArtist(item);
                setShowMenu(true);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.bottomSheet}>
            {/* Artist info */}
            <View style={styles.sheetHeader}>
              <Image
                source={{
                  uri: selectedArtist?.image?.[2]?.url,
                }}
                style={styles.sheetAvatar}
              />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.sheetName} numberOfLines={1}>
                  {decodeHtml(selectedArtist?.name ?? '')}
                </Text>
                <Text style={styles.sheetMeta}>
                  {selectedArtist?.albumCount
                    ? `${selectedArtist.albumCount} Album`
                    : '1 Album'}
                  {'  |  '}
                  {selectedArtist?.songCount
                    ? `${selectedArtist.songCount} Songs`
                    : '20 Songs'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Menu items */}
            {MENU_ITEMS.map((menuItem) => (
              <TouchableOpacity
                key={menuItem.id}
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  if (menuItem.id === 'play') {
                    navigation.navigate('Artist', {
                      artistId: selectedArtist?.id,
                      artistName: selectedArtist?.name,
                      artistImage: selectedArtist?.image?.[2]?.url,
                    });
                  }
                }}
              >
                <Ionicons
                  name={menuItem.icon as any}
                  size={22}
                  color="#333"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuLabel}>{menuItem.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ArtistsContent;

const styles = StyleSheet.create({
  // Header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortText: {
    fontSize: 13,
    color: '#ff8c1a',
    fontWeight: '600',
  },

  // Artist row
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginLeft: 86,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  sheetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  sheetMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  menuIcon: {
    width: 32,
  },
  menuLabel: {
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
  },
});