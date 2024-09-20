// idb.js
// Developer: Sharon Salman, ID: 206919979, Developer: Ido Michael Bernea , ID: 316315837 
class IDBLibrary {
    constructor(dbName, version) {
      this.dbName = dbName;
      this.version = version;
      this.db = null;
    }
  
    async open() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => reject("Error opening database");
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const objectStore = db.createObjectStore("calorieItems", { keyPath: "id", autoIncrement: true });
          objectStore.createIndex("date", "date", { unique: false });
          objectStore.createIndex("category", "category", { unique: false });
        };
      });
    }
  
    async add(item) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["calorieItems"], "readwrite");
        const objectStore = transaction.objectStore("calorieItems");
        const request = objectStore.add(item);
  
        request.onerror = () => reject("Error adding item");
        request.onsuccess = () => resolve();
      });
    }
  
    async getAll() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["calorieItems"], "readonly");
        const objectStore = transaction.objectStore("calorieItems");
        const request = objectStore.getAll();
  
        request.onerror = () => reject("Error getting items");
        request.onsuccess = () => resolve(request.result);
      });
    }
  
    async getByMonthYear(month, year) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["calorieItems"], "readonly");
        const objectStore = transaction.objectStore("calorieItems");
        const index = objectStore.index("date");
  
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
  
        const range = IDBKeyRange.bound(startDate.toISOString(), endDate.toISOString());
        const request = index.getAll(range);
  
        request.onerror = () => reject("Error getting items for month and year");
        request.onsuccess = () => resolve(request.result);
      });
    }
  }
  
  export default IDBLibrary;