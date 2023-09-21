import { BaseWrapperCollection } from "../common/wrappers/BaseWrapperCollection";
import { MetricItemWrapper } from "./MetricItemWrapper";

export class MetricWrapperCollection extends BaseWrapperCollection<MetricItemWrapper> {
  addMeasurement() {
    this.current.addMeasurement();
  }

  visit() {
    this.current.visit();
  }
}
