import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Form, Row, ListGroup, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { commentListApi } from "../features/api";
import {
  deleteDuplicateNickname,
  getLottery,
  filterList,
} from "../features/getList";
import LotteryListEntry from "./lotteryListEntry";
import SpinnerComponent from "./spinnerComponent";

function MainScreen() {
  const [nicknameList, setNicknameList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [lotteryList, setLotteryList] = useState([]);
  const [boardUrl, setBoardUrl] = useState(null);
  const [lotteryNumber, setLotteryNumber] = useState(null);
  const [excludeStreamer, setStreamerExec] = useState(false);
  const [excludeMod, setModExec] = useState(false);
  const [onlySecret, setSecretOnly] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDone, setLoadingDone] = useState(false);
  const boardUrlRef = useRef();
  const lotteryNumberRef = useRef();

  const getCommentList = async (boardUrl) => {
    const parsedBoardUrl = boardUrl.split("?")[0];
    const validateUrl = /https?:\/\/(www.)?tgd.kr\/s\//i.test(parsedBoardUrl);
    const boardId = parsedBoardUrl.split("/")[5];
    const validateBoardId = /^[1-9][0-9]{7}$/.test(boardId);

    if (!validateUrl || !validateBoardId) {
      alert("올바른 주소가 아닙니다!");
    } else {
      setLoadingDone(false);
      setLoading(true);
      const commentList = await commentListApi(boardId);
      setLoadingDone(true);
      if (commentList.length === 0) {
        alert("작성 된 댓글이 없습니다!");
        setLoading(false);
        setLoadingDone(false);
      } else {
        const newNicknameArr = deleteDuplicateNickname(commentList);
        setNicknameList(
          filterList(newNicknameArr, {
            excludeStreamer,
            excludeMod,
            onlySecret,
          })
        );
        setOriginalList(newNicknameArr);
        setLotteryNumber(null);
        lotteryNumberRef.current.value = null;
        setLotteryList([]);
        setLoading(false);
      }
    }
  };

  const deleteCommentList = (id) => {
    setNicknameList(nicknameList.filter((el) => el.id !== id));
    setLotteryNumber(null);
    lotteryNumberRef.current.value = null;
    setLotteryList([]);
  };

  useEffect(() => {
    setNicknameList(
      filterList(originalList, { excludeStreamer, excludeMod, onlySecret })
    );
  }, [excludeStreamer, excludeMod, onlySecret]);

  useEffect(() => {
    if (!boardUrl) {
      setNicknameList([]);
      setOriginalList([]);
      setLotteryNumber(null);
      lotteryNumberRef.current.value = null;
      setLotteryList([]);
      setStreamerExec(false);
      setModExec(false);
      setSecretOnly(false);
      setLoadingDone(false);
    }
  }, [boardUrl]);

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col xs={10}>
              <Form.Control
                ref={boardUrlRef}
                disabled={isLoading && !isLoadingDone}
                placeholder={"게시물 주소 입력"}
                style={{ width: "100%" }}
                onChange={() => setBoardUrl(boardUrlRef.current.value)}
              />
            </Col>
            <Col>
              <Button
                disabled={
                  !boardUrl || (boardUrl && isLoading && !isLoadingDone)
                }
                style={{ width: "100%" }}
                onClick={() => getCommentList(boardUrl)}
              >
                <FontAwesomeIcon icon={faFileDownload} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Form.Text>
              게시물 주소를 입력해주세요. ex) https://tgd.kr/s/se_0n/62744799
            </Form.Text>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type={"switch"}
                disabled={
                  !boardUrl || (boardUrl && isLoading && !isLoadingDone)
                }
                label={"스트리머 제외"}
                checked={excludeStreamer}
                onChange={() => setStreamerExec(!excludeStreamer)}
              />
            </Col>
            <Col>
              <Form.Check
                type={"switch"}
                disabled={
                  !boardUrl || (boardUrl && isLoading && !isLoadingDone)
                }
                label={"매니저 제외"}
                checked={excludeMod}
                onChange={() => setModExec(!excludeMod)}
              />
            </Col>
            <Col>
              <Form.Check
                type={"switch"}
                disabled={
                  !boardUrl || (boardUrl && isLoading && !isLoadingDone)
                }
                label={"비밀 댓글만"}
                checked={onlySecret}
                onChange={() => setSecretOnly(!onlySecret)}
              />
            </Col>
          </Row>
          {isLoading || nicknameList.length > 0 ? (
            <>
              <Row>&nbsp;</Row>
              <Row>
                <Col>
                  <b>전체 목록</b>
                </Col>
              </Row>
            </>
          ) : null}
          <ListGroup>
            {isLoading ? (
              <SpinnerComponent />
            ) : (
              nicknameList.map((element) => (
                <LotteryListEntry
                  entry={element}
                  deleteList={deleteCommentList}
                  showDelete={true}
                  deleteAvailable={nicknameList.length > 1 ? true : false}
                  key={element.id}
                />
              ))
            )}
          </ListGroup>
        </Col>
        <Col>
          <Row>
            <Col xs={10}>
              <Form.Control
                ref={lotteryNumberRef}
                disabled={
                  !boardUrl ||
                  !isLoadingDone ||
                  isLoading ||
                  nicknameList.length <= 1
                }
                placeholder={"추첨 인원 수 입력"}
                style={{ width: "100%" }}
                onChange={() =>
                  setLotteryNumber(lotteryNumberRef.current.value)
                }
              />
            </Col>
            <Col>
              <Button
                disabled={
                  !lotteryNumber ||
                  !isLoadingDone ||
                  isLoading ||
                  Number(lotteryNumber) <= 0 ||
                  !Number.isInteger(Number(lotteryNumber)) ||
                  Number(lotteryNumber) >= nicknameList.length ||
                  nicknameList.length <= 1
                }
                style={{ width: "100%" }}
                onClick={() =>
                  setLotteryList(getLottery(nicknameList, lotteryNumber))
                }
              >
                <FontAwesomeIcon icon={faShuffle} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Form.Text>추첨 할 인원 수를 입력해주세요.</Form.Text>
          </Row>
          {lotteryList.length > 0 ? (
            <>
              <Row>&nbsp;</Row>
              <Row>
                <Col>
                  <b>당첨자 목록</b>
                </Col>
              </Row>
              <Row>
                <Form.Text>당첨을 축하합니다!</Form.Text>
              </Row>
            </>
          ) : null}
          <ListGroup>
            {lotteryList.map((element) => (
              <LotteryListEntry entry={element} key={element.id} />
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default MainScreen;
