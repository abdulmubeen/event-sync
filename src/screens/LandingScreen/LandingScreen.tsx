import { ContactForm } from "@/screens/LandingScreen/contact-form/contact";
import { Features } from "@/screens/LandingScreen/features/features";
import { Footer } from "@/screens/LandingScreen/footer/footer";
import { Hero } from "@/screens/LandingScreen/hero/hero";
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Card,
  Image,
  Badge,
  Button,
  Grid,
  Avatar,
  Blockquote,
  Paper,
  rem,
  useMantineTheme,
  RingProgress,
  Center,
  Box,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconMapPin,
  IconTicket,
  IconStar,
  IconUsers,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconHeart,
  IconMusic,
  IconPalette,
  IconDeviceGamepad,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { motion as m, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Organizer",
    content:
      "Event Sync has revolutionized how I manage my events. The social features make it easy to engage with attendees!",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Michael Chen",
    role: "Event Enthusiast",
    content:
      "I love discovering new events and connecting with other attendees. The platform is intuitive and user-friendly.",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Emma Davis",
    role: "Professional Networker",
    content:
      "The social features have helped me build valuable connections in the event industry. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const categories = [
  { icon: IconMusic, name: "Music", color: "violet" },
  { icon: IconPalette, name: "Arts", color: "pink" },
  { icon: IconDeviceGamepad, name: "Gaming", color: "green" },
  { icon: IconCalendarEvent, name: "Festivals", color: "blue" },
  { icon: IconBuildingCommunity, name: "Community", color: "yellow" },
  { icon: IconHeart, name: "Social", color: "teal" },
];

const stats = [
  { label: "Active Users", value: 10000, icon: IconUsers },
  { label: "Events Listed", value: 5000, icon: IconCalendarEvent },
  { label: "Venues", value: 1000, icon: IconBuildingCommunity },
  { label: "Happy Attendees", value: 50000, icon: IconHeart },
];

function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);

      setCount(Math.floor(value * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

function Statistics() {
  const theme = useMantineTheme();

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <m.div variants={itemVariants}>
            <Title order={2} ta="center" mb="md">
              Our Impact
            </Title>
            <Text c="dimmed" ta="center" maw={600} mx="auto">
              Join our growing community of event enthusiasts and organizers
            </Text>
          </m.div>

          <Grid>
            {stats.map((stat, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                <m.div variants={itemVariants}>
                  <Paper
                    shadow="sm"
                    p="xl"
                    radius="md"
                    style={{
                      background: `linear-gradient(45deg, ${
                        theme.colors[theme.primaryColor][6]
                      }, ${theme.colors[theme.primaryColor][8]})`,
                    }}
                  >
                    <Stack align="center" gap="xs">
                      <stat.icon size={32} color="white" />
                      <Text size="xl" fw={700} c="white">
                        <AnimatedCounter value={stat.value} />
                      </Text>
                      <Text size="sm" c="white" ta="center">
                        {stat.label}
                      </Text>
                    </Stack>
                  </Paper>
                </m.div>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    </m.div>
  );
}

function EventCategories() {
  const [activeCategory, setActiveCategory] = useState(0);
  const theme = useMantineTheme();
  const CategoryIcon = categories[activeCategory].icon;

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <m.div variants={itemVariants}>
            <Title order={2} ta="center" mb="md">
              Explore Event Categories
            </Title>
            <Text c="dimmed" ta="center" maw={600} mx="auto">
              Discover events that match your interests
            </Text>
          </m.div>

          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="xl">
              <Group justify="space-between">
                <ActionIcon
                  variant="light"
                  color="blue"
                  size="lg"
                  radius="xl"
                  onClick={() =>
                    setActiveCategory((prev) =>
                      prev > 0 ? prev - 1 : categories.length - 1
                    )
                  }
                >
                  <IconChevronLeft size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="blue"
                  size="lg"
                  radius="xl"
                  onClick={() =>
                    setActiveCategory((prev) =>
                      prev < categories.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  <IconChevronRight size={20} />
                </ActionIcon>
              </Group>

              <AnimatePresence mode="wait">
                <m.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Center>
                    <Stack align="center" gap="md">
                      <Box
                        style={{
                          width: rem(120),
                          height: rem(120),
                          borderRadius: "50%",
                          background: `linear-gradient(45deg, ${
                            theme.colors[categories[activeCategory].color][6]
                          }, ${
                            theme.colors[categories[activeCategory].color][8]
                          })`,
                        }}
                        p="md"
                      >
                        <Center h="100%">
                          <CategoryIcon size={48} color="white" />
                        </Center>
                      </Box>
                      <Title order={3}>{categories[activeCategory].name}</Title>
                      <Text c="dimmed" ta="center">
                        Discover amazing{" "}
                        {categories[activeCategory].name.toLowerCase()} events
                      </Text>
                      <Button
                        variant="light"
                        color={categories[activeCategory].color}
                        size="sm"
                        radius="xl"
                        component="a"
                        href={`/dashboard`}
                      >
                        Browse Events
                      </Button>
                    </Stack>
                  </Center>
                </m.div>
              </AnimatePresence>

              <Group justify="center" gap="xs">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Tooltip key={index} label={category.name}>
                      <ActionIcon
                        variant={activeCategory === index ? "filled" : "light"}
                        color={category.color}
                        size="sm"
                        radius="xl"
                        onClick={() => setActiveCategory(index)}
                      >
                        <Icon size={16} />
                      </ActionIcon>
                    </Tooltip>
                  );
                })}
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </m.div>
  );
}

function Testimonials() {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Container
        size="lg"
        py="xl"
        bg="var(--mantine-color-dark-8)"
        style={{ borderRadius: "8px" }}
      >
        <Stack gap="xl">
          <m.div variants={itemVariants}>
            <Title order={2} ta="center" mb="md">
              What Our Users Say
            </Title>
            <Text c="dimmed" ta="center" maw={600} mx="auto">
              Join thousands of event enthusiasts who are already using Event
              Sync
            </Text>
          </m.div>

          <Grid>
            {testimonials.map((testimonial, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                <m.div variants={itemVariants}>
                  <Blockquote
                    cite={`- ${testimonial.name}`}
                    icon={<IconStar size={24} />}
                    color="blue"
                    radius="md"
                    p="md"
                  >
                    {testimonial.content}
                    <Text size="sm" c="dimmed" mt="xs">
                      {testimonial.role}
                    </Text>
                  </Blockquote>
                </m.div>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    </m.div>
  );
}

export default function LandingScreen() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Features />
      <Statistics />
      <EventCategories />
      <Testimonials />
      <ContactForm />
      <Footer />
    </m.div>
  );
}
