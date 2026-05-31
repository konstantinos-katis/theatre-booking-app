import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Seat = {
  seat_id: number;
  showtime_id: number;
  seat_row: string;
  seat_number: number;
  category: string;
  price: string;
  is_reserved: number;
};

const API_URL = 'http://localhost:5000';

export default function BookingScreen() {
  const params = useLocalSearchParams<{
    showtimeId: string;
    title?: string;
  }>();

  const rawShowtimeId = Array.isArray(params.showtimeId)
  ? params.showtimeId[0]
  : params.showtimeId;

  const showtimeId = Number(rawShowtimeId);
  const showTitle = params.title || 'Selected Showtime';

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
  try {
    setMessage('');

    if (!showtimeId || Number.isNaN(showtimeId)) {
      setMessage('Invalid showtime ID.');
      return;
    }

    const response = await axios.get(
      `${API_URL}/seats?showtimeId=${showtimeId}`
    );

    if (!Array.isArray(response.data)) {
      setMessage('Invalid seats response from backend.');
      setSeats([]);
      return;
    }

    setSeats(response.data);
  } catch (error) {
    setMessage('Failed to load seats.');
    setSeats([]);
  } finally {
    setLoading(false);
  }
 };

  const toggleSeat = (seat: Seat) => {
    if (Number(seat.is_reserved) === 1) {
      return;
    }

    setSelectedSeatIds((currentSeatIds) => {
      if (currentSeatIds.includes(seat.seat_id)) {
        return currentSeatIds.filter((seatId) => seatId !== seat.seat_id);
      }

      return [...currentSeatIds, seat.seat_id];
    });
  };

  const calculateTotalPrice = () => {
    return seats
      .filter((seat) => selectedSeatIds.includes(seat.seat_id))
      .reduce((total, seat) => total + Number(seat.price), 0);
  };

  const handleConfirmReservation = async () => {
    try {
      setMessage('');

      if (selectedSeatIds.length === 0) {
        setMessage('Select at least one seat.');
        return;
      }

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setMessage('Please login before booking.');
        return;
      }

      await axios.post(
        `${API_URL}/reservations`,
        {
          showtimeId,
          seatIds: selectedSeatIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Reservation created successfully.');
      setSelectedSeatIds([]);
      await fetchSeats();
    } catch (error) {
      setMessage('Reservation failed. One or more seats may already be reserved.');
      await fetchSeats();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading seats...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appLabel}>SEAT SELECTION</Text>
          <Text style={styles.title}>{showTitle}</Text>
          <Text style={styles.subtitle}>
            Choose one or more available seats. The total price is calculated
            automatically.
          </Text>
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.sectionTitle}>Seat Categories</Text>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.vipDot]} />
            <Text style={styles.legendText}>VIP — Row A — 25 €</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.premiumDot]} />
            <Text style={styles.legendText}>Premium — Row B — 20 €</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.standardDot]} />
            <Text style={styles.legendText}>Standard — Row C — 18 €</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.reservedDot]} />
            <Text style={styles.legendText}>Reserved seat</Text>
          </View>
        </View>

        <View style={styles.screen}>
          <Text style={styles.screenText}>STAGE</Text>
        </View>
        {seats.length === 0 ? (
          <View style={styles.messageBox}>
           <Text style={styles.messageText}>
             No seats were loaded for this showtime.
          </Text>
         </View>
        ) : null}

        {['A', 'B', 'C'].map((row) => (
          <View key={row} style={styles.seatRow}>
            <Text style={styles.rowLabel}>{row}</Text>

            <View style={styles.seatGrid}>
              {seats
                .filter((seat) => seat.seat_row === row).filter(
                  (seat) =>
                    String(seat.seat_row).trim().toUpperCase() === row
                )
                .map((seat) => {
                  const isReserved = Number(seat.is_reserved) === 1;
                  const isSelected = selectedSeatIds.includes(seat.seat_id);

                  return (
                    <Pressable
                      key={seat.seat_id}
                      disabled={isReserved}
                      onPress={() => toggleSeat(seat)}
                      style={[
                        styles.seat,
                        seat.category === 'VIP' && styles.vipSeat,
                        seat.category === 'Premium' && styles.premiumSeat,
                        seat.category === 'Standard' && styles.standardSeat,
                        isSelected && styles.selectedSeat,
                        isReserved && styles.reservedSeat,
                      ]}
                    >
                      <Text
                        style={[
                          styles.seatText,
                          isSelected && styles.selectedSeatText,
                          isReserved && styles.reservedSeatText,
                        ]}
                      >
                        {seat.seat_row}
                        {seat.seat_number}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Reservation Summary</Text>

          <InfoRow
            label="Selected seats"
            value={
              selectedSeatIds.length > 0
                ? seats
                    .filter((seat) => selectedSeatIds.includes(seat.seat_id))
                    .map((seat) => `${seat.seat_row}${seat.seat_number}`)
                    .join(', ')
                : 'None'
            }
          />

          <InfoRow
            label="Number of tickets"
            value={String(selectedSeatIds.length)}
          />

          <InfoRow
            label="Total price"
            value={`${calculateTotalPrice().toFixed(2)} €`}
          />

          <View style={styles.buttonGap}>
            <CustomButton
              title="Confirm Reservation"
              variant="primary"
              onPress={handleConfirmReservation}
            />
          </View>

          <View style={styles.buttonGap}>
            <CustomButton
              title="Back to Home"
              variant="secondary"
              onPress={() => router.push('/')}
            />
          </View>

          {message ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function CustomButton({
  title,
  variant,
  onPress,
}: {
  title: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.customButton,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.customButtonText,
          variant === 'primary' && styles.primaryButtonText,
          variant === 'secondary' && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8f3ee',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f3ee',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b5f57',
  },
  header: {
    backgroundColor: '#d9c7b8',
    padding: 26,
    borderRadius: 30,
    marginTop: 35,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#cbb7a6',
  },
  appLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#6b5f57',
    marginBottom: 8,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#3f342d',
  },
  subtitle: {
    color: '#5f5047',
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  legendCard: {
    backgroundColor: '#fffdf9',
    padding: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#eaded2',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4b3d35',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  vipDot: {
    backgroundColor: '#d8b6a4',
  },
  premiumDot: {
    backgroundColor: '#d8cfaa',
  },
  standardDot: {
    backgroundColor: '#bfcfb9',
  },
  reservedDot: {
    backgroundColor: '#c9c9c9',
  },
  legendText: {
    color: '#5f5047',
    fontSize: 14,
  },
  screen: {
    backgroundColor: '#8f6f5b',
    padding: 10,
    borderRadius: 18,
    marginBottom: 24,
    alignItems: 'center',
  },
  screenText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rowLabel: {
    width: 35,
    fontSize: 17,
    fontWeight: '700',
    color: '#4b3d35',
  },
  seatGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  seat: {
    width: 58,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  vipSeat: {
    backgroundColor: '#f1d9cc',
    borderColor: '#d8b6a4',
  },
  premiumSeat: {
    backgroundColor: '#eee8ca',
    borderColor: '#d8cfaa',
  },
  standardSeat: {
    backgroundColor: '#e3eee0',
    borderColor: '#bfcfb9',
  },
  selectedSeat: {
    backgroundColor: '#8f6f5b',
    borderColor: '#6b4f40',
  },
  reservedSeat: {
    backgroundColor: '#dddddd',
    borderColor: '#c9c9c9',
  },
  seatText: {
    fontWeight: '700',
    color: '#4b3d35',
  },
  selectedSeatText: {
    color: '#ffffff',
  },
  reservedSeatText: {
    color: '#999999',
  },
  summaryCard: {
    backgroundColor: '#fffdf9',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#eaded2',
    marginTop: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 5,
  },
  infoLabel: {
    color: '#7a6a60',
    fontWeight: '600',
  },
  infoValue: {
    color: '#4b3d35',
    textAlign: 'right',
    flex: 1,
  },
  buttonGap: {
    marginTop: 12,
  },
  customButton: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 26,
    alignItems: 'center',
  },
  customButtonText: {
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#8f6f5b',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#efe4d8',
    borderWidth: 1,
    borderColor: '#d7c4b4',
  },
  secondaryButtonText: {
    color: '#4b3d35',
  },
  messageBox: {
    backgroundColor: '#eef4ea',
    padding: 14,
    borderRadius: 20,
    marginTop: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#8cad7f',
  },
  messageText: {
    color: '#3f342d',
  },
});