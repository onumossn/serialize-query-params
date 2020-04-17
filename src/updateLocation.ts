import { stringify, parse as parseQueryString, parseUrl } from 'query-string';
import { EncodedQuery } from './types';

/**
 * Update a location, wiping out parameters not included in encodedQuery
 * If a param is set to undefined it will be removed from the URL.
 */
export function updateLocation(
  encodedQuery: EncodedQuery,
  location: Location
): Location {
  const encodedSearchString = stringify(encodedQuery);
  const search = encodedSearchString.length ? `?${encodedSearchString}` : '';
  const href = parseUrl(location.href || '').url + search;

  const newLocation: Location & {
    key: string;
    query: EncodedQuery;
  } = {
    ...location,
    key: `${Date.now()}`, // needed for some routers (e.g. react-router)
    href,
    search,
    query: encodedQuery, // needed for some routers (e.g. found)
  };

  return newLocation;
}

/**
 * Update a location while retaining existing parameters.
 * If a param is set to undefined it will be removed from the URL.
 */
export function updateInLocation(
  encodedQueryReplacements: EncodedQuery,
  location: Location
): Location {
  // if a query is there, use it, otherwise parse the search string
  const currQuery =
    (location as any).query || parseQueryString(location.search);

  const newQuery = {
    ...currQuery,
    ...encodedQueryReplacements,
  };

  return updateLocation(newQuery, location);
}
