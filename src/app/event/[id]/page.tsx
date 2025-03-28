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
import { Event } from "@/components/event-card/event-card";
import {
  IconTicket,
  IconMapPin,
  IconCalendar,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";

type EventDetailsProps = {
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

async function getEvent(id: string) {
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export default async function EventDetails({ params }: EventDetailsProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <Container>
        <Text>Invalid event ID.</Text>
      </Container>
    );
  }

  const event = await getEvent(id);

  if (!event) {
    return (
      <Container>
        <Text>Event not found.</Text>
      </Container>
    );
  }

  const images = event.images || [];
  const venue = event._embedded?.venues?.[0];
  const priceRange = event.priceRanges?.[0];

  // Format date
  const eventDate = event.dates?.start?.localDate
    ? new Date(event.dates.start.localDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBA";

  // Format time if available
  const eventTime = event.dates?.start?.localTime
    ? new Date(`1970-01-01T${event.dates.start.localTime}`).toLocaleTimeString(
        "en-US",
        { hour: "numeric", minute: "2-digit" }
      )
    : null;

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
              <Title order={1}>{event.name}</Title>
              <Group gap="xs">
                <Badge variant="light" color="blue" size="sm">
                  {event.type}
                </Badge>
                {priceRange && (
                  <Badge variant="filled" color="green" size="sm">
                    {priceRange.currency} {priceRange.min} - {priceRange.max}
                  </Badge>
                )}
              </Group>
            </Stack>
            {event.url && (
              <Button
                component="a"
                href={event.url}
                target="_blank"
                variant="filled"
                color="blue"
                leftSection={<IconTicket size={16} />}
              >
                Buy Tickets
              </Button>
            )}
          </Group>

          <Group gap="md">
            <Group gap="xs">
              <IconCalendar
                size={16}
                style={{ color: "var(--mantine-color-dimmed)" }}
              />
              <Text size="sm" c="dimmed">
                {eventDate}
                {eventTime && ` at ${eventTime}`}
              </Text>
            </Group>
            {venue && (
              <Group gap="xs">
                <IconMapPin
                  size={16}
                  style={{ color: "var(--mantine-color-dimmed)" }}
                />
                <Text size="sm" c="dimmed">
                  {venue.name}, {venue.city.name}, {venue.state.name},{" "}
                  {venue.country.name}
                </Text>
              </Group>
            )}
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
                      alt={`${event.name} - Image ${index + 1}`}
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

        {/* Additional Information */}
        {event.info && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>Event Information</Title>
              <Text>{event.info}</Text>
            </Stack>
          </Paper>
        )}

        {/* Please Note */}
        {event.pleaseNote && (
          <Paper p="md" radius="md" withBorder color="yellow" variant="light">
            <Stack gap="xs">
              <Title order={4}>Please Note</Title>
              <Text>{event.pleaseNote}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
