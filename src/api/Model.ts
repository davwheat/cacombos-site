import Store from './Store';

export interface ModelData<Attributes = Record<string, unknown>> {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: Attributes;
  relationships: Record<string, ModelRelation>;
}

export interface ModelSaveData<Attributes = Record<string, unknown>> {
  attributes?: Attributes;
  relationships?: Record<string, ModelRelation>;
}

export interface ModelIdentifier {
  type: string;
  id: string;
}

export interface ModelRelation {
  data: ModelIdentifier | ModelIdentifier[];
}

export default abstract class Model {
  protected data: null | ModelData;
  protected store: null | Store;
  abstract readonly type: string;

  /**
   * @param data A resource object from the API.
   */
  constructor(data: ModelData, store: Store) {
    this.data = data || {};
    this.store = store;
  }

  id() {
    return this.data?.id;
  }

  /**
   * Get one of the model's attributes.
   *
   * @final
   */
  attribute<T = unknown>(attribute: string): T {
    return this.data?.attributes?.[attribute] as T;
  }

  protected rawRelationship<M extends Model>(relationship: string): undefined | ModelIdentifier;
  protected rawRelationship<M extends Model[]>(relationship: string): undefined | ModelIdentifier[];
  protected rawRelationship<_M extends Model | Model[]>(relationship: string): undefined | ModelIdentifier | ModelIdentifier[] {
    return this.data?.relationships?.[relationship]?.data;
  }

  /**
   * Generate a function which returns the value of the given attribute.
   *
   * @param transform A function to transform the attribute value
   */
  static attribute<T>(name: string): () => T;
  static attribute<T, O = unknown>(name: string, transform: (attr: O) => T): () => T;
  static attribute<T, O = unknown>(name: string, transform?: (attr: O) => T): () => T {
    return function (this: Model) {
      if (transform) {
        return transform(this.attribute(name));
      }

      return this.attribute(name);
    };
  }

  /**
   * Generate a function which returns the value of the given has-one
   * relationship.
   *
   * @return false if no information about the
   *     relationship exists; undefined if the relationship exists but the model
   *     has not been loaded; or the model if it has been loaded.
   */
  static hasOne<M extends Model>(name: string): () => M | false;
  static hasOne<M extends Model | null>(name: string): () => M | null | false;
  static hasOne<M extends Model>(name: string): () => M | false {
    return function (this: Model) {
      const relationshipData = this.data?.relationships?.[name]?.data;

      if (relationshipData && relationshipData instanceof Array) {
        throw new Error(`Relationship ${name} on model ${this.data?.type} is plural, so the hasOne method cannot be used to access it.`);
      }

      if (relationshipData) {
        return this.store?.getById<M>(relationshipData.type, relationshipData.id) as M;
      }

      return false;
    };
  }

  /**
   * Generate a function which returns the value of the given has-many
   * relationship.
   *
   * @return false if no information about the relationship
   *     exists; an array if it does, containing models if they have been
   *     loaded, and undefined for those that have not.
   */
  static hasMany<M extends Model>(name: string): () => (M | undefined)[] | false {
    return function (this: Model) {
      const relationshipData = this.data!.relationships?.[name]?.data;

      if (relationshipData && !(relationshipData instanceof Array)) {
        throw new Error(`Relationship ${name} on model ${this.data!.type} is singular, so the hasMany method cannot be used to access it.`);
      }

      if (relationshipData) {
        return relationshipData.map((data) => this.store!.getById<M>(data.type, data.id));
      }

      return false;
    };
  }

  /**
   * Transform the given value into a Date object.
   */
  static transformDate(value: string): Date;
  static transformDate(value: string | null): Date | null;
  static transformDate(value: string | undefined): Date | undefined;
  static transformDate(value: string | null | undefined): Date | null | undefined;
  static transformDate(value: string | null | undefined): Date | null | undefined {
    return value != null ? new Date(value) : value;
  }

  /**
   * Get a resource identifier object for the given model.
   */
  static getIdentifier(model: Model): ModelIdentifier;
  static getIdentifier(model?: Model): ModelIdentifier | null {
    if (!model || !('id' in model.data!)) return null;

    return {
      type: model.data.type,
      id: model.data.id,
    };
  }

  protected generateSaveData(data: ModelSaveData) {
    return { data: { ...data, type: this.type, id: this.id() } };
  }

  async delete(token: string): Promise<boolean> {
    if (!this.data?.links.self) return false;

    const response = await fetch(this.data?.links.self!, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        'X-Auth-Token': token,
      },
    });

    return response.ok;
  }

  async saveData<M extends Model>(data: ModelSaveData, token: string): Promise<false | M> {
    let updateEndpoint;
    let methodType = 'POST';

    if (!!this.data?.id) {
      methodType = 'PATCH';
      updateEndpoint = new URL(`${this.store!.baseUrl}/${this.type}/${this.id()!}`);
    } else {
      updateEndpoint = new URL(`${this.store!.baseUrl}/${this.type}`);
    }

    const response = await fetch(updateEndpoint.toString(), {
      method: methodType,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify(this.generateSaveData(data)),
    });

    if (!response.ok) {
      return false;
    }

    const payload = this.store!.pushPayload(await response.json());

    return payload[0] as M;
  }
}
