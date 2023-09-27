import { BaseWrapperCollection } from "../../common/wrappers/BaseWrapperCollection";
import { ScrapItemWrapper } from "./ScrapItemWrapper";

export class ScrapWrapperCollection extends BaseWrapperCollection<ScrapItemWrapper> {
  async update() {
    await this.current.upsertScrap();
    this.setIndex(-1);
  }
}
