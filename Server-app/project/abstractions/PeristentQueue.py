import pickle
import os

from django.conf import settings


class PersistentQueue:
    def __init__(self, queue_name, path=settings.BASE_DIR) -> None:
        self.pickle_path = os.path.join(path, f"{queue_name}.pkl")
        self.queue = []
        self.queue = self.read_queue()

    def enqueue(self, data: any):
        self.queue.append(data)
        self.persist()

    def dequeue(self):
        if len(self.queue) <= 0:
            return None

        data = self.queue.pop(0)
        self.persist()
        return data

    def dequeue_many(self, no_of_items: int) -> list:
        """
        Persistent is left to the caller
        """
        removed_items = self.queue[:no_of_items]
        new_list = self.queue[no_of_items:]
        self.queue = new_list
        return removed_items

    def is_empty(self):
        return self.size <= 0

    @property
    def size(self):
        return len(self.queue)

    def pickle_exists(self) -> bool:
        return os.path.exists(self.pickle_path)

    def read_queue(self) -> list:
        if not self.pickle_exists():
            self.persist()

        with open(self.pickle_path, 'rb') as f:
            unpickler = pickle.Unpickler(f)
            try:
                to_ret = unpickler.load()
            except EOFError:
                to_ret = []

        return to_ret

    def persist(self):
        with open(self.pickle_path, 'wb') as f:
            pickle.dump(self.queue, f, pickle.HIGHEST_PROTOCOL)
