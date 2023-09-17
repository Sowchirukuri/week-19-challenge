import { openDB } from 'idb';

const DATABASE_NAME = 'jate'; // Database name
const OBJECT_STORE_NAME = 'notes'; // Object store name

const initdb = async () => {
  const db = await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const store = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('content', 'content', { unique: false });
        console.log(`Database ${DATABASE_NAME} and object store ${OBJECT_STORE_NAME} created.`);
      }
    },
  });
  return db;
};

// Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await initdb();
  const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = tx.objectStore(OBJECT_STORE_NAME);

  try {
    await store.add({ content: content });
    console.log('Data added to the database:', content);
  } catch (error) {
    console.error('Error adding data to the database:', error);
  } finally {
    await tx.done;
  }
};

// Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await initdb();
  const tx = db.transaction(OBJECT_STORE_NAME, 'readonly');
  const store = tx.objectStore(OBJECT_STORE_NAME);

  try {
    const allContent = await store.getAll();
    console.log('All content retrieved from the database:', allContent);
    return allContent;
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
  } finally {
    await tx.done;
  }
};

initdb();
