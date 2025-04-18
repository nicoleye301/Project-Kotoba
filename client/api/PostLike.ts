import Http from "@/utils/http"

export interface LikeParameters {
    postId: number;
    senderId: number;
}

export interface Like {
    id: number;
    postId: number;
    senderId: number;
    content: string;
}

export async function retrieveLikes(postId: number): Promise<Like[]> {
    const postLike = await Http.get(`likePost/retrievePostLikes?postId=${postId}`);

    return postLike.map((like: any) => ({
        id: like.id,
        postId: like.postId,
        senderId: like.senderId,
        content: like.contet,

    }))
}

export async function like(param: LikeParameters): Promise<Like> {
    const like = await Http.post("likePost/likePost", param);
    return {
        id: like.id,
        postId: like.postId,
        senderId: like.senderId,
        content: like.content,
    };
}

export async function dislike(param: LikeParameters): Promise<Like> {
    const dislike = await Http.post("likePost/dislikePost", param);
    return {
        id: dislike.id,
        postId: dislike.postId,
        senderId: dislike.senderId,
        content: dislike.content,
    }
}

export default{retrieveLikes, like, dislike}