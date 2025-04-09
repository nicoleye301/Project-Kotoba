export interface Post {
    id: number;
    posterId: number;
    content: string;
    postTime: string;
    imageURL?: string;
}

export interface Comment {
    id: number;
    postId: number;
    senderId: number;
    content: string;
    postTime: string;
}

export type AvatarStructure = {
    url: string;
    username: string;
}
