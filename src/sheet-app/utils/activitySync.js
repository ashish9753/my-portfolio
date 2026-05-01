export const ACTIVITY_UPDATED_EVENT = 'sheetActivityUpdated';

export const notifyActivityUpdated = () => {
  window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
};
