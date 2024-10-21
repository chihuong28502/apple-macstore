import Cookies from 'js-cookie';

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}
