from rest_framework import pagination


# Not used
class JobPagination(pagination.PageNumberPagination):
    page_size = 10
