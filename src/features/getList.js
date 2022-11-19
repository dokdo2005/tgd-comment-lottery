export const deleteDuplicateNickname = (list) => {
  let newNicknameArr = [];
  let idListArr = [];
  for (let i in list) {
    const { user_id } = list[i];
    if (!idListArr.includes(user_id)) {
      idListArr.push(user_id);
      newNicknameArr.push(list[i]);
    }
  }
  return newNicknameArr;
};

export const getLottery = (list, count) => {
  let totalList = [];
  let randomList = [];
  let totalCount = 0;
  do {
    const lotteryIndex = Math.floor(Math.random() * list.length);
    if (!randomList.includes(lotteryIndex)) {
      randomList.push(lotteryIndex);
      totalList.push(list[lotteryIndex]);
      totalCount++;
    }
  } while (totalCount < Number(count));
  return totalList;
};

export const filterList = (
  list,
  { excludeStreamer, excludeMod, onlySecret }
) => {
  let filteredList = [...list];
  if (list.length > 0) {
    if (excludeStreamer)
      filteredList = filteredList.filter((el) => !el.broadcaster);
    if (excludeMod) filteredList = filteredList.filter((el) => !el.moderator);
    if (onlySecret) filteredList = filteredList.filter((el) => el.secret);
  }
  return filteredList;
};
