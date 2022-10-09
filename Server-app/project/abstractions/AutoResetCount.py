from datetime import datetime, timedelta
import pickle
import os

from django.conf import settings


class AutoResetCounter:
    """
    Only resets in init!
    """

    def __init__(self, count_name: str, reset_after: timedelta = timedelta(days=1),
                 storage_path: str = settings.BASE_DIR):
        self.pickle_path = os.path.join(storage_path, f"{count_name}.pkl")
        self.count = 0
        self.dt = datetime.now()
        cls = self.read()
        self.count = cls[0]
        self.dt = cls[1]

        if (datetime.now() - self.dt) >= reset_after:
            self.count = 0
            self.dt = datetime.now()

    def increment(self, by=1):
        self.count += by
        self.persist()

    def decrement(self, by=1):
        self.count -= by
        self.persist()

    def pickle_exists(self) -> bool:
        return os.path.exists(self.pickle_path)

    def read(self) -> list:
        if not self.pickle_exists():
            self.persist()

        with open(self.pickle_path, 'rb') as f:
            unpickler = pickle.Unpickler(f)
            parsed = unpickler.load()

        return parsed

    def persist(self):
        with open(self.pickle_path, 'wb') as f:
            pickle.dump([self.count, self.dt], f, pickle.HIGHEST_PROTOCOL)
