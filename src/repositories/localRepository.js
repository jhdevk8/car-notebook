const createId = () =>
  crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// supabaseRepository와 같은 함수를 제공한다. 로그인하지 않았을 때 브라우저에 저장한다.
export function createLocalRepository(storageKey, initialData) {
  let memory = initialData;

  const read = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : memory;
    } catch {
      return memory;
    }
  };

  const write = (data) => {
    memory = data;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // 저장이 막힌 환경에서는 메모리에만 유지한다.
    }
  };

  const update = (change) => write(change(read()));

  return {
    load: async () => read(),

    clear: async () => {
      memory = initialData;
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // 저장이 막힌 환경에서는 메모리만 비운다.
      }
    },

    saveVehicle: async (vehicle) => {
      update((data) => ({ ...data, vehicle }));
      return vehicle;
    },

    addLog: async (log) => {
      const saved = { ...log, id: createId() };
      update((data) => ({ ...data, logs: [...data.logs, saved] }));
      return saved;
    },

    deleteLog: async (id) => {
      update((data) => ({ ...data, logs: data.logs.filter((log) => log.id !== id) }));
    },

    addReplacement: async (item) => {
      const saved = { ...item, id: createId() };
      update((data) => ({ ...data, replacements: [...data.replacements, saved] }));
      return saved;
    },

    deleteReplacement: async (id) => {
      update((data) => ({
        ...data,
        replacements: data.replacements.filter((item) => item.id !== id),
      }));
    },

    restore: async (backup) => {
      update((data) => {
        const dates = new Set(data.logs.map((log) => log.date));
        const ids = new Set(backup.replacements.map((item) => item.id));
        return {
          vehicle: data.vehicle || backup.vehicle,
          logs: [...data.logs, ...backup.logs.filter((log) => !dates.has(log.date))],
          replacements: [
            ...data.replacements.filter((item) => !ids.has(item.id)),
            ...backup.replacements,
          ],
        };
      });
    },
  };
}
