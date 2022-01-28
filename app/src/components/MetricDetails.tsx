import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IMeasurement } from "../serverApi/IMeasurement";
import { envSettings } from "../envSettings";
import { useParams } from "react-router";
import { ServerApi } from "../serverApi/ServerApi";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();

  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    new ServerApi(envSettings.apiBaseUrl)
      .getMeasurements(metricKey)
      .then((data) => {
        setMeasurements(data);
      })
      .catch((err) => {
        setErrorMessage(typeof err === "string" ? err : JSON.stringify(err));
      });
  }, []);

  return (
    <>
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

const Error = styled.div`
  color: darkred;
`;
