import nextSession from 'next-session';
import { promisifyStore, expressSession } from 'next-session/lib/compat';
import pgSession from 'connect-pg-simple';

const PgStore = pgSession(expressSession);
const pgStore = new PgStore();

export const getSession = nextSession({
  store: promisifyStore(pgStore),
});
