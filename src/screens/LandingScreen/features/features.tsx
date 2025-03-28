import {
  Container,
  Image,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconSearch,
  IconSitemap,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import classes from "./features.module.css";

const data = [
  {
    image: IconUser,
    title: "Personalized Event Discovery",
    description: "Your events, your way",
  },
  {
    image: IconSitemap,
    title: "Manage Your Events Effortlessly",
    description: "Stay organized with all your events in one place",
  },
  {
    image: IconUsersGroup,
    title: "Your Social Hub for Events",
    description: "Find, share, and experience events with friends",
  },
  {
    image: IconSearch,
    title: "Unified Search",
    description:
      "Find the best events from multiple platforms using one powerful search tool",
  },
];

export function Features() {
  const items = data.map((item, index) => (
    <div className={classes.item} key={index}>
      <ThemeIcon
        variant="light"
        className={classes.itemIcon}
        size={60}
        radius="md"
      >
        <item.image />
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Why EventSync?</Text>

      <Title className={classes.title} order={2}>
        EventSync is <span className={classes.highlight}>not</span> just for
        event enthusiasts
      </Title>

      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          Discover events across multiple platforms, all in one place. Whether
          you're looking for a concert, conference, meetup, or anything in
          between, EventSync brings everything to your fingertips with
          personalized recommendations, and easy event management.
        </Text>
      </Container>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
