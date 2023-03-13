import Model, { ModelData } from './Model';
import CapabilitySet from './Models/CapabilitySet';
import Combo from './Models/Combo';
import Device from './Models/Device';
import DeviceFirmware from './Models/DeviceFirmware';
import LteComponent from './Models/LteComponent';
import Modem from './Models/Modem';
import NrComponent from './Models/NrComponent';

type ConstructorFunction<T extends Model> = new (...args: any[]) => T;

export interface StoreQuery {
  include?: string[];
  filter?: Record<string, string>;
  sort?: string;
  page?: {
    offset?: number;
    limit?: number;
  };
}

export interface RequestOptions {
  abortController: AbortController;
}

export interface JsonApiPayload {
  data: ModelData | ModelData[];
  included?: ModelData[];
  links?: {
    self: string;
    last?: string;
    next?: string;
    prev?: string;
  };
  meta?: {
    offset: string | number;
    limit: string | number;
    total: string | number;
  };
}

function serializeQueryString(toSerialize: Record<string, unknown>, prefix?: string) {
  const keyValuePairs: string[] = [];

  Object.keys(toSerialize).forEach((attribute) => {
    if (Object.prototype.hasOwnProperty.call(toSerialize, attribute)) {
      const key = prefix ? `${prefix}[${attribute}]` : attribute;
      const value = toSerialize[attribute];
      const toBePushed =
        value !== null && typeof value === 'object' ? serializeQueryString(value as Record<string, unknown>, key) : `${key}=${value}`;
      keyValuePairs.push(toBePushed);
    }
  });

  return keyValuePairs.join('&');
}

export default class Store {
  protected dataStore: Record<string, Map<string, Model>> = {};
  public models: Record<string, typeof Model> = {
    'capability-sets': CapabilitySet,
    combos: Combo,
    devices: Device,
    'device-firmwares': DeviceFirmware,
    'lte-components': LteComponent,
    modems: Modem,
    'nr-components': NrComponent,
  };

  readonly baseUrl: string = process.env.GATSBY_API_BASE_URL!;

  getById<M extends Model>(type: string, id: string): M | undefined {
    return this.dataStore[type]?.get(id) as M | undefined;
  }

  getFirstBy<M extends Model>(type: string, attributeName: string, value: string): M | undefined {
    const allIds = Array.from(this.dataStore[type]?.keys() || []);

    if (!allIds) return undefined;

    const matchingId = allIds.find((id) => {
      const model = this.getById(type, id);

      if (model?.[attributeName]() === value) return true;
    });

    return this.getById(type, matchingId!) as M;
  }

  async find<M extends Model>(type: string, idOrQuery: number | string, options?: RequestOptions): Promise<M | undefined>;
  async find<M extends Model[]>(type: string, idOrQuery?: StoreQuery, options?: RequestOptions): Promise<M | undefined>;
  async find<M extends Model | Model[]>(
    type: string,
    idOrQuery: undefined | number | string | StoreQuery,
    options?: RequestOptions
  ): Promise<M | (M[] & { payload: JsonApiPayload }) | undefined> {
    const query = (['string', 'number'].includes(typeof idOrQuery) ? null : idOrQuery) as StoreQuery | null;
    const id = query ? null : (idOrQuery as string | number);

    const include = query?.include?.join(',') || undefined;
    const filter = query?.filter;

    const newQ: Record<string, unknown> = {};

    if (filter) newQ.filter = filter;
    if (include) newQ.include = include;
    if (query?.page) newQ.page = query.page;
    if (query?.sort) newQ.sort = query.sort;

    const queryStr = serializeQueryString(newQ);

    const URI = new URL(`${this.baseUrl}/${type}${id ? `/${id}` : ''}`);
    URI.search = queryStr;

    const response = await fetch(URI.toString(), {
      headers: {
        Accept: 'application/vnd.api+json',
      },
      signal: options?.abortController.signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch model.');
    }

    const apiPayload = (await response.json()) as JsonApiPayload;

    const models = this.pushPayload(apiPayload);

    return id ? (models[0] as M) : (models as M[] & { payload: JsonApiPayload });
  }

  pushPayload(payload: JsonApiPayload): Model[] & { payload: JsonApiPayload } {
    const { data, included } = payload;

    const models = [] as any as Model[] & { payload: JsonApiPayload };

    if (included) {
      included.map((modelData) => this.pushModel(modelData));
    }

    if (Array.isArray(data)) {
      const d = data.map((modelData) => this.pushModel(modelData)).filter((d) => !!d) as Model[];
      models.push(...d);
    } else {
      const d = this.pushModel(data);
      if (d) models.push(d);
    }

    models.payload = payload;

    return models;
  }

  pushModel(modelData: ModelData): Model | undefined {
    const { type, id } = modelData;

    this.dataStore[type] ||= new Map();

    const modelClass = this.models[modelData.type] as any as ConstructorFunction<Model> | undefined;

    if (!modelClass) {
      console.warn(`[Store] Attempted to push model of type "${modelData.type}" to database, but no such model is defined.`);
      return undefined;
    }

    const model: Model = new modelClass(modelData, this);

    this.dataStore[type].set(id, model);

    return model;
  }
}
