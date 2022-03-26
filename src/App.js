import { useState, useRef } from "react";
import {
  Spinner,
  Button,
  Col,
  Form,
  Row,
  ListGroup,
  Container,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faShuffle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  const [nicknameList, setNicknameList] = useState([]);
  const [lotteryList, setLotteryList] = useState([]);
  const [boardUrl, setBoardUrl] = useState(null);
  const [lotteryNumber, setLotteryNumber] = useState(null);
  const [excludeStreamer, setStreamerExec] = useState(false);
  const [excludeMod, setModExec] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDrawing, setDrawing] = useState(false);
  const boardUrlRef = useRef();
  const lotteryNumberRef = useRef();
  const streamerRef = useRef();
  const modRef = useRef();

  const getCommentList = async (boardUrl) => {
    const validateUrl = /https?:\/\/(www.)?tgd.kr\/s\//g.test(boardUrl);
    if (!boardUrl || boardUrl === "0") {
      alert("게시물 주소를 입력해주세요!");
      setNicknameList([]);
      setLotteryNumber(null);
      lotteryNumberRef.current.value = null;
      setLotteryList([]);
    } else if (!validateUrl) {
      alert("올바른 주소가 아닙니다!");
      setNicknameList([]);
      setLotteryNumber(null);
      lotteryNumberRef.current.value = null;
      setLotteryList([]);
    } else {
      setLoading(true);
      const boardId = boardUrl.split("/")[5].split("?")[0];
      const commentData = await axios.get(
        `https://i4eu2tbrk6.execute-api.ap-northeast-2.amazonaws.com/production/${boardId}`
      );
      const commentList = commentData.data.data;
      if (commentList.length === 0) {
        alert("작성 된 댓글이 없습니다!");
        setLoading(false);
        setNicknameList([]);
        setLotteryNumber(null);
        lotteryNumberRef.current.value = null;
        setLotteryList([]);
      } else {
        let newNicknameArr = [];
        let idListArr = [];
        for (let i in commentList) {
          const userId = commentList[i].user_id;
          if (!idListArr.includes(userId)) {
            idListArr.push(userId);
            newNicknameArr.push(commentList[i]);
          }
        }
        setNicknameList(newNicknameArr);
        setLotteryNumber(null);
        lotteryNumberRef.current.value = null;
        setLotteryList([]);
        setLoading(false);
      }
    }
  };

  const getLotteryList = (lotteryCount) => {
    if (nicknameList.length === 0) {
      alert("전체 리스트가 비어있습니다!");
    } else if (!lotteryCount || Number(lotteryCount) === 0) {
      alert("추첨 인원 수를 입력해주세요!");
    } else if (Number(lotteryCount) > nicknameList.length) {
      alert("추첨 인원 수는 전체 리스트 수 보다 클 수 없습니다.");
    } else {
      let totalList = [];
      let randomList = [];
      let totalCount = 0;
      setDrawing(true);
      do {
        const lotteryIndex = Math.floor(Math.random() * nicknameList.length);
        if (!randomList.includes(lotteryIndex)) {
          randomList.push(lotteryIndex);
          totalList.push(nicknameList[lotteryIndex]);
          totalCount++;
        }
      } while (totalCount < Number(lotteryCount));
      setLotteryList(totalList);
      setDrawing(false);
    }
  };

  return (
    <div className="App">
      <h1>트게더 댓글 추첨기</h1>
      <div>&nbsp;</div>
      <Container>
        <Row>
          <Col>
            <Row>
              <Col xs={10}>
                <Form.Control
                  ref={boardUrlRef}
                  placeholder={"게시물 주소 입력"}
                  onChange={() => setBoardUrl(boardUrlRef.current.value)}
                />
              </Col>
              <Col>
                <Button onClick={() => getCommentList(boardUrl)}>
                  <FontAwesomeIcon icon={faFileDownload} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Text>
                게시물 주소를 입력해주세요. ex) https://tgd.kr/s/se_0n/62744799
              </Form.Text>
            </Row>
            <Row>&nbsp;</Row>
            <Row>
              <Col>
                <b>전체 목록</b>
              </Col>
            </Row>
            <ListGroup>
              {isLoading ? (
                <ListGroup.Item>
                  <Spinner animation="border" />
                </ListGroup.Item>
              ) : (
                nicknameList.map((element) => (
                  <ListGroup.Item>{element.nickname}</ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Col>
          <Col>
            <Row>
              <Col xs={10}>
                <Form.Control
                  ref={lotteryNumberRef}
                  placeholder={"추첨 인원 수 입력"}
                  onChange={() =>
                    setLotteryNumber(lotteryNumberRef.current.value)
                  }
                />
              </Col>
              <Col>
                <Button onClick={() => getLotteryList(lotteryNumber)}>
                  <FontAwesomeIcon icon={faShuffle} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Text>추첨 할 인원 수를 입력해주세요.</Form.Text>
            </Row>
            <Row>&nbsp;</Row>
            <Row>
              <Col>
                <b>당첨자 목록</b>
              </Col>
            </Row>
            <ListGroup>
              {isDrawing ? (
                <ListGroup.Item>
                  <Spinner animation="border" />
                </ListGroup.Item>
              ) : (
                lotteryList.map((element) => (
                  <ListGroup.Item>{element.nickname}</ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <div>
        <div>&nbsp;</div>
        <div>Made By 김뷰엘 with ❤️</div>
      </div>
    </div>
  );
}

export default App;
