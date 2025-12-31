/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Achievement {
  /** @format int32 */
  id?: number;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  statToTrack?: string | null;
  /** @format int32 */
  threshold?: number;
  /** @format int32 */
  companyId?: number;
  company?: Company;
  employeeAchievements?: EmployeeAchievement[] | null;
}

export interface AchievementDTO {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  statToTrack?: string | null;
  /** @format int32 */
  threshold?: number;
}

export interface Attendee {
  /** @format int32 */
  eventId?: number;
  /** @format int32 */
  employeeId?: number;
  event?: Event;
  employee?: Employee;
}

export interface Company {
  /** @format int32 */
  id?: number;
  name?: string | null;
  key?: string | null;
  isActive?: boolean;
  employees?: Employee[] | null;
  achievements?: Achievement[] | null;
  rooms?: Room[] | null;
  events?: Event[] | null;
  reservations?: Reservation[] | null;
}

export interface CompanyDTO {
  name?: string | null;
  key?: string | null;
}

export interface Employee {
  /** @format int32 */
  id?: number;
  email?: string | null;
  passwordHash?: string | null;
  admin?: boolean;
  /** @format int32 */
  meetingsAttended?: number;
  /** @format int32 */
  largestTeamSize?: number;
  /** @format int32 */
  totalMeetingTime?: number;
  /** @format int32 */
  eventsAttended?: number;
  /** @format int32 */
  eventsOrganized?: number;
  /** @format int32 */
  roomsBooked?: number;
  /** @format int32 */
  companyId?: number;
  isDeleted?: boolean;
  company?: Company;
  attendances?: Attendee[] | null;
  employeeAchievements?: EmployeeAchievement[] | null;
  reservations?: Reservation[] | null;
}

export interface EmployeeAchievement {
  /** @format int32 */
  employeeId?: number;
  /** @format int32 */
  achievementId?: number;
  /** @format date-time */
  dateAchieved?: string;
  /** @format int32 */
  companyId?: number;
  employee?: Employee;
  achievement?: Achievement;
  company?: Company;
}

export interface EmployeeAchievementDTO {
  /** @format int32 */
  employeeId?: number;
  /** @format int32 */
  achievementId?: number;
  /** @format date-time */
  dateAchieved?: string;
}

export interface EmployeeStatsDTO {
  /** @format int32 */
  meetingsAttended?: number;
  /** @format int32 */
  teamAmount?: number;
  /** @format int32 */
  totalMeetingTime?: number;
  /** @format int32 */
  eventsAttended?: number;
  /** @format int32 */
  eventsOrganized?: number;
  /** @format int32 */
  roomsBooked?: number;
}

export interface Event {
  /** @format int32 */
  id?: number;
  title?: string | null;
  description?: string | null;
  /** @format date-time */
  date?: string;
  /** @format date-time */
  startTime?: string;
  /** @format date-time */
  endTime?: string;
  location?: string | null;
  /** @format int32 */
  capacity?: number;
  /** @format int32 */
  companyId?: number;
  company?: Company;
  attendees?: Attendee[] | null;
}

export interface EventDTO {
  title?: string | null;
  description?: string | null;
  /** @format date-time */
  date?: string;
  /** @format date-time */
  startTime?: string;
  /** @format date-time */
  endTime?: string;
  location?: string | null;
  /** @format int32 */
  capacity?: number;
}

export interface Reservation {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  date?: string;
  /** @format int32 */
  employeeId?: number;
  /** @format int32 */
  roomId?: number;
  /** @format int32 */
  timeslotId?: number;
  /** @format int32 */
  companyId?: number;
  employee?: Employee;
  room?: Room;
  timeslot?: Timeslot;
  company?: Company;
}

export interface Room {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format int32 */
  capacity?: number;
  /** @format int32 */
  companyId?: number;
  company?: Company;
  reservations?: Reservation[] | null;
}

export interface RoomDTO {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format int32 */
  capacity?: number;
}

export interface Timeslot {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  startTime?: string;
  /** @format date-time */
  endTime?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Calendar Backend API
 * @version v1
 *
 * API for managing calendar, events, rooms, reservations, employees, and achievements
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Achievement
     * @name AchievementCompanyDetail
     * @request GET:/api/Achievement/company/{companyId}
     */
    achievementCompanyDetail: (companyId: number, params: RequestParams = {}) =>
      this.request<Achievement[], any>({
        path: `/api/Achievement/company/${companyId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Achievement
     * @name AchievementDetail
     * @request GET:/api/Achievement/{id}
     */
    achievementDetail: (id: number, params: RequestParams = {}) =>
      this.request<Achievement, any>({
        path: `/api/Achievement/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Achievement
     * @name AchievementUpdate
     * @request PUT:/api/Achievement/{id}
     */
    achievementUpdate: (
      id: number,
      data: AchievementDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Achievement/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Achievement
     * @name AchievementDelete
     * @request DELETE:/api/Achievement/{id}
     */
    achievementDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Achievement/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Achievement
     * @name AchievementCreate
     * @request POST:/api/Achievement
     */
    achievementCreate: (
      data: AchievementDTO,
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Achievement`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyDetail
     * @request GET:/api/Company/{id}
     */
    companyDetail: (id: number, params: RequestParams = {}) =>
      this.request<Company, any>({
        path: `/api/Company/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyUpdate
     * @request PUT:/api/Company/{id}
     */
    companyUpdate: (id: number, data: CompanyDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Company/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyCreate
     * @request POST:/api/Company
     */
    companyCreate: (data: CompanyDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Company`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanySoftDelete
     * @request DELETE:/api/Company/soft/{id}
     */
    companySoftDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Company/soft/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name CompanyHardDelete
     * @request DELETE:/api/Company/hard/{id}
     */
    companyHardDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Company/hard/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeList
     * @request GET:/api/Employee
     */
    employeeList: (params: RequestParams = {}) =>
      this.request<Employee[], any>({
        path: `/api/Employee`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeCreate
     * @request POST:/api/Employee
     */
    employeeCreate: (data: Employee, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Employee`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeDetail
     * @request GET:/api/Employee/{id}
     */
    employeeDetail: (id: number, params: RequestParams = {}) =>
      this.request<Employee, any>({
        path: `/api/Employee/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeUpdate
     * @request PUT:/api/Employee/{id}
     */
    employeeUpdate: (id: number, data: Employee, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Employee/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeEmailDetail
     * @request GET:/api/Employee/email/{email}
     */
    employeeEmailDetail: (email: string, params: RequestParams = {}) =>
      this.request<Employee, any>({
        path: `/api/Employee/email/${email}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeStatsDetail
     * @request GET:/api/Employee/stats/{id}
     */
    employeeStatsDetail: (id: number, params: RequestParams = {}) =>
      this.request<EmployeeStatsDTO, any>({
        path: `/api/Employee/stats/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeSoftDelete
     * @request DELETE:/api/Employee/soft/{id}
     */
    employeeSoftDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Employee/soft/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeHardDelete
     * @request DELETE:/api/Employee/hard/{id}
     */
    employeeHardDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Employee/hard/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeIncrementCreate
     * @request POST:/api/Employee/increment/{id}/{statName}
     */
    employeeIncrementCreate: (
      id: number,
      statName: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Employee/increment/${id}/${statName}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Employee
     * @name EmployeeDecrementCreate
     * @request POST:/api/Employee/decrement/{id}/{statName}
     */
    employeeDecrementCreate: (
      id: number,
      statName: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Employee/decrement/${id}/${statName}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags EmployeeAchievement
     * @name EmployeeAchievementAssignCreate
     * @request POST:/api/EmployeeAchievement/assign
     */
    employeeAchievementAssignCreate: (
      data: EmployeeAchievementDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/EmployeeAchievement/assign`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags EmployeeAchievement
     * @name EmployeeAchievementRemoveCreate
     * @request POST:/api/EmployeeAchievement/remove
     */
    employeeAchievementRemoveCreate: (
      data: EmployeeAchievementDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/EmployeeAchievement/remove`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags EmployeeAchievement
     * @name EmployeeAchievementEmployeeDetail
     * @request GET:/api/EmployeeAchievement/employee/{employeeId}
     */
    employeeAchievementEmployeeDetail: (
      employeeId: number,
      params: RequestParams = {},
    ) =>
      this.request<Achievement[], any>({
        path: `/api/EmployeeAchievement/employee/${employeeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags EmployeeAchievement
     * @name EmployeeAchievementAchievementDetail
     * @request GET:/api/EmployeeAchievement/achievement/{achievementId}
     */
    employeeAchievementAchievementDetail: (
      achievementId: number,
      params: RequestParams = {},
    ) =>
      this.request<Employee[], any>({
        path: `/api/EmployeeAchievement/achievement/${achievementId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventList
     * @request GET:/api/Event
     */
    eventList: (
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Event[], any>({
        path: `/api/Event`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventCreate
     * @request POST:/api/Event
     */
    eventCreate: (data: EventDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Event`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventDetail
     * @request GET:/api/Event/{id}
     */
    eventDetail: (id: number, params: RequestParams = {}) =>
      this.request<Event, any>({
        path: `/api/Event/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventUpdate
     * @request PUT:/api/Event/{id}
     */
    eventUpdate: (id: number, data: EventDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Event/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Event
     * @name EventDelete
     * @request DELETE:/api/Event/{id}
     */
    eventDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Event/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationList
     * @request GET:/api/Reservation
     */
    reservationList: (
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Reservation[], any>({
        path: `/api/Reservation`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationCreate
     * @request POST:/api/Reservation
     */
    reservationCreate: (data: Reservation, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Reservation`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationDetail
     * @request GET:/api/Reservation/{id}
     */
    reservationDetail: (id: number, params: RequestParams = {}) =>
      this.request<Reservation, any>({
        path: `/api/Reservation/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationUpdate
     * @request PUT:/api/Reservation/{id}
     */
    reservationUpdate: (
      id: number,
      data: Reservation,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Reservation/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationRoomEmployeeDateDelete
     * @request DELETE:/api/Reservation/room/{roomId}/employee/{employeeId}/date/{date}
     */
    reservationRoomEmployeeDateDelete: (
      roomId: number,
      employeeId: number,
      date: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Reservation/room/${roomId}/employee/${employeeId}/date/${date}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationEmployeeDetail
     * @request GET:/api/Reservation/employee/{employeeId}
     */
    reservationEmployeeDetail: (
      employeeId: number,
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Reservation[], any>({
        path: `/api/Reservation/employee/${employeeId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationRoomDetail
     * @request GET:/api/Reservation/room/{roomId}
     */
    reservationRoomDetail: (
      roomId: number,
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Reservation[], any>({
        path: `/api/Reservation/room/${roomId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Reservation
     * @name ReservationDateDetail
     * @request GET:/api/Reservation/date/{date}
     */
    reservationDateDetail: (
      date: string,
      query?: {
        /** @format int32 */
        companyId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Reservation[], any>({
        path: `/api/Reservation/date/${date}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomCompanyDetail
     * @request GET:/api/Room/company/{companyId}
     */
    roomCompanyDetail: (companyId: number, params: RequestParams = {}) =>
      this.request<Room[], any>({
        path: `/api/Room/company/${companyId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomDetail
     * @request GET:/api/Room/{id}
     */
    roomDetail: (id: number, params: RequestParams = {}) =>
      this.request<Room, any>({
        path: `/api/Room/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomUpdate
     * @request PUT:/api/Room/{id}
     */
    roomUpdate: (id: number, data: RoomDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Room/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomDelete
     * @request DELETE:/api/Room/{id}
     */
    roomDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Room/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomCompanyNameDetail
     * @request GET:/api/Room/company/{companyId}/name/{name}
     */
    roomCompanyNameDetail: (
      name: string,
      companyId: number,
      params: RequestParams = {},
    ) =>
      this.request<Room, any>({
        path: `/api/Room/company/${companyId}/name/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomCompanyCapacityDetail
     * @request GET:/api/Room/company/{companyId}/capacity/{capacity}
     */
    roomCompanyCapacityDetail: (
      capacity: number,
      companyId: number,
      params: RequestParams = {},
    ) =>
      this.request<Room[], any>({
        path: `/api/Room/company/${companyId}/capacity/${capacity}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Room
     * @name RoomCreate
     * @request POST:/api/Room
     */
    roomCreate: (data: RoomDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Room`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Timeslot
     * @name TimeslotList
     * @request GET:/api/Timeslot
     */
    timeslotList: (params: RequestParams = {}) =>
      this.request<Timeslot[], any>({
        path: `/api/Timeslot`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Timeslot
     * @name TimeslotDetail
     * @request GET:/api/Timeslot/{id}
     */
    timeslotDetail: (id: number, params: RequestParams = {}) =>
      this.request<Timeslot, any>({
        path: `/api/Timeslot/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Timeslot
     * @name TimeslotStartDetail
     * @request GET:/api/Timeslot/start/{startTime}
     */
    timeslotStartDetail: (startTime: string, params: RequestParams = {}) =>
      this.request<Timeslot, any>({
        path: `/api/Timeslot/start/${startTime}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
