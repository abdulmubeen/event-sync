"use client";

import { useEffect, useState } from "react";
import { Container, Title, Grid, Text, LoadingOverlay } from "@mantine/core";
import { EventCard, Event } from "@/components/event-card/event-card";
import { useUser } from "@clerk/nextjs";

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<{ event: Event }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await fetch("/api/favorites");
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <Container>
        <Title order={1} mb="xl">
          Please sign in to view your favorites
        </Title>
      </Container>
    );
  }

  return (
    <Container size="xl" my="xl">
      <Title order={1} mb="xl">
        Your Favorite Events
      </Title>
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={loading} />
        {favorites.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            You haven't added any events to your favorites yet.
          </Text>
        ) : (
          <Grid>
            {favorites.map(({ event }) => (
              <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                <div style={{ height: "100%" }}>
                  <EventCard event={event} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </div>
    </Container>
  );
}
