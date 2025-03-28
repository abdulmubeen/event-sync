import { IconMapPin, IconBuilding, IconClock } from "@tabler/icons-react";
import { Button, Group } from "@mantine/core";
import Link from "next/link";

export type Venue = {
  id: string;
  name: string;
  type: string;
  locale: string;
  address: {
    line1: string;
    line2?: string;
    line3?: string;
    city: {
      name: string;
    };
    state: {
      name: string;
      stateCode: string;
    };
    postalCode: string;
    country: {
      name: string;
      countryCode: string;
    };
  };
  location: {
    longitude: string;
    latitude: string;
  };
  timezone: string;
  upcomingEvents: {
    _total: number;
  };
  url: string;
  images?: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
};

export function VenueCard({ venue }: { venue: Venue }) {
  if (!venue) {
    return null;
  }

  const image = venue.images?.[0];
  const address = venue.address;
  const city = address?.city;
  const state = address?.state;
  const postalCode = address?.postalCode;

  return (
    <div
      style={{
        border: "1px solid var(--mantine-color-dark-4)",
        borderRadius: "8px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        backgroundColor: "var(--mantine-color-dark-7)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {image && (
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <img
            src={image.url}
            alt={venue.name}
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
      )}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--mantine-color-white)",
          }}
        >
          {venue.name}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {address?.line1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconMapPin size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                {address.line1}
                {address.line2 && `, ${address.line2}`}
                {address.line3 && `, ${address.line3}`}
              </span>
            </div>
          )}
          {(city?.name || state?.stateCode || postalCode) && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconBuilding size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                {[city?.name, state?.stateCode, postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {venue.timezone && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconClock size={16} color="var(--mantine-color-gray-4)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--mantine-color-gray-4)",
                }}
              >
                {venue.timezone}
              </span>
            </div>
          )}
        </div>
        <Group gap="xs">
          <Button
            component={Link}
            href={`/venue/${venue.id}`}
            variant="light"
            color="blue"
            size="sm"
            fullWidth
          >
            View Details
          </Button>
          <Button
            component="a"
            href={venue.url}
            target="_blank"
            variant="filled"
            color="blue"
            size="sm"
            fullWidth
          >
            View on Ticketmaster
          </Button>
        </Group>
      </div>
    </div>
  );
}
