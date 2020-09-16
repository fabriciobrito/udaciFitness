import { useAsyncStorage } from '@react-native-community/async-storage';
import { CALENDAR_STORAGE_KEY } from './_calendar';

export function submitEntry({ entry, key }) {
  return useAsyncStorage(CALENDAR_STORAGE_KEY).mergeItem({
    [key]: JSON.stringify(entry)
  })
}

export function removeEntry(key) {
  return useAsyncStorage(CALENDAR_STORAGE_KEY)
    .getItem()
    .then((results) => {
      const data = JSON.parse(results)
      data[key] = undefined;
      delete data[key];
      useAsyncStorage(CALENDAR_STORAGE_KEY).setItem(JSON.stringify(data));
  })
}