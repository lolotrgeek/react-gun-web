// storage.ts
// https://github.com/react-native-community/async-storage/blob/master/packages/core/docs/Usage.md
import AsyncStorageFactory from '@react-native-community/async-storage';
import LegacyStorage from '@react-native-community/async-storage-backend-legacy';

const legacyStorage = new LegacyStorage();

export type StorageModel = {}

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage)

export default storage;