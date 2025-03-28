import {
  Container,
  Title,
  Text,
  Image,
  Group,
  List,
  Anchor,
  Divider,
  Stack,
  Badge,
  Grid,
  Paper,
  rem,
  Button,
} from "@mantine/core";
import { Attraction } from "@/components/attraction-card/attraction-card";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconWorld,
  IconBook,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";

type AttractionDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

type ExternalLink = {
  url: string;
};

type Classification = {
  segment: { name: string };
  genre: { name: string };
};

type ImageType = {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
};

async function getAttraction(id: string) {
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export default async function AttractionDetails({
  params,
}: AttractionDetailsProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <Container>
        <Text>Invalid attraction ID.</Text>
      </Container>
    );
  }

  const attraction = await getAttraction(id);

  if (!attraction) {
    return (
      <Container>
        <Text>Attraction not found.</Text>
      </Container>
    );
  }

  const images = attraction.images || [];
  const externalLinks = attraction.externalLinks || {};
  const classifications = attraction.classifications || [];

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
              <Title order={1}>{attraction.name}</Title>
              <Group gap="xs">
                <Badge variant="light" color="blue" size="sm">
                  {attraction.type}
                </Badge>
                {attraction.upcomingEvents?._total > 0 && (
                  <Badge variant="filled" color="green" size="sm">
                    {attraction.upcomingEvents._total} upcoming events
                  </Badge>
                )}
              </Group>
            </Stack>
            {attraction.url && (
              <Anchor
                href={attraction.url}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                Buy Tickets
              </Anchor>
            )}
          </Group>

          {attraction.aliases && attraction.aliases.length > 0 && (
            <Text size="sm" c="dimmed">
              Also known as: {attraction.aliases.join(", ")}
            </Text>
          )}
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
                      alt={`${attraction.name} - Image ${index + 1}`}
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

        {/* Classifications */}
        {classifications.length > 0 && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>Classifications</Title>
              <Group gap="xs">
                {classifications.map((cls: Classification, index: number) => (
                  <Badge key={index} variant="light" color="blue" size="sm">
                    {cls.segment.name} • {cls.genre.name}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Paper>
        )}

        {/* External Links */}
        {Object.keys(externalLinks).length > 0 && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Title order={4}>External Links</Title>
              <Group gap="md">
                {externalLinks.twitter?.[0]?.url && (
                  <Anchor
                    href={externalLinks.twitter[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rem(4),
                    }}
                  >
                    <IconBrandTwitter size={16} />
                    Twitter
                  </Anchor>
                )}
                {externalLinks.facebook?.[0]?.url && (
                  <Anchor
                    href={externalLinks.facebook[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rem(4),
                    }}
                  >
                    <IconBrandFacebook size={16} />
                    Facebook
                  </Anchor>
                )}
                {externalLinks.instagram?.[0]?.url && (
                  <Anchor
                    href={externalLinks.instagram[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rem(4),
                    }}
                  >
                    <IconBrandInstagram size={16} />
                    Instagram
                  </Anchor>
                )}
                {externalLinks.wiki?.[0]?.url && (
                  <Anchor
                    href={externalLinks.wiki[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rem(4),
                    }}
                  >
                    <IconBook size={16} />
                    Wiki
                  </Anchor>
                )}
                {externalLinks.homepage?.[0]?.url && (
                  <Anchor
                    href={externalLinks.homepage[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="blue"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rem(4),
                    }}
                  >
                    <IconWorld size={16} />
                    Website
                  </Anchor>
                )}
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
