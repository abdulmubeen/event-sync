import Link from "next/link";
import {
  IconTicket,
  IconMapPin,
  IconCalendar,
  IconInfoCircle,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { Venue } from "@/components/venue-card/venue-card";
import { Button, Group, ActionIcon, Tooltip } from "@mantine/core";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import { SocialInteractions } from "@/components/social-interactions/social-interactions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export type Event = {
  id: string;
  name: string;
  url: string;
  images: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
  dates: {
    start: {
      localDate: string;
      localTime?: string;
      dateTime?: string;
      dateTBD?: boolean;
      dateTBA?: boolean;
      timeTBA?: boolean;
      noSpecificTime?: boolean;
    };
    timezone?: string;
    status?: {
      code: string;
    };
  };
  priceRanges?: {
    min: number;
    max: number;
    currency: string;
  }[];
  classifications?: {
    primary?: boolean;
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    subGenre?: {
      id: string;
      name: string;
    };
  }[];
  _embedded?: {
    venues?: Venue[];
    attractions?: {
      id: string;
      name: string;
      type: string;
      url: string;
      images: {
        ratio: string;
        url: string;
        width: number;
        height: number;
        fallback: boolean;
      }[];
    }[];
  };
  popularity?: number;
  sales?: {
    public: {
      startDateTime: string;
      startTBD: boolean;
      endDateTime: string;
    };
  };
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

export function EventCard({ event }: { event: Event }) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Query for favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch("/api/favorites");
      return response.json();
    },
    enabled: !!user,
  });

  // Query for user events
  const { data: userEvents = [] } = useQuery({
    queryKey: ["userEvents"],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch("/api/user-events");
      return response.json();
    },
    enabled: !!user,
  });

  // Mutations
  const favoriteMutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event.id }),
        });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const eventStatusMutation = useMutation({
    mutationFn: async (status: "going" | "interested" | null) => {
      if (status === null) {
        await fetch("/api/user-events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event.id }),
        });
      } else {
        await fetch("/api/user-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, status }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });

  const isFavorite = favorites.some((fav: any) => fav.event.id === event.id);
  const userEvent = userEvents.find((ue: any) => ue.event.id === event.id);
  const eventStatus = userEvent?.status || null;

  const venue = event._embedded?.venues?.[0];
  const attraction = event._embedded?.attractions?.[0];
  const image =
    event.images.find((img) => img.ratio === "16_9") || event.images[0];
  const price = event.priceRanges?.[0]?.min;
  const date = event.dates?.start?.dateTime || event.dates?.start?.localDate;

  // Debug venue data
  console.log("Venue data:", venue);
  console.log("Venue address:", venue?.address);

  const toggleFavorite = useCallback(() => {
    if (!user) return;
    favoriteMutation.mutate(isFavorite);
  }, [user, isFavorite, favoriteMutation]);

  const toggleEventStatus = useCallback(
    (status: "going" | "interested") => {
      if (!user) return;
      eventStatusMutation.mutate(eventStatus === status ? null : status);
    },
    [user, eventStatus, eventStatusMutation]
  );

  return (
    <motion.div
      className="event-card"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      style={{
        border: "1px solid var(--mantine-color-dark-4)",
        borderRadius: "8px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--mantine-color-dark-7)",
      }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          overflow: "hidden",
        }}
      >
        <motion.img
          src={image.url}
          alt={event.name}
          variants={imageVariants}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {user && (
          <Tooltip
            label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <motion.div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                zIndex: 1,
              }}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <ActionIcon
                variant="filled"
                color={isFavorite ? "red" : "gray"}
                size="lg"
                radius="xl"
                onClick={toggleFavorite}
                loading={favoriteMutation.isPending}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFavorite ? "filled" : "outline"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isFavorite ? (
                      <IconHeartFilled size={20} />
                    ) : (
                      <IconHeart size={20} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </ActionIcon>
            </motion.div>
          </Tooltip>
        )}
      </div>
      <motion.div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--mantine-color-white)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {event.name}
        </motion.h3>
        {attraction && (
          <motion.p
            style={{
              margin: "0 0 8px 0",
              fontSize: "0.9rem",
              color: "var(--mantine-color-gray-4)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {attraction.name}
          </motion.p>
        )}
        <motion.div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "auto",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {date && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconCalendar size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          )}
          {venue && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconMapPin size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                {venue.address?.line1 ||
                  venue.address?.city?.name ||
                  "Location TBA"}
                {venue.address?.city?.name &&
                  venue.address?.state?.stateCode &&
                  `, ${venue.address.city.name}, ${venue.address.state.stateCode}`}
              </span>
            </div>
          )}
          {price && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconTicket size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                ${price}
              </span>
            </div>
          )}
        </motion.div>
        <Group gap="xs">
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            style={{ flex: 1 }}
          >
            <Button
              component={Link}
              href={`/event/${event.id}`}
              variant="light"
              color="blue"
              size="sm"
              leftSection={<IconInfoCircle size={16} />}
              fullWidth
            >
              View Details
            </Button>
          </motion.div>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            style={{ flex: 1 }}
          >
            <Button
              component="a"
              href={event.url}
              target="_blank"
              variant="filled"
              color="blue"
              size="sm"
              leftSection={<IconTicket size={16} />}
              fullWidth
            >
              Buy Tickets
            </Button>
          </motion.div>
        </Group>
        {user && (
          <Group gap="xs" mt="xs">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              style={{ flex: 1 }}
            >
              <Button
                variant={eventStatus === "going" ? "filled" : "light"}
                color={eventStatus === "going" ? "green" : "gray"}
                size="sm"
                loading={eventStatusMutation.isPending}
                onClick={() => toggleEventStatus("going")}
                fullWidth
              >
                {eventStatus === "going" ? "Going" : "Mark as Going"}
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              style={{ flex: 1 }}
            >
              <Button
                variant={eventStatus === "interested" ? "filled" : "light"}
                color={eventStatus === "interested" ? "yellow" : "gray"}
                size="sm"
                loading={eventStatusMutation.isPending}
                onClick={() => toggleEventStatus("interested")}
                fullWidth
              >
                {eventStatus === "interested"
                  ? "Interested"
                  : "Mark as Interested"}
              </Button>
            </motion.div>
          </Group>
        )}
        <motion.div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid var(--mantine-color-dark-4)",
            width: "100%",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <SocialInteractions eventId={event.id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
