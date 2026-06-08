import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { CreateResponse, GetOneResponse, ListResponse, UpdateResponse } from "@/types";
import { HttpError } from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message: string = 'Request failed';

  try {
    const payload = (await response.json()) as { message?: string };

    if (payload?.message) message = payload.message;
  } catch (e) {
    // Ignore errors
  }

  return {
    message,
    statusCode: response.status,
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (field === "role") {
          params.role = value;
        }

        if (resource === "directions") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "users") {
          if (field === "search" || field === "name" || field === "email") {
            params.search = value;
          }
        }

        if (resource === "events") {
          if (field === "direction") params.direction = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "sessions") {
          if (field === "name") params.search = value;
          if (field === "event") params.event = value;
          if (field === "coordinator") params.coordinator = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    getRequestMethod: () => "put",

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: UpdateResponse = await response.json();
      return json.data ?? {};
    },
  },
};

const { dataProvider } = createDataProvider("/api", options);

export { dataProvider };