"use client";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./signup.module.css";
import Link from "next/link";

export default function Signup() {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to Event Sync!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} href="/login">
          Log In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm Your password"
          required
          mt="md"
        />
        <Button fullWidth mt="xl">
          Sign Up
        </Button>
      </Paper>
    </Container>
  );
}
