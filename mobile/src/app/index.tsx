import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theatre = {
  theatre_id: number;
  name: string;
  location: string;
  description: string;
};

type Show = {
  show_id: number;
  title: string;
  description: string;
  duration: number;
  age_rating: string;
  theatre_name: string;
  location: string;
};

type Showtime = {
  showtime_id: number;
  show_id: number;
  title: string;
  show_date: string;
  show_time: string;
  hall: string;
  base_price: string;
};

type Reservation = {
  reservation_id: number;
  status: string;
  total_price: string;
  created_at: string;
  title: string;
  show_date: string;
  show_time: string;
  hall: string;
};

const API_URL = 'http://localhost:5000';

export default function HomeScreen() {
  const params = useLocalSearchParams<{
    booking?: string | string[];
  }>();

  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [token, setToken] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPublicData = async () => {
    const [
      theatresResponse,
      showsResponse,
      showtimesResponse,
    ] = await Promise.all([
      axios.get(`${API_URL}/theatres`),
      axios.get(`${API_URL}/shows`),
      axios.get(`${API_URL}/shows/showtimes`),
    ]);

    setTheatres(theatresResponse.data);
    setShows(showsResponse.data);
    setShowtimes(showtimesResponse.data);
  };

  const fetchReservations = async (userToken: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/reservations`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setReservations(response.data);
    } catch (error) {
      await AsyncStorage.removeItem('token');
      setToken('');
      setReservations([]);
    }
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      setError('');

      await fetchPublicData();

      const savedToken = await AsyncStorage.getItem('token');

      if (savedToken) {
        setToken(savedToken);
        await fetchReservations(savedToken);
      } else {
        setToken('');
        setReservations([]);
      }

      const bookingStatus = Array.isArray(params.booking)
        ? params.booking[0]
        : params.booking;

      if (bookingStatus === 'success') {
        setMessage('Reservation created successfully.');
      }
    } catch (error) {
      setError('Failed to load data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPage();
    }, [params.booking])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');

    setToken('');
    setReservations([]);
    setMessage('Logged out successfully.');
  };

  const handleCancelReservation = async (
    reservationId: number
  ) => {
    try {
      if (!token) {
        setMessage('Please login first.');
        return;
      }

      await axios.delete(
        `${API_URL}/reservations/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Reservation cancelled successfully.');
      await fetchReservations(token);
    } catch (error) {
      setMessage('Failed to cancel reservation.');
    }
  };

  const handleSelectSeats = (showtime: Showtime) => {
    const bookingPath =
      `/booking/${showtime.showtime_id}?title=${encodeURIComponent(
        showtime.title
      )}`;

    if (!token) {
      router.push(
        `/login?redirect=${encodeURIComponent(bookingPath)}` as any
      );

      return;
    }

    router.push(bookingPath as any);
  };

  const formatDate = (dateValue: string) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timeValue: string) => {
    return timeValue ? timeValue.slice(0, 5) : '';
  };

  const activeReservations = reservations.filter(
    (reservation) => reservation.status === 'active'
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>

        <View style={styles.retryButtonWrapper}>
          <CustomButton
            title="Try Again"
            variant="secondary"
            onPress={loadPage}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appLabel}>
            THEATRE RESERVATIONS
          </Text>

          <Text style={styles.appTitle}>
            Theatre Booking App
          </Text>

          <Text style={styles.appSubtitle}>
            Browse available performances, select seats and manage
            your active reservations.
          </Text>
        </View>

        <View style={styles.accountCard}>
          <Text style={styles.sectionTitle}>
            Account
          </Text>

          {token ? (
            <>
              <Text style={styles.cardText}>
                You are logged in. You can select seats and manage
                your reservations.
              </Text>

              <View style={styles.buttonGap}>
                <CustomButton
                  title="Logout"
                  variant="secondary"
                  onPress={handleLogout}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardText}>
                Login to reserve seats or create a new account.
              </Text>

              <View style={styles.accountActions}>
                <CustomButton
                  title="Login"
                  variant="primary"
                  onPress={() => router.push('/login')}
                />

                <CustomButton
                  title="Register"
                  variant="secondary"
                  onPress={() => router.push('/register')}
                />
              </View>
            </>
          )}
        </View>

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {message}
            </Text>
          </View>
        ) : null}

        {token ? (
          <View style={styles.section}>
            <SectionHeader
              title="My Reservations"
              count={activeReservations.length}
            />

            {activeReservations.length === 0 ? (
              <Text style={styles.emptyText}>
                No active reservations found.
              </Text>
            ) : (
              activeReservations.map((reservation) => (
                <View
                  key={reservation.reservation_id}
                  style={styles.card}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {reservation.title}
                    </Text>

                    <Text style={styles.statusBadge}>
                      {reservation.status}
                    </Text>
                  </View>

                  <InfoRow
                    label="Date"
                    value={formatDate(
                      reservation.show_date
                    )}
                  />

                  <InfoRow
                    label="Time"
                    value={formatTime(
                      reservation.show_time
                    )}
                  />

                  <InfoRow
                    label="Hall"
                    value={reservation.hall}
                  />

                  <InfoRow
                    label="Price"
                    value={`${reservation.total_price} €`}
                  />

                  <View style={styles.cardAction}>
                    <CustomButton
                      title="Cancel Reservation"
                      variant="danger"
                      onPress={() =>
                        handleCancelReservation(
                          reservation.reservation_id
                        )
                      }
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="Available Showtimes"
            count={showtimes.length}
          />

          {showtimes.map((showtime) => (
            <View
              key={showtime.showtime_id}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {showtime.title}
              </Text>

              <View style={styles.detailsBox}>
                <InfoRow
                  label="Date"
                  value={formatDate(showtime.show_date)}
                />

                <InfoRow
                  label="Time"
                  value={formatTime(showtime.show_time)}
                />

                <InfoRow
                  label="Hall"
                  value={showtime.hall}
                />

                <InfoRow
                  label="Starting price"
                  value={`${showtime.base_price} €`}
                />
              </View>

              <View style={styles.cardAction}>
                <CustomButton
                  title="Select Seats"
                  variant="primary"
                  onPress={() =>
                    handleSelectSeats(showtime)
                  }
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Available Theatres"
            count={theatres.length}
          />

          {theatres.map((theatre) => (
            <View
              key={theatre.theatre_id}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {theatre.name}
              </Text>

              <Text style={styles.locationText}>
                {theatre.location}
              </Text>

              <Text style={styles.descriptionText}>
                {theatre.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Available Shows"
            count={shows.length}
          />

          {shows.map((show) => (
            <View
              key={show.show_id}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {show.title}
              </Text>

              <Text style={styles.locationText}>
                {show.theatre_name} — {show.location}
              </Text>

              <Text style={styles.descriptionText}>
                {show.description}
              </Text>

              <View style={styles.detailsBox}>
                <InfoRow
                  label="Duration"
                  value={`${show.duration} minutes`}
                />

                <InfoRow
                  label="Age rating"
                  value={show.age_rating}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.counterBadge}>
        {count}
      </Text>
    </View>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function CustomButton({
  title,
  variant,
  onPress,
}: {
  title: string;
  variant: 'primary' | 'secondary' | 'danger';
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.customButton,
        variant === 'primary' &&
          styles.primaryButton,
        variant === 'secondary' &&
          styles.secondaryButton,
        variant === 'danger' &&
          styles.dangerButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.customButtonText,
          variant === 'primary' &&
            styles.primaryButtonText,
          variant === 'secondary' &&
            styles.secondaryButtonText,
          variant === 'danger' &&
            styles.dangerButtonText,
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
    maxWidth: 920,
    alignSelf: 'center',
    paddingBottom: 42,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f3ee',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#6b5f57',
    fontSize: 15,
  },
  error: {
    color: '#a94747',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButtonWrapper: {
    width: 180,
    marginTop: 14,
  },
  header: {
    backgroundColor: '#d9c7b8',
    padding: 28,
    borderRadius: 32,
    marginTop: 35,
    marginBottom: 18,
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
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3f342d',
  },
  appSubtitle: {
    color: '#5f5047',
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 660,
  },
  accountCard: {
    backgroundColor: '#fffaf5',
    padding: 20,
    borderRadius: 30,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eaded2',
  },
  accountActions: {
    marginTop: 14,
    gap: 10,
  },
  buttonGap: {
    marginTop: 12,
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#4b3d35',
  },
  counterBadge: {
    backgroundColor: '#eaded2',
    color: '#5f5047',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fffdf9',
    padding: 18,
    borderRadius: 30,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eaded2',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: '#3f342d',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#dcebd8',
    color: '#3d6540',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 30,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  locationText: {
    color: '#7a6a60',
    fontSize: 15,
    marginTop: 4,
  },
  descriptionText: {
    color: '#5f5047',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  detailsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eaded2',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    color: '#7a6a60',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    color: '#4b3d35',
    fontSize: 14,
    textAlign: 'right',
  },
  cardAction: {
    marginTop: 14,
  },
  cardText: {
    color: '#6b5f57',
    fontSize: 14,
    lineHeight: 21,
  },
  messageBox: {
    backgroundColor: '#eef4ea',
    padding: 16,
    borderRadius: 26,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#8cad7f',
  },
  messageText: {
    color: '#3f342d',
    fontSize: 14,
  },
  emptyText: {
    backgroundColor: '#fffaf5',
    color: '#7a6a60',
    padding: 16,
    borderRadius: 26,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eaded2',
  },
  customButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 26,
  },
  customButtonText: {
    fontSize: 14,
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
  dangerButton: {
    backgroundColor: '#f3d6d2',
    borderWidth: 1,
    borderColor: '#e3aaa3',
  },
  dangerButtonText: {
    color: '#8a3b35',
  },
});