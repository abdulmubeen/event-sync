"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Tabs,
  Text,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { EventCard } from "@/components/event-card/event-card";
import { useUser } from "@clerk/nextjs";
import { Event } from "@/components/event-card/event-card";
import { IUserEvent } from "@/models/UserEvent";

type UserEventWithStatus = IUserEvent & {
  event: Event;
  status: "going" | "interested";
};

export default function MyEventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState<UserEventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>("going");

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return;
      try {
        const response = await fetch("/api/user-events");
        const userEvents = await response.json();
        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const goingEvents = events.filter(
    (userEvent) => userEvent.status === "going"
  );
  const interestedEvents = events.filter(
    (userEvent) => userEvent.status === "interested"
  );

  if (!user) {
    return (
      <Container>
        <Title order={1} ta="center" my="xl">
          Please sign in to view your events
        </Title>
      </Container>
    );
  }

  return (
    <Container size="xl" my="xl">
      <Title order={1} mb="xl">
        My Events
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="going">Going ({goingEvents.length})</Tabs.Tab>
          <Tabs.Tab value="interested">
            Interested ({interestedEvents.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="going" pt="md">
          <Grid>
            {goingEvents.map((userEvent) => (
              <Grid.Col
                key={userEvent.event.id}
                span={{ base: 12, sm: 6, md: 4 }}
              >
                <div style={{ height: "100%" }}>
                  <EventCard event={userEvent.event} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
          {goingEvents.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No events you're going to yet
            </Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="interested" pt="md">
          <Grid>
            {interestedEvents.map((userEvent) => (
              <Grid.Col
                key={userEvent.event.id}
                span={{ base: 12, sm: 6, md: 4 }}
              >
                <div style={{ height: "100%" }}>
                  <EventCard event={userEvent.event} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
          {interestedEvents.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No events you're interested in yet
            </Text>
          )}
        </Tabs.Panel>
      </Tabs>

      <LoadingOverlay visible={loading} />
    </Container>
  );
}
