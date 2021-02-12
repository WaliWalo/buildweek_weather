import React from "react";
import { Container, Row } from "react-bootstrap";
import { IMainProps } from "../../types";

export default function Main(props: IMainProps) {
  return (
    <div>
      <Container>
        {props.weather && (
          <>
            <Row>
              <h1>{props.weather.name}</h1>
            </Row>
            <Row style={{ marginTop: "20%" }}>
              <h2>{props.weather.current.temp} °C</h2>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
