export const deleteDuplicateNickname = (commentList) => {
    let newNicknameArr = [];
    let idListArr = [];
    for (let i in commentList) {
      const { user_id } = commentList[i];
      if (!idListArr.includes(user_id)) {
        idListArr.push(user_id);
        newNicknameArr.push(commentList[i]);
      }
    }
    return newNicknameArr;
}