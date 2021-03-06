import * as React from "react";
import { ChangeEvent } from "react";
import styled from "styled-components";
import { Select } from "../../Form.StyledComponents";
import { ISelectFieldOptions } from "./SelectField";

export interface ISelectInnerProps<T> {
  defaultKey: string;
  onValueChange: (value: T) => void;
  options: Array<ISelectFieldOptions<T>>;
}

export const SelectInner = (props: ISelectInnerProps<any>) => {
  return (
    <Select defaultValue={props.defaultKey} onChange={handleOnChange}>
      {props.options.map((o: ISelectFieldOptions<any>) => (
        <Option value={o.value} key={o.value}>
          {o.label}
        </Option>
      ))}
    </Select>
  );

  function handleOnChange(event: ChangeEvent<HTMLSelectElement>): void {
    const option: ISelectFieldOptions<any> = props.options.find(
      o => o.value === event.target.value
    );

    props.onValueChange(option ? option.value : null);
  }
};

const Option = styled.option`
  font-weight: ${p => p.theme.font.weight.normal};
`;
