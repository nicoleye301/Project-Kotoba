import Http from "@/utils/http"

export interface PostParameters {
    posterId: number;
    content: string;
}

export interface Post {
    id: number;
    posterId: number;
    imageURL: string;
    content: string;
    postTime: string;
}

export async function retrievePost(posterId: number): Promise<Post[]> {
    const friendsPost = await Http.get(`friendPost/retrieveFriendPost?posterId=${posterId}`);

    return friendsPost.map((post: any) => ({
        id: post.id,
        posterId: post.posterId,
        imageURL: post.imageURL,
        content: post.content,
        postTime: post.postTime,
        }));
}

export async function post(param: PostParameters) : Promise<Post> {
    const post = await Http.post("/friendPost/postFriendPost", param);
    return {
        id: post.id,
        posterId: post.posterId,
        imageURL: post.imageURL,
        content: post.content,
        postTime: post.postTime,
    };
}

export default{retrievePost, post}