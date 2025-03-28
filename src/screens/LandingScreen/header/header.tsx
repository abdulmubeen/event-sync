"use client";

import {
  Anchor,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Text,
  UnstyledButton,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import classes from "./header.module.css";
import {
  SignedIn,
  SignedOut,
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  IconBell,
  IconSearch,
  IconMapPin,
  IconCalendar,
  IconHeart,
} from "@tabler/icons-react";

export function Header() {
  // Hook for managing the mobile drawer state
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box pb={120}>
      {/* Main header container */}
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* Logo section */}
          <UnstyledButton component={Link} href="/" className={classes.logo}>
            <Text fw={700}>
              eventsync
              <Text span fw={500}>
                .com
              </Text>{" "}
            </Text>
          </UnstyledButton>

          {/* Desktop navigation links */}
          <Group h="100%" gap={0} visibleFrom="sm">
            <Anchor component={Link} href="/" className={classes.link}>
              Home
            </Anchor>
            {/* Protected routes - only visible when signed in */}
            <SignedIn>
              <Anchor
                component={Link}
                href="/dashboard"
                className={classes.link}
              >
                Find Events
              </Anchor>
              <Anchor
                component={Link}
                href="/favorites"
                className={classes.link}
              >
                Favorites
              </Anchor>
              <Anchor
                component={Link}
                href="/my-events"
                className={classes.link}
              >
                My Events
              </Anchor>
            </SignedIn>
          </Group>

          {/* Authentication buttons and user profile */}
          <Group visibleFrom="sm">
            {/* Sign in/up buttons - only visible when signed out */}
            <SignedOut>
              <ClerkSignInButton>
                <Button variant="default">Log in</Button>
              </ClerkSignInButton>
              <ClerkSignUpButton>
                <Button variant="primary">Sign up</Button>
              </ClerkSignUpButton>
            </SignedOut>
            {/* User profile button - only visible when signed in */}
            <SignedIn>
              <Group gap="xs">
                <UserButton />
              </Group>
            </SignedIn>
          </Group>

          {/* Mobile menu toggle button */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      {/* Mobile drawer menu */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          {/* Mobile navigation links */}
          <Flex direction="column" gap={25} py="md">
            <Anchor component={Link} href="/" className={classes.link}>
              Home
            </Anchor>
            {/* Protected routes in mobile menu */}
            <SignedIn>
              <Anchor
                component={Link}
                href="/dashboard"
                className={classes.link}
              >
                Find Events
              </Anchor>
              <Anchor
                component={Link}
                href="/favorites"
                className={classes.link}
              >
                Favorites
              </Anchor>
              <Anchor
                component={Link}
                href="/my-events"
                className={classes.link}
              >
                My Events
              </Anchor>
            </SignedIn>
          </Flex>

          <Divider my="sm" />

          {/* Mobile authentication buttons */}
          <Group justify="center" grow pb="xl" px="md" py="md">
            <SignedOut>
              <ClerkSignInButton>
                <Button variant="default">Log in</Button>
              </ClerkSignInButton>
              <ClerkSignUpButton>
                <Button variant="primary">Sign up</Button>
              </ClerkSignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
