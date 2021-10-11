import pickle

def save_count(count):
    with open('count.data', 'wb') as file:
        pickle.dump({
            'count' : count
        }, file)

def get_count():
    with open('count.data', 'rb') as file:
        obj = pickle.load(file)
        return obj['count']