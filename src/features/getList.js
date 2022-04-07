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
}

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
}

export const filterList = (list, excludeStreamer, excludeMod) => {
  let filteredList = [];
  if (list.length > 0) {
    if (excludeStreamer && !excludeMod) {
      filteredList = list.filter((el) => !el.broadcaster);
    } else if (!excludeStreamer && excludeMod) {
      filteredList = list.filter((el) => !el.moderator);
    } else if (excludeStreamer && excludeMod) {
      filteredList = list.filter(
        (el) => !el.broadcaster && !el.moderator
      );
    } else {
      filteredList = list.concat([]);
    }
  }
  return filteredList;
}