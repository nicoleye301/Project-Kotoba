export function getDisplayName(friend: { username: string }, nickname?: string): string {
    return nickname?.trim() || friend.username;
}
