import { toRepositoryError } from './repositoryError.js';

const LOG_COLUMNS = 'id, log_date, km';
const REPLACEMENT_COLUMNS = 'id, type, product, replaced_on, km, memo';

const unwrap = ({ data, error }) => {
  if (error) throw toRepositoryError(error);
  return data;
};

// DB의 컬럼 이름과 앱의 필드 이름을 여기서만 변환한다.
const toLog = ({ id, log_date, km }) => ({ id, date: log_date, km });
const toReplacement = ({ id, type, product, replaced_on, km, memo }) => ({
  id,
  type,
  product,
  date: replaced_on,
  km,
  memo,
});

export function createSupabaseRepository(client, userId) {
  const softDelete = async (table, id) => {
    unwrap(
      await client.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id)
    );
  };

  const saveVehicle = async (name) => {
    unwrap(
      await client
        .from('vehicles')
        .upsert(
          { user_id: userId, name, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
    );
    return name;
  };

  const load = async () => {
    const [vehicle, logs, replacements] = await Promise.all([
      client.from('vehicles').select('name').maybeSingle(),
      client.from('mileage_logs').select(LOG_COLUMNS).is('deleted_at', null),
      client.from('replacements').select(REPLACEMENT_COLUMNS).is('deleted_at', null),
    ]);

    return {
      vehicle: unwrap(vehicle)?.name ?? '',
      logs: unwrap(logs).map(toLog),
      replacements: unwrap(replacements).map(toReplacement),
    };
  };

  return {
    load,
    saveVehicle,

    addLog: async ({ date, km }) =>
      toLog(
        unwrap(
          await client
            .from('mileage_logs')
            .insert({ user_id: userId, log_date: date, km })
            .select(LOG_COLUMNS)
            .single()
        )
      ),

    deleteLog: (id) => softDelete('mileage_logs', id),

    addReplacement: async ({ type, product, date, km, memo }) =>
      toReplacement(
        unwrap(
          await client
            .from('replacements')
            .insert({ user_id: userId, type, product, replaced_on: date, km, memo })
            .select(REPLACEMENT_COLUMNS)
            .single()
        )
      ),

    deleteReplacement: (id) => softDelete('replacements', id),

    // 백업을 현재 기록에 합친다. 지금 있는 기록을 지우지 않는다.
    restore: async (backup) => {
      const current = await load();
      const currentDates = new Set(current.logs.map((log) => log.date));
      const newLogs = backup.logs
        .filter((log) => !currentDates.has(log.date))
        .map(({ date, km }) => ({ user_id: userId, log_date: date, km }));

      if (newLogs.length > 0) {
        unwrap(await client.from('mileage_logs').insert(newLogs));
      }

      if (backup.replacements.length > 0) {
        const rows = backup.replacements.map(({ id, type, product, date, km, memo }) => ({
          id,
          user_id: userId,
          type,
          product,
          replaced_on: date,
          km,
          memo,
          deleted_at: null,
        }));
        unwrap(await client.from('replacements').upsert(rows, { onConflict: 'id' }));
      }

      if (!current.vehicle && backup.vehicle) {
        await saveVehicle(backup.vehicle);
      }
    },
  };
}
