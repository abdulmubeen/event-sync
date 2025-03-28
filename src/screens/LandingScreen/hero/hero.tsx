import { Button, Container, Text, Title } from "@mantine/core";
import { Dots } from "./dots";
import classes from "./hero.module.css";
import Link from "next/link";

export function Hero() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to{" "}
          <Text component="span" className={classes.highlight} inherit>
            Event Sync
          </Text>
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Your Unified Event Discovery Platform
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
            component={Link}
            href={"/dashboard"}
          >
            Find an event near you
          </Button>
        </div>
      </div>
    </Container>
  );
}
