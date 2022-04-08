import React from "react";
import { ListGroup, Spinner } from "react-bootstrap";

function SpinnerComponent() {
  return (
    <ListGroup.Item>
      <Spinner animation="border" />
    </ListGroup.Item>
  );
}

export default SpinnerComponent;
