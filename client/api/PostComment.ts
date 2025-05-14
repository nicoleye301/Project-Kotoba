import Http from "@/utils/http"

export interface CommentParameters {
    postId: number;
    senderId: number;
    content: string;
}

export interface Comment {
    id: number;
    postId: number;
    senderId: number;
    content: string;
    postTime: string;
}

export async function retrieveComment(postId: number): Promise<Comment[]> {
    const postComment = await Http.get(`postComment/retrievePostComment?postId=${postId}`);

    return postComment.map((comment: any) => ({
        id: comment.id,
        postId: comment.postId,
        senderId: comment.senderId,
        content: comment.content,
        postTime: comment.postTime,
    }));
}

export async function comment(param: CommentParameters): Promise<Comment> {
    const comment = await Http.post("postComment/commentPostComment", param);
    return {
        id: comment.id,
        postId: comment.postId,
        senderId: comment.senderId,
        content: comment.content,
        postTime: comment.postTime,
    };
}

export default{retrieveComment, comment}