import Http from "@/utils/http"

function retrievePost(param:{}) {
    return Http.post("/friendPost/retrieveFriendPost", param);
}

function post(param:{}) {
    Http.post("/friendPost.friendPost", param);
}

export default{retrievePost, post}