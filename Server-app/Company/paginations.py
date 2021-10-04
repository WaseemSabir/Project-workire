from rest_framework import pagination

class JobPagination(pagination.PageNumberPagination):
    page_size = 10