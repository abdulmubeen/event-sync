"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  TextInput,
  Tabs,
  Stack,
  Group,
  Badge,
  Select,
  MultiSelect,
  NumberInput,
  RangeSlider,
  Paper,
  Button,
  Collapse,
} from "@mantine/core";
import { IconSearch, IconFilter, IconSortAscending } from "@tabler/icons-react";
import {
  AttractionCard,
  Attraction,
} from "@/components/attraction-card/attraction-card";
import { EventCard, Event } from "@/components/event-card/event-card";
import { VenueCard, Venue } from "@/components/venue-card/venue-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useGeolocation, encodeGeohash } from "@/hooks/useGeolocation";
import { useUser } from "@clerk/nextjs";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const MIN_SEARCH_LENGTH = 5;
const DEBOUNCE_DELAY = 500;

type CacheData = {
  data: any;
  timestamp: number;
};

type Cache = {
  events: CacheData | null;
  venues: CacheData | null;
  attractions: CacheData | null;
};

type FilterState = {
  categories: string[];
  priceRange: [number, number];
  dateRange: [Date | null, Date | null];
  distance: number;
  sortBy: string;
};

const EVENT_CATEGORIES = [
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "arts", label: "Arts & Theatre" },
  { value: "family", label: "Family" },
  { value: "comedy", label: "Comedy" },
];

const SORT_OPTIONS = [
  { value: "date-asc", label: "Date (Earliest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "popularity", label: "Popularity" },
];

export default function UserDashboard() {
  const { location, error: locationError } = useGeolocation();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    dateRange: [null, null],
    distance: 50,
    sortBy: "date-asc",
  });
  const [cache, setCache] = useState<Cache>({
    events: null,
    venues: null,
    attractions: null,
  });

  const debouncedSearch = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const isCacheValid = useCallback((cacheData: CacheData | null) => {
    if (!cacheData) return false;
    return Date.now() - cacheData.timestamp < CACHE_DURATION;
  }, []);

  const applyFilters = useCallback(
    (events: Event[]) => {
      return events
        .filter((event) => {
          // Category filter
          if (filters.categories.length > 0) {
            const eventCategory = event.classifications?.[0]?.segment?.id;
            if (!eventCategory || !filters.categories.includes(eventCategory)) {
              return false;
            }
          }

          // Price filter
          const price = event.priceRanges?.[0]?.min || 0;
          if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
            return false;
          }

          // Date filter
          if (filters.dateRange[0] && filters.dateRange[1]) {
            const eventDate = new Date(
              event.dates?.start?.dateTime ||
                event.dates?.start?.localDate ||
                ""
            );
            if (
              eventDate < filters.dateRange[0] ||
              eventDate > filters.dateRange[1]
            ) {
              return false;
            }
          }

          return true;
        })
        .sort((a, b) => {
          switch (filters.sortBy) {
            case "date-asc":
              return (
                new Date(
                  a.dates?.start?.dateTime || a.dates?.start?.localDate || ""
                ).getTime() -
                new Date(
                  b.dates?.start?.dateTime || b.dates?.start?.localDate || ""
                ).getTime()
              );
            case "date-desc":
              return (
                new Date(
                  b.dates?.start?.dateTime || b.dates?.start?.localDate || ""
                ).getTime() -
                new Date(
                  a.dates?.start?.dateTime || a.dates?.start?.localDate || ""
                ).getTime()
              );
            case "price-asc":
              return (
                (a.priceRanges?.[0]?.min || 0) - (b.priceRanges?.[0]?.min || 0)
              );
            case "price-desc":
              return (
                (b.priceRanges?.[0]?.min || 0) - (a.priceRanges?.[0]?.min || 0)
              );
            case "popularity":
              return (b.popularity || 0) - (a.popularity || 0);
            default:
              return 0;
          }
        });
    },
    [filters]
  );

  const fetchInitialData = useCallback(async () => {
    if (!location) return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
      const geohash = encodeGeohash(location.latitude, location.longitude);

      // Check cache first
      if (
        isCacheValid(cache.events) &&
        isCacheValid(cache.venues) &&
        isCacheValid(cache.attractions)
      ) {
        setEvents(cache.events?.data || []);
        setVenues(cache.venues?.data || []);
        setAttractions(cache.attractions?.data || []);
        setInitialLoading(false);
        return;
      }

      // Fetch events
      const eventsResponse = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=${geohash}&radius=${filters.distance}&unit=km&apikey=${apiKey}`
      );
      const eventsData = await eventsResponse.json();
      const eventsList = eventsData._embedded?.events || [];

      // Fetch venues
      const venuesResponse = await fetch(
        `https://app.ticketmaster.com/discovery/v2/venues.json?geoPoint=${geohash}&radius=${filters.distance}&unit=km&apikey=${apiKey}`
      );
      const venuesData = await venuesResponse.json();
      const venuesList = venuesData._embedded?.venues || [];

      // Fetch attractions
      const attractionsResponse = await fetch(
        `https://app.ticketmaster.com/discovery/v2/attractions.json?geoPoint=${geohash}&radius=${filters.distance}&unit=km&apikey=${apiKey}`
      );
      const attractionsData = await attractionsResponse.json();
      const attractionsList = attractionsData._embedded?.attractions || [];

      // Update cache
      setCache({
        events: { data: eventsList, timestamp: Date.now() },
        venues: { data: venuesList, timestamp: Date.now() },
        attractions: { data: attractionsList, timestamp: Date.now() },
      });

      // Update state
      setEvents(eventsList);
      setVenues(venuesList);
      setAttractions(attractionsList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [location, cache, isCacheValid, filters.distance]);

  const searchEvents = useCallback(async (query: string) => {
    if (query.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    try {
      setSearchLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;

      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
          query
        )}&apikey=${apiKey}&size=20`
      );
      const data = await response.json();

      // Properly handle the API response structure
      const results =
        data._embedded?.events?.map((event: any) => ({
          ...event,
          _embedded: {
            venues: event._embedded?.venues || [],
            attractions: event._embedded?.attractions || [],
          },
        })) || [];

      const total = data.page?.totalElements || 0;

      setSearchResults(results);
      setTotalResults(total);
    } catch (error) {
      console.error("Error searching events:", error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    searchEvents(debouncedSearch);
  }, [debouncedSearch, searchEvents]);

  if (locationError) {
    return (
      <Container>
        <Text c="red">Error getting location: {locationError}</Text>
      </Container>
    );
  }

  const isLoading = initialLoading || searchLoading;
  const displayEvents = applyFilters(
    searchQuery.length >= MIN_SEARCH_LENGTH ? searchResults : events
  );

  return (
    <Container size="xl" my="xl">
      <Stack gap="xl">
        <Title order={1}>Hello {user?.firstName}</Title>

        {/* Search and Filter Bar */}
        <Stack gap="xs">
          <Group>
            <TextInput
              placeholder={`Enter at least ${MIN_SEARCH_LENGTH} characters to search events...`}
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              minLength={MIN_SEARCH_LENGTH}
              style={{ flex: 1 }}
            />
            <Button
              variant="light"
              leftSection={<IconFilter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Group>
          {searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH && (
            <Text size="sm" c="dimmed">
              Please enter at least {MIN_SEARCH_LENGTH} characters to search
            </Text>
          )}
        </Stack>

        {/* Filters Panel with Animation */}
        <Collapse in={showFilters}>
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group>
                <Select
                  label="Sort By"
                  placeholder="Select sorting option"
                  data={SORT_OPTIONS}
                  value={filters.sortBy}
                  onChange={(value) =>
                    setFilters({ ...filters, sortBy: value || "date-asc" })
                  }
                  style={{ flex: 1 }}
                />
                <NumberInput
                  label="Distance (km)"
                  value={filters.distance}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      distance: typeof value === "number" ? value : 50,
                    })
                  }
                  min={1}
                  max={100}
                  style={{ width: 150 }}
                />
              </Group>

              <MultiSelect
                label="Categories"
                placeholder="Select categories"
                data={EVENT_CATEGORIES}
                value={filters.categories}
                onChange={(value) =>
                  setFilters({ ...filters, categories: value })
                }
              />

              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Price Range
                </Text>
                <RangeSlider
                  value={filters.priceRange}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      priceRange: value as [number, number],
                    })
                  }
                  min={0}
                  max={1000}
                  step={10}
                />
                <Group justify="space-between">
                  <Text size="sm">${filters.priceRange[0]}</Text>
                  <Text size="sm">${filters.priceRange[1]}</Text>
                </Group>
              </Stack>
            </Stack>
          </Paper>
        </Collapse>

        {/* Results Count for Search */}
        {searchQuery.length >= MIN_SEARCH_LENGTH && totalResults > 0 && (
          <Group>
            <Badge size="lg" variant="light">
              Found {totalResults} events
            </Badge>
          </Group>
        )}

        {/* Tabs */}
        <Tabs defaultValue="events">
          <Tabs.List>
            <Tabs.Tab value="events">Events</Tabs.Tab>
            <Tabs.Tab value="venues">Venues</Tabs.Tab>
            <Tabs.Tab value="attractions">Attractions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="events" pt="md">
            <Grid>
              {isLoading
                ? // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                      <div style={{ height: "100%" }}>
                        <LoadingSkeleton />
                      </div>
                    </Grid.Col>
                  ))
                : displayEvents.map((event) => (
                    <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <div style={{ height: "100%" }}>
                        <EventCard event={event} />
                      </div>
                    </Grid.Col>
                  ))}
            </Grid>
            {!isLoading &&
              searchQuery.length >= MIN_SEARCH_LENGTH &&
              searchResults.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                  No events found for "{searchQuery}"
                </Text>
              )}
          </Tabs.Panel>

          <Tabs.Panel value="venues" pt="md">
            <Grid>
              {initialLoading
                ? // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                      <div style={{ height: "100%" }}>
                        <LoadingSkeleton />
                      </div>
                    </Grid.Col>
                  ))
                : venues.map((venue) => (
                    <Grid.Col key={venue.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <div style={{ height: "100%" }}>
                        <VenueCard venue={venue} />
                      </div>
                    </Grid.Col>
                  ))}
            </Grid>
            {!initialLoading && venues.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No venues found.
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="attractions" pt="md">
            <Grid>
              {initialLoading
                ? // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                      <div style={{ height: "100%" }}>
                        <LoadingSkeleton />
                      </div>
                    </Grid.Col>
                  ))
                : attractions.map((attraction) => (
                    <Grid.Col
                      key={attraction.id}
                      span={{ base: 12, sm: 6, md: 4 }}
                    >
                      <div style={{ height: "100%" }}>
                        <AttractionCard attraction={attraction} />
                      </div>
                    </Grid.Col>
                  ))}
            </Grid>
            {!initialLoading && attractions.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No attractions found.
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
