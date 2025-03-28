import { GetStaticPaths, GetStaticProps } from "next";
import {
  Container,
  Title,
  Text,
  Image,
  Group,
  List,
  Anchor,
  Divider,
} from "@mantine/core";
import { Attraction } from "@/components/attraction-card/attraction-card";

type AttractionDetailsProps = {
  attraction: Attraction | null;
};

export default function AttractionDetails({
  attraction,
}: AttractionDetailsProps) {
  if (!attraction) {
    return (
      <Container>
        <Text>Attraction not found.</Text>
      </Container>
    );
  }

  return (
    <Container my="xl">
      <Title order={2}>{attraction.name}</Title>
      <Group my="md" gap="md">
        {attraction.images &&
          attraction.images
            .slice(0, 3)
            .map((img, index) => (
              <Image
                key={index}
                src={img.url}
                alt={attraction.name}
                width={200}
                height={150}
              />
            ))}
      </Group>
      <Text size="md" my="sm">
        <strong>Type:</strong> {attraction.type}
      </Text>
      {attraction.aliases && (
        <Text size="sm" color="dimmed" my="sm">
          <strong>Also known as:</strong> {attraction.aliases.join(", ")}
        </Text>
      )}

      {attraction.externalLinks && (
        <div>
          <Title order={4} my="md">
            External Links
          </Title>
          <List spacing="xs" size="sm" withPadding>
            {attraction.externalLinks.twitter?.map((link, index) => (
              <List.Item key={`twitter-${index}`}>
                <Anchor
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </Anchor>
              </List.Item>
            ))}
            {attraction.externalLinks.facebook?.map((link, index) => (
              <List.Item key={`facebook-${index}`}>
                <Anchor
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Anchor>
              </List.Item>
            ))}
            {attraction.externalLinks.wiki?.map((link, index) => (
              <List.Item key={`wiki-${index}`}>
                <Anchor
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wiki
                </Anchor>
              </List.Item>
            ))}
            {attraction.externalLinks.instagram?.map((link, index) => (
              <List.Item key={`instagram-${index}`}>
                <Anchor
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Anchor>
              </List.Item>
            ))}
            {attraction.externalLinks.homepage?.map((link, index) => (
              <List.Item key={`homepage-${index}`}>
                <Anchor
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Homepage
                </Anchor>
              </List.Item>
            ))}
          </List>
        </div>
      )}

      {attraction.classifications && (
        <div>
          <Title order={4} my="md">
            Classification
          </Title>
          <Text>
            {attraction.classifications!.map((cls, index) => (
              <span key={index}>
                {cls.segment.name} — {cls.genre.name}
                {index !== attraction.classifications!.length - 1 && ", "}
              </span>
            ))}
          </Text>
        </div>
      )}

      {attraction.upcomingEvents && (
        <div>
          <Divider my="md" />
          <Text>
            <strong>Upcoming Events:</strong> {attraction.upcomingEvents._total}
          </Text>
        </div>
      )}
    </Container>
  );
}
