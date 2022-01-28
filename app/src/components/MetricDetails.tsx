import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IMeasurement } from "../serverApi/IMeasurement";
import { ServerApi } from "../serverApi/IMetric";
import { envSettings } from "../envSettings";

export const MetricDetails: React.FC = () => {
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    new ServerApi(envSettings.apiBaseUrl)
      .getMeasurements("foo_bar")
      .then((data) => {
        setMeasurements(data);
      })
      .catch((err) => {
        setErrorMessage(typeof err === "string" ? err : JSON.stringify(err));
      });
  }, []);

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
