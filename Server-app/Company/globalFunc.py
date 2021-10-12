import pickle
import os
from django.conf import settings

# To-do : to make all the paths dynamic

def save_count(count):
    path = os.path.join(settings.BASE_DIR, 'Company')
    to_open = os.path.join(path,'count.data')
    with open(to_open, 'wb') as file:
        pickle.dump({
            'count' : count
        }, file)

def get_count():
    path = os.path.join(settings.BASE_DIR, 'Company')
    to_open = os.path.join(path,'count.data')
    with open(to_open, 'rb') as file:
        obj = pickle.load(file)
        return obj['count']