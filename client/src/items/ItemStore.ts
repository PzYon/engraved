import {
  IItem,
  IKeyword,
  ISorting,
  ItemSearchQuery,
  SortDirection,
  Util
} from "engraved-shared";
import { BehaviorSubject, Observable, Observer, SubscriptionLike } from "rxjs";
import { map } from "rxjs/operators";
import { AuthenticatedServerApi } from "../authentication/AuthenticatedServerApi";

export class ItemStore {
  private static cachedInstance: ItemStore;
  public userHasNoItems: boolean;

  public static get instance(): ItemStore {
    if (!this.cachedInstance) {
      this.cachedInstance = new ItemStore();
    }
    return this.cachedInstance;
  }

  public items$: BehaviorSubject<IItem[]> = new BehaviorSubject<IItem[]>([]);

  public keywords$: BehaviorSubject<IKeyword[]> = new BehaviorSubject<
    IKeyword[]
  >([]);

  public searchText$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public noPagesLeft: boolean = false;

  public isFirstLoad: boolean = true;

  public sorting: ISorting = {
    propName: "editedOn",
    direction: SortDirection.Descending
  };

  public get isFirstPage(): boolean {
    return this.pageNumber === 0;
  }

  private pageNumber: number = 0;

  private readonly pageSize: number = 20;

  private nextItemsSubscription: SubscriptionLike;

  private constructor() {}

  public static isInvalidSearchText(searchText: string) {
    return !searchText || searchText.trim().length === 0;
  }

  public toggleKeyword(keyword: IKeyword): boolean {
    const copy = [...this.keywords$.value];

    const isNew: boolean = Util.toggleArrayValue(
      copy,
      keyword,
      (k: IKeyword) => k._id === keyword._id
    );

    this.keywords$.next(copy);

    return isNew;
  }

  public addItem = (item: IItem): Observable<IItem> => {
    return AuthenticatedServerApi.post("items", item);
  };

  // we send the item to the server and then update it in the (client) cache
  public updateItem = (item: IItem): Observable<IItem> => {
    return AuthenticatedServerApi.patch("items/" + item._id, item).pipe(
      map((r: IItem) => this.updateCache(r))
    );
  };

  public deleteItem = (itemId: string): Observable<any> => {
    return AuthenticatedServerApi.delete("items/" + itemId).pipe(
      map(() => this.deleteFromCache(itemId))
    );
  };

  public searchKeywords = (searchText: string): Observable<IKeyword[]> => {
    return AuthenticatedServerApi.get<IKeyword[]>(
      `keywords${searchText ? `?q=${searchText}` : ""}`
    );
  };

  public loadItems = (isPaging?: boolean): void => {
    if (!isPaging) {
      this.pageNumber = 0;
      this.noPagesLeft = false;
    } else {
      this.pageNumber++;
    }

    if (this.nextItemsSubscription) {
      this.nextItemsSubscription.unsubscribe();
    }

    const itemSearchQuery = this.createQuery();
    const urlQuery = itemSearchQuery.toUrl();

    console.log(`ItemStore: calling server @ "${urlQuery}"`);

    this.nextItemsSubscription = AuthenticatedServerApi.get<IItem[]>(
      `items?${urlQuery}`
    ).subscribe((items: IItem[]) => {
      if (!items.length || items.length < this.pageSize) {
        this.noPagesLeft = true;
      }

      this.userHasNoItems =
        items.length === 0 &&
        !itemSearchQuery.hasConditions &&
        !itemSearchQuery.skip;

      // not happy with this approach, but i believe the whole
      // ItemStore needs to be refactored sooner or later.
      this.isFirstLoad = false;

      const allItems = isPaging ? [...this.items$.value, ...items] : items;

      this.items$.next(allItems);
    });
  };

  public resetAndLoad(): void {
    this.keywords$.next([]);
    this.searchText$.next("");
    this.pageNumber = 0;
    this.loadItems();
  }

  public getLocalItemOrLoad(id: string): Observable<IItem> {
    const localItem: IItem | undefined = this.items$.value.find(
      i => i._id === id
    );

    if (localItem) {
      return new Observable((observer: Observer<IItem>) => {
        observer.next(localItem);
        observer.complete();
      });
    }

    return AuthenticatedServerApi.get<IItem>(`items/${id}`);
  }

  private createQuery(): ItemSearchQuery {
    return new ItemSearchQuery(
      this.searchText$.value,
      this.keywords$.value.map(k => k.name),
      this.pageNumber * this.pageSize,
      this.pageSize,
      this.sorting
    );
  }

  private deleteFromCache(id: string): void {
    this.doWithCachedItem(id, (itemIndex: number, newItemsArray: IItem[]) => {
      newItemsArray.splice(itemIndex, 1);
      return newItemsArray;
    });
  }

  private updateCache(item: IItem): IItem {
    this.doWithCachedItem(
      item._id,
      (itemIndex: number, newItemsArray: IItem[]): IItem[] => {
        newItemsArray[itemIndex] = item;
        return newItemsArray;
      }
    );

    return item;
  }

  private doWithCachedItem(
    id: string,
    callback: (itemIndex: number, newItemsArray: IItem[]) => IItem[]
  ): void {
    const cachedItems: IItem[] = this.items$.value;
    const cachedItemIndex: number = cachedItems.findIndex(i => i._id === id);

    if (cachedItemIndex > -1) {
      const modifiedItems: IItem[] = callback(cachedItemIndex, [
        ...cachedItems
      ]);
      this.items$.next(modifiedItems);
    }
  }
}
