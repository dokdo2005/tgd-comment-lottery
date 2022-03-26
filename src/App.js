import { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [nicknameList, setNicknameList] = useState([]);
  const [lotteryList, setLotteryList] = useState([]);
  const [boardNumber, setBoardNumber] = useState(null);
  const [lotteryNumber, setLotteryNumber] = useState(null);
  const boardNumberRef = useRef();
  const lotteryNumberRef = useRef();

  const getCommentList = async (boardId) => {
    if (!boardId) {
      alert('게시물 ID를 입력해주세요!');
    } else {
      const commentData = await axios.get(`https://i4eu2tbrk6.execute-api.ap-northeast-2.amazonaws.com/production/${boardId}`);
      const commentList = commentData.data.data;
      if (commentList.length === 0) {
        alert('작성 된 댓글이 없습니다!');
      } else {
        let nicknameTmpArr = [];
        for (let i in commentList) {
          if (!nicknameTmpArr.includes(commentList[i].nickname)) {
            nicknameTmpArr.push(commentList[i].nickname);
          }
        }
        setNicknameList(nicknameTmpArr);
        setLotteryNumber(null);
        lotteryNumberRef.current.value = null;
        setLotteryList([]);
      }
    }
  };

  const getLotteryList = (lotteryCount) => {
    if (nicknameList.length === 0) {
      alert("전체 리스트가 비어있습니다!")
    } else if (!lotteryCount || lotteryCount === "0") {
      alert("당첨 인원 수를 입력해주세요!")
    } else if (Number(lotteryCount) > nicknameList.length) {
      alert("당첨 인원 수는 전체 리스트 수 보다 클 수 없습니다.")
    } else {
      let totalList = [];
      let totalCount = 0;
      do {
        const lotteryIndex = Math.floor(Math.random() * ((nicknameList.length - 1) + 1));
        if (!totalList.includes(nicknameList[lotteryIndex])) {
          totalList.push(nicknameList[lotteryIndex]);
          totalCount++;
        }
      } while (totalCount < lotteryCount);
      setLotteryList(totalList);
    }
  }

  return (
    <div className="App">
      <h1>트게더 댓글 추첨기</h1>
      <input ref={boardNumberRef} placeholder={'게시물 ID 입력'} onChange={() => setBoardNumber(boardNumberRef.current.value)} />
      <button onClick={() => getCommentList(boardNumber)}>전체 리스트 가져오기</button>
      <ul>
        {nicknameList.map((element) => (
          <li>{element}</li>
        ))}
      </ul>
      <input ref={lotteryNumberRef} placeholder={'당첨 인원 수 입력'} onChange={() => setLotteryNumber(lotteryNumberRef.current.value)} />
      <button onClick={() => getLotteryList(lotteryNumber)}>추첨하기</button>
      <ul>
        {lotteryList.map((element) => (
          <li>{element}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
