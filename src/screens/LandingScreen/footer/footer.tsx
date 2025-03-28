import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Container,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import classes from "./footer.module.css";
import Link from "next/link";

export function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <UnstyledButton component={Link} href="/" className={classes.logo}>
          <Text fw={700}>
            eventsync
            <Text span fw={500}>
              .com
            </Text>{" "}
          </Text>
        </UnstyledButton>
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
