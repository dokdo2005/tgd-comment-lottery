import axios from "axios";

export const commentListApi = async (boardId) => {
    const commentData = await axios.get(`https://i4eu2tbrk6.execute-api.ap-northeast-2.amazonaws.com/production/${boardId}`);
    return commentData.data.data;
}