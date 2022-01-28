import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { envSettings } from "./envSettings";

interface IMeasurement {
  dateTime: string;
  value: number;
}

export const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    fetch(
      new Request(envSettings.apiBaseUrl + "/Measurements?metricKey=foo_bar")
    )
      .then((response) => response.json().then((data) => setMeasurements(data)))
      .catch((err) => setErrorMessage(JSON.stringify(err)));
  }, []);

  // TEMP

  return (
    <>
      <Title>Metrix</Title>
      {measurements.length > 0 ? (
        <ul>
          {measurements.map((m) => (
            <li key={m.dateTime}>
              {m.dateTime}: {m.value}
            </li>
          ))}
        </ul>
      ) : null}
      {errorMessage ? <Error>{errorMessage}</Error> : null}
    </>
  );
};

const Title = styled.h1`
  color: darkgreen;
`;

const Error = styled.div`
  color: darkred;
`;
