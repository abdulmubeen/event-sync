import {
  Container,
  Title,
  Text,
  Image,
  Group,
  Stack,
  Badge,
  Grid,
  Paper,
  rem,
  Button,
  Divider,
} from "@mantine/core";
import { Venue } from "@/components/venue-card/venue-card";
import { IconMapPin, IconCalendar, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

type VenueDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

type ImageType = {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
};

type UpcomingEvents = {
  tmr?: number;
  ticketmaster?: number;
  _total: number;
  _filtered?: number;
};

async function getVenue(id: string) {
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export default async function VenueDetails({ params }: VenueDetailsProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <Container>
        <Text>Invalid venue ID.</Text>
      </Container>
    );
  }

  const venue = await getVenue(id);

  if (!venue) {
    return (
      <Container>
        <Text>Venue not found.</Text>
      </Container>
    );
  }

  const images = venue.images || [];
  const upcomingEvents = venue.upcomingEvents as UpcomingEvents | undefined;
  const totalEvents = upcomingEvents?._total ?? 0;

  // Format address
  const address = venue.address
    ? [
        venue.address.line1,
        venue.address.line2,
        venue.address.line3,
        venue.address.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  // Format location
  const location = [venue.city.name, venue.state.name, venue.country.name].join(
    ", "
  );

  return (
    <Container size="lg" my="xl">
      <Stack gap="xl">
        {/* Back Button */}
        <Button
          component={Link}
          href="/dashboard"
          variant="light"
          color="blue"
          leftSection={<IconArrowLeft size={16} />}
          size="sm"
        >
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Title order={1}>{venue.name}</Title>
              <Badge variant="light" color="blue" size="sm">
                {venue.type}
              </Badge>
            </Stack>
            {venue.url && (
              <Button
                component="a"
                href={venue.url}
                target="_blank"
                variant="filled"
                color="blue"
                leftSection={<IconCalendar size={16} />}
              >
                View Events
              </Button>
            )}
          </Group>

          <Group gap="md">
            <Group gap="xs">
              <IconMapPin
                size={16}
                style={{ color: "var(--mantine-color-dimmed)" }}
              />
              <Stack gap={2}>
                <Text size="sm" c="dimmed">
                  {location}
                </Text>
                {address && (
                  <Text size="sm" c="dimmed">
                    {address}
                  </Text>
                )}
              </Stack>
            </Group>
          </Group>
        </Stack>

        {/* Images Grid */}
        {images.length > 0 && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {images
                .filter(
                  (img: ImageType) => img.url && !img.url.endsWith("_SOURCE")
                )
                .slice(0, 3)
                .map((img: ImageType, index: number) => (
                  <div
                    key={`${img.url}-${index}`}
                    style={{ position: "relative", paddingTop: "56.25%" }}
                  >
                    <img
                      src={img.url}
                      alt={`${venue.name} - Image ${index + 1}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {totalEvents > 0 && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>Upcoming Events</Title>
              <Group gap="xs">
                <Badge variant="filled" color="green" size="sm">
                  {totalEvents} events
                </Badge>
                {upcomingEvents?.ticketmaster && (
                  <Badge variant="light" color="blue" size="sm">
                    {upcomingEvents.ticketmaster} on Ticketmaster
                  </Badge>
                )}
                {upcomingEvents?.tmr && (
                  <Badge variant="light" color="blue" size="sm">
                    {upcomingEvents.tmr} on TMR
                  </Badge>
                )}
              </Group>
            </Stack>
          </Paper>
        )}

        {/* General Information */}
        {venue.generalInfo?.generalRule && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>General Information</Title>
              <Text>{venue.generalInfo.generalRule}</Text>
            </Stack>
          </Paper>
        )}

        {/* Parking Information */}
        {venue.parkingDetail && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>Parking Information</Title>
              <Text>{venue.parkingDetail}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
