import { Card, Skeleton, Stack } from "@mantine/core";

export function LoadingSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section>
        <Skeleton height={200} />
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ height: "calc(100% - 200px)" }}>
        <Skeleton height={24} width="80%" />
        <Skeleton height={16} width="60%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={32} mt="auto" />
      </Stack>
    </Card>
  );
}
