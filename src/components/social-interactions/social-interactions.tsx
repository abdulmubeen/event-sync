import { useState } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconShare,
} from "@tabler/icons-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Type definitions for social interactions and user data
interface SocialInteraction {
  _id: string;
  userId: string;
  eventId: string;
  type: "like" | "comment" | "share";
  content?: string;
  createdAt: string;
}

interface UserName {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface SocialInteractionsProps {
  eventId: string;
}

export function SocialInteractions({ eventId }: SocialInteractionsProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Query for fetching social interactions with caching
  const { data: interactions = [] } = useQuery<SocialInteraction[]>({
    queryKey: ["interactions", eventId],
    queryFn: async () => {
      const response = await fetch(
        `/api/social/interactions?eventId=${eventId}`
      );
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Batch user data requests to reduce API calls
  const uniqueUserIds = [
    ...new Set(interactions.map((i: SocialInteraction) => i.userId)),
  ];
  const { data: userNames = {} } = useQuery<Record<string, UserName>>({
    queryKey: ["userNames", uniqueUserIds],
    queryFn: async () => {
      const names: Record<string, UserName> = {};
      await Promise.all(
        uniqueUserIds.map(async (userId: string) => {
          try {
            const response = await fetch(`/api/users/${userId}`);
            const userData = await response.json();
            names[userId] = userData;
          } catch (error) {
            console.error(`Error fetching user data for ${userId}:`, error);
            names[userId] = {
              id: userId,
              firstName: "User",
              lastName: userId.slice(0, 4),
              imageUrl: "",
            };
          }
        })
      );
      return names;
    },
    enabled: uniqueUserIds.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Mutation for creating new interactions with optimistic updates
  const interactionMutation = useMutation({
    mutationFn: async ({
      type,
      content,
    }: {
      type: "like" | "comment" | "share";
      content?: string;
    }) => {
      const response = await fetch("/api/social/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          type,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create interaction");
      }

      return response.json();
    },
    onMutate: async ({ type, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["interactions", eventId] });

      // Snapshot the previous value
      const previousInteractions = queryClient.getQueryData<
        SocialInteraction[]
      >(["interactions", eventId]);

      // Optimistically update to the new value
      if (previousInteractions) {
        const optimisticInteraction: SocialInteraction = {
          _id: `temp-${Date.now()}`,
          userId: user?.id || "",
          eventId,
          type,
          content,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<SocialInteraction[]>(
          ["interactions", eventId],
          [...previousInteractions, optimisticInteraction]
        );
      }

      // Return context with the snapshotted value
      return { previousInteractions };
    },
    onError: (err, newInteraction, context) => {
      // Roll back on error
      if (context?.previousInteractions) {
        queryClient.setQueryData(
          ["interactions", eventId],
          context.previousInteractions
        );
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["interactions", eventId] });
      if (newComment) {
        setNewComment("");
      }
    },
  });

  // Filter interactions by type
  const likes = (interactions as SocialInteraction[]).filter(
    (i) => i.type === "like"
  );
  const comments = (interactions as SocialInteraction[]).filter(
    (i) => i.type === "comment"
  );
  const hasLiked = likes.some((like) => like.userId === user?.id);

  // Handle interaction creation
  const handleInteraction = async (type: "like" | "comment" | "share") => {
    if (!user) return;

    if (type === "comment" && !newComment.trim()) {
      return;
    }

    interactionMutation.mutate({
      type,
      content: type === "comment" ? newComment.trim() : undefined,
    });
  };

  return (
    <Stack gap="xs">
      {/* Interaction buttons */}
      <Group>
        <Tooltip label={hasLiked ? "Unlike" : "Like"}>
          <ActionIcon
            variant={hasLiked ? "filled" : "light"}
            color={hasLiked ? "red" : "gray"}
            onClick={() => handleInteraction("like")}
            loading={interactionMutation.isPending}
            size="lg"
          >
            {hasLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
          </ActionIcon>
        </Tooltip>
        <Text size="sm" fw={500}>
          {likes.length}
        </Text>

        <Tooltip label={showComments ? "Hide comments" : "Show comments"}>
          <ActionIcon
            variant={showComments ? "filled" : "light"}
            color={showComments ? "blue" : "gray"}
            onClick={() => setShowComments(!showComments)}
            size="lg"
          >
            <IconMessage size={20} />
          </ActionIcon>
        </Tooltip>
        <Text size="sm" fw={500}>
          {comments.length}
        </Text>

        <Tooltip label="Share">
          <ActionIcon
            variant="light"
            color="gray"
            onClick={() => handleInteraction("share")}
            size="lg"
          >
            <IconShare size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Comments section */}
      {showComments && (
        <Paper p="md" withBorder>
          <Stack gap="md">
            {/* Comment input */}
            {user && (
              <Group gap="xs">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.currentTarget.value)}
                  minRows={1}
                  style={{ flex: 1 }}
                />
                <Button
                  size="sm"
                  onClick={() => handleInteraction("comment")}
                  loading={interactionMutation.isPending}
                >
                  Post
                </Button>
              </Group>
            )}
            {/* Comments list */}
            {comments.map((comment) => {
              const userName = userNames[comment.userId];
              return (
                <Paper key={comment._id} p="xs" withBorder>
                  <Group gap="xs" align="flex-start">
                    <Avatar size="sm" radius="xl" src={userName?.imageUrl} />
                    <Stack gap={0} style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {userName
                          ? `${userName.firstName} ${userName.lastName}`
                          : "Loading..."}
                      </Text>
                      <Text size="sm">{comment.content}</Text>
                      <Text size="xs" c="dimmed">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              );
            })}
            {/* Empty state */}
            {comments.length === 0 && (
              <Text c="dimmed" ta="center" py="xs">
                No comments yet. Be the first to comment!
              </Text>
            )}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
