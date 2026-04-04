import apiClient from "./axios";

const BASE_URL = "/hardware";
const HARDWARE_STORAGE_KEY = "ww_hardware";

const getAllHardware = () => {
  const raw = localStorage.getItem(HARDWARE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const setAllHardware = (hardwareList) => {
  localStorage.setItem(HARDWARE_STORAGE_KEY, JSON.stringify(hardwareList));
};

export const addHardware = async (data, userId) => {
  try {
    const res = await apiClient.post(`${BASE_URL}/add`, { ...data, userId });
    return res.data.hardware ?? res.data;
  } catch {
    const hardware = {
      id: crypto.randomUUID(),
      userId,
      productName: data.productName.trim(),
      wellName: data.wellName.trim(),
      thingSpeakChannelId: data.thingSpeakChannelId.trim(),
      thingSpeakReadApiKey: (data.thingSpeakReadApiKey || "").trim(),
      thingSpeakField: data.thingSpeakField.trim(),
      wellDepth: Number(data.wellDepth),
      wellWidth: Number(data.wellWidth),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      createdAt: new Date().toISOString()
    };

    const list = getAllHardware();
    list.push(hardware);
    setAllHardware(list);

    return hardware;
  }
};

export const getHardware = async (userId) => {
  try {
    const res = await apiClient.get(BASE_URL, { params: { userId } });
    return res.data.hardware ?? res.data;
  } catch {
    return getAllHardware().filter((item) => item.userId === userId);
  }
};

export const getHardwareById = async (hardwareId, userId) => {
  try {
    const res = await apiClient.get(`${BASE_URL}/${hardwareId}`);
    return res.data.hardware ?? res.data;
  } catch {
    const list = await getHardware(userId);
    return list.find((item) => item.id === hardwareId) ?? null;
  }
};

export const getSensorStatusByHardwareId = async (hardwareId, results = 12) => {
  try {
    const res = await apiClient.get(`${BASE_URL}/${hardwareId}/sensor-status`, {
      params: { results }
    });
    return res.data.sensor ?? null;
  } catch {
    return null;
  }
};

export const updateHardwareById = async (hardwareId, updates, userId) => {
  try {
    const res = await apiClient.put(`${BASE_URL}/${hardwareId}`, updates);
    return res.data.hardware ?? res.data;
  } catch {
    const list = getAllHardware();
    const index = list.findIndex((item) => item.id === hardwareId && item.userId === userId);

    if (index === -1) {
      throw new Error("Hardware not found for update.");
    }

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    setAllHardware(list);
    return updated;
  }
};

export const deleteHardwareById = async (hardwareId, userId) => {
  try {
    await apiClient.delete(`${BASE_URL}/${hardwareId}`);
    return { success: true };
  } catch {
    const list = getAllHardware();
    const filtered = list.filter((item) => !(item.id === hardwareId && item.userId === userId));

    if (filtered.length === list.length) {
      throw new Error("Hardware not found for delete.");
    }

    setAllHardware(filtered);
    return { success: true };
  }
};
