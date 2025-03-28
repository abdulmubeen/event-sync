import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Stack,
  rem,
} from "@mantine/core";
import Link from "next/link";
import { IconTicket } from "@tabler/icons-react";

export type Attraction = {
  name: string;
  id: string;
  url: string;
  type: string;
  externalLinks?: {
    twitter?: { url: string }[];
    facebook?: { url: string }[];
    wiki?: { url: string }[];
    instagram?: { url: string }[];
    homepage?: { url: string }[];
  };
  aliases?: string[];
  images?: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
  classifications?: {
    primary: boolean;
    segment: { id: string; name: string };
    genre: { id: string; name: string };
    subGenre?: { id: string; name: string };
    type?: { id: string; name: string };
    subType?: { id: string; name: string };
    family: boolean;
  }[];
  upcomingEvents?: {
    tmr?: number;
    ticketmaster?: number;
    _total: number;
    _filtered?: number;
  };
};

type AttractionCardProps = {
  attraction: Attraction;
};

export function AttractionCard({ attraction }: AttractionCardProps) {
  // Choose a primary image (prefer one with ratio "16_9" if available)
  const image =
    attraction.images?.find((img) => img.ratio === "16_9") ||
    attraction.images?.[0];

  // Use the first classification's segment name for a badge (if available)
  const classification = attraction.classifications?.[0]?.segment?.name;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section>
        {image && (
          <Image
            src={image.url}
            alt={attraction.name}
            height={200}
            style={{ objectFit: "cover" }}
          />
        )}
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ height: "calc(100% - 200px)" }}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text fw={600} size="lg" lineClamp={1}>
              {attraction.name}
            </Text>
            {classification && (
              <Badge variant="light" color="blue" size="sm">
                {classification}
              </Badge>
            )}
          </Stack>
          {attraction.upcomingEvents &&
            attraction.upcomingEvents._total > 0 && (
              <Badge variant="filled" color="green" size="sm">
                {attraction.upcomingEvents._total} events
              </Badge>
            )}
        </Group>

        {attraction.aliases && attraction.aliases.length > 0 && (
          <Text size="sm" c="dimmed" lineClamp={1}>
            {attraction.aliases.slice(0, 3).join(" • ")}
          </Text>
        )}

        <Group gap="xs" mt="auto">
          <Button
            component={Link}
            href={`/attraction/${attraction.id}`}
            variant="light"
            color="blue"
            size="sm"
            fullWidth
          >
            View Details
          </Button>
          <Button
            component="a"
            href={attraction.url}
            target="_blank"
            variant="filled"
            color="blue"
            size="sm"
            leftSection={<IconTicket size={16} />}
            fullWidth
          >
            Buy Tickets
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
