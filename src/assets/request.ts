import { ExtendedOptions, GenericResponse, ParsedRes } from "../types/request";

export async function makeRequest<T = any>(
  url: string,
  options?: ExtendedOptions
): Promise< ParsedRes<T>> {
  if (options?.params) {
    const filteredParams = Object.fromEntries(
      Object.entries(options.params).filter(([_, value]) => value !== undefined && value !== null)
    );
    url += `?${new URLSearchParams(filteredParams as Record<string, string>)}`;
  }

  if (options?.auth) {
    options.headers = {
      ...options.headers,
      authorization: 'Bearer ' + localStorage.getItem('authorization')
    };
  }

  console.log(url);
  
  const response = await fetch(url, options);
  return parseResponse<T>(response);
}

async function parseResponse<T>(res: Response): Promise<ParsedRes<T>> {
  const blob = await res.blob();

  try { return { statusCode: res.status, ...JSON.parse(await blob.text()) } as ParsedRes<T>; }
  // @ts-expect-error - this is intended
  catch { return await blob.text() as T }
}

export async function fetchBackend<T = any>(
  url: string, 
  options?: ExtendedOptions
): Promise<ParsedRes<GenericResponse<T>>> {
  return makeRequest<GenericResponse<T>>(`https://api.potat.app/${url}`, options);
}